const { QueryTypes } = require("sequelize");
const getUnits = require("./getUnits");

const SoldierCategoryMap = [
  { text: "صف", mappedValue: "officer" },
  { text: "كاتب", mappedValue: "writer" },
  { text: "مهنى", mappedValue: "professional" },
  { text: "حرفى", mappedValue: "literal" },
  { text: "سائق عجل", mappedValue: "driver" }
];

const SoliderLevelsMap = [
  { soldierLevel: "جندي", mappedValue: "Solider", isSolider: true },
  { soldierLevel: "عريف", mappedValue: "SoliderArraf", isSolider: true },
  {
    soldierLevel: "عريف",
    mappedValue: "Arraf",
    optionsQuery: `in (N'عريف' ,N'صـانع عسكرى')`
  },
  {
    soldierLevel: "رقيب",
    mappedValue: "Rkaab",
    optionsQuery: `in (N'رقيب',N'صانع ماهر')`
  },
  {
    soldierLevel: "رقيب أ",
    mappedValue: "RkaabA",
    optionsQuery: `in (N'رقيب أ' , N'صانع دقيق',N'رقيب اول')`
  },
  {
    soldierLevel: "مساعد",
    mappedValue: "Mosaad",
    optionsQuery: `in (N'مساعد' , N'ملاحظ فنى عسكرى' , N'صانع  ممتاز')`
  }
];

const lodash = require("lodash");

module.exports = async (db, params) => {
  function runQuery(query) {
    return db.sequelize.query(query, {
      type: QueryTypes.SELECT
    });
  }
  // get units
  const units = await getUnits(db, params);
  const categories = SoldierCategoryMap.filter(
    ele => params.SoldierCategories.indexOf(ele.text) > -1
  );

  const soliderLevels = SoliderLevelsMap;

  const result = await Promise.all(
    units.map(async ele => {
      for (const category of categories) {
        if (!ele[category.mappedValue]) ele[category.mappedValue] = {};

        for (const level of soliderLevels.filter(ele => ele.isSolider)) {
          if (!ele[category.mappedValue][level.mappedValue])
            ele[category.mappedValue][level.mappedValue] = {};

          const count = await runQuery(`
           select Coalesce ( count(ID),0) count  from SMSoldier
           join Unit on Unit.UnitID = SMSoldier.UnitID 
           where Unit.Unit like N'%${ele.Unit}%'
           and RecuEndDate > getdate() and SoldierStatus = N'بالخدمة'
           and SoldierCategory  like  N'%${category.text}%'
           and SoldierLevel like N'%${level.soldierLevel}%' 
           `);

          const mortab = await runQuery(`
           select  Coalesce ( SUM(El_Moratab),0) mortab FROM SMGeneral
            where UNIT_NAME like N'%${ele.Unit}%'
            and Feaa_Code like N'%${category.text}%'
            and Rotba_Code  like N'%${level.soldierLevel}%'
            and Khedma_Type like N'%مجند%'
            `);

          ele[category.mappedValue][level.mappedValue] = {
            ...ele[category.mappedValue][level.mappedValue],
            ...count[0],
            ...mortab[0]
          };
        }

        for (const level of soliderLevels.filter(ele => !ele.isSolider)) {
          if (!ele[category.mappedValue][level.mappedValue])
            ele[category.mappedValue][level.mappedValue] = {};

          const count = await runQuery(
            `
           select  Coalesce ( count(ID),0) count  from Rateb
           join Unit on Unit.UnitID = Rateb.UnitID
           where Unit.Unit like N'%${ele.Unit}%'
           and RatebCategory like  N'%${category.text}%' 
           and RatebState like 'بالخدمة' 
           and RatebLevel ${level.optionsQuery}
           `
          );

          const mortab = await runQuery(`
           select  Coalesce ( SUM(El_Moratab),0) mortab FROM SMGeneral
            where UNIT_NAME like N'%${ele.Unit}%'
            and Feaa_Code like N'%${category.text}%'
            and Rotba_Code   ${level.optionsQuery}
            and Khedma_Type like N'%راتب عالى%'
            `);

          ele[category.mappedValue][level.mappedValue] = {
            ...ele[category.mappedValue][level.mappedValue],
            ...count[0],
            ...mortab[0]
          };
        }
      }
      if (ele.officer) {
        const hododCount = {};
        for (const level of soliderLevels.filter(ele => ele.isSolider)) {
          const count = await runQuery(`
          select  Coalesce ( count(ID),0) count  from Soldier
          join Unit on Unit.UnitID = Soldier.UnitID 
          where  Unit.Unit like N'%${ele.Unit}%'
          and RecuEndDate > getdate()
          and SoldierStatus = 'بالخدمة' 
          and SoldierCategory   = 'صف' 
          and SoldierLevel  like N'%${level.soldierLevel}%'
        `);

          hododCount[level.mappedValue] = count[0].count;
        }
        if (ele.officer.Solider)
          ele.officer.Solider.count =
            ele.officer.Solider.count + hododCount.Solider || 0;

        if (ele.officer.SoliderArraf)
          ele.officer.SoliderArraf.count =
            ele.officer.SoliderArraf.count + hododCount.SoliderArraf || 0;
      }

      function calculateTotal(value, type) {
        return categories
          .map(category => ele[category.mappedValue][value][type])
          .reduce((perve, cur) => perve + cur, 0);
      }
      ele.totals = {};

      soliderLevels.forEach(level => {
        console.log(level.mappedValue);
        ele.totals[level.mappedValue] = {
          mortab: calculateTotal(level.mappedValue, "mortab"),
          count: calculateTotal(level.mappedValue, "count")
        };
      });

      return [
        {
          ...ele,
          type: "totals"
        },
        {
          ...ele,
          type: "mortab"
        }
      ];
    })
  );

  return lodash.flatten(result);
};
