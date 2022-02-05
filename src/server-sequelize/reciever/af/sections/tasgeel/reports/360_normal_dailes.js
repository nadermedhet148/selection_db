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
    optionsQuery: `like '%مساعد%' or RatebLevel in ( N'ملاحظ فنى عسكرى' , N'صانع  ممتاز')`
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
      let countEle = { ...ele, type: "الموجود" },
        mortabEle = {
          ...ele,
          type: "الميزانية"
        };

      for (const category of categories) {
        if (!countEle[category.mappedValue])
          countEle[category.mappedValue] = {};
        if (!mortabEle[category.mappedValue])
          mortabEle[category.mappedValue] = {};

        for (const level of soliderLevels.filter(ele => ele.isSolider)) {
          if (!countEle[category.mappedValue][level.mappedValue])
            countEle[category.mappedValue][level.mappedValue] = {};

          if (!mortabEle[category.mappedValue][level.mappedValue])
            mortabEle[category.mappedValue][level.mappedValue] = {};

          const count = await runQuery(`
           select Coalesce ( count(ID),0) value  from SMSoldier
           join Unit on Unit.UnitID = SMSoldier.UnitID 
           where Unit.Unit like N'%${ele.Unit}%'
           and RecuEndDate > getdate() and SoldierStatus = N'بالخدمة'
           and SoldierCategory  like  N'%${category.text}%'
           and SoldierLevel like N'%${level.soldierLevel}%' 
           `);

          const mortab = await runQuery(`
           select  Coalesce ( SUM(El_Moratab),0) value FROM SMGeneral
            where UNIT_NAME like N'%${ele.Unit}%'
            and Feaa_Code like N'%${category.text}%'
            and Rotaba_Code  like N'%${level.soldierLevel}%'
            and Khedma_Type like N'%مجند%'
            `);
          countEle[category.mappedValue][level.mappedValue] = {
            ...countEle[category.mappedValue][level.mappedValue],
            ...count[0]
          };
          mortabEle[category.mappedValue][level.mappedValue] = {
            ...mortabEle[category.mappedValue][level.mappedValue],
            ...mortab[0]
          };
        }

        for (const level of soliderLevels.filter(ele => !ele.isSolider)) {
          if (!countEle[category.mappedValue][level.mappedValue])
            countEle[category.mappedValue][level.mappedValue] = {};

          if (!mortabEle[category.mappedValue][level.mappedValue])
            mortabEle[category.mappedValue][level.mappedValue] = {};

          const count = await runQuery(
            `
           select  Coalesce ( count(ID),0) value  from Rateb
           join Unit on Unit.UnitID = Rateb.UnitID
           where Unit.Unit like N'%${ele.Unit}%'
           and RatebCategory like  N'%${category.text}%' 
           and RatebState like N'بالخدمة' 
           and RatebLevel ${level.optionsQuery}
           `
          );
          const mortab = await runQuery(`
           select  Coalesce ( SUM(El_Moratab),0) value FROM SMGeneral
            where UNIT_NAME like N'%${ele.Unit}%'
            and Feaa_Code like N'%${category.text}%'
            and Rotaba_Code   ${level.optionsQuery.replaceAll(
              "RatebLevel",
              "Rotaba_Code"
            )}
            and Khedma_Type like N'%راتب عالى%'
            `);

          countEle[category.mappedValue][level.mappedValue] = {
            ...countEle[category.mappedValue][level.mappedValue],
            ...count[0]
          };
          mortabEle[category.mappedValue][level.mappedValue] = {
            ...mortabEle[category.mappedValue][level.mappedValue],
            ...mortab[0]
          };
        }
      }
      if (countEle.officer) {
        const hododCount = {};
        for (const level of soliderLevels.filter(ele => ele.isSolider)) {
          const count = await runQuery(`
          select  Coalesce ( count(ID),0) count  from Soldier
          join Unit on Unit.UnitID = Soldier.UnitID 
          where  Unit.Unit like N'%${ele.Unit}%'
          and RecuEndDate > getdate()
          and SoldierStatus = N'بالخدمة' 
          and SoldierCategory   = N'صف' 
          and SoldierLevel  like N'%${level.soldierLevel}%'
        `);

          hododCount[level.mappedValue] = count[0].count;
        }
        if (countEle.officer.Solider)
          countEle.officer.Solider.value =
            countEle.officer.Solider.value + hododCount.Solider || 0;

        if (countEle.officer.SoliderArraf)
          countEle.officer.SoliderArraf.value =
            countEle.officer.SoliderArraf.value + hododCount.SoliderArraf || 0;
      }

      function calculateTotal(obj, value, type) {
        return categories
          .map(category => obj[category.mappedValue][value][type])
          .reduce((perve, cur) => perve + cur, 0);
      }
      mortabEle.totals = {};
      countEle.totals = {};

      soliderLevels.forEach(level => {
        countEle.totals[level.mappedValue] = {
          value: calculateTotal(countEle, level.mappedValue, "value")
        };
        mortabEle.totals[level.mappedValue] = {
          value: calculateTotal(mortabEle, level.mappedValue, "value")
        };
      });

      return [countEle, mortabEle];
    })
  );

  return lodash.flatten(result);
};
