const { QueryTypes } = require("sequelize");
const getUnits = require("./getUnits");

const SoldierCategoryMap = [
  { text: "صف", mappedValue: "officer" },
  { text: "كاتب", mappedValue: "writer" },
  { text: "مهنى", mappedValue: "professional" },
  { text: "حرفى", mappedValue: "literal" },
  { text: "سائق عجل", mappedValue: "driver" }
];

module.exports = async (db, params) => {
  // get units
  const units = await getUnits(db, params);
  const categories = SoldierCategoryMap.filter(
    ele => params.SoldierCategories.indexOf(ele.text) > -1
  );

  const result = await Promise.all(
    units.map(async ele => {
      for (const category of categories) {
        const moratbValue = await db.sequelize.query(
          `
          select Coalesce ( SUM(El_Moratab),0) mortab , Coalesce ( SUM(Siasa) ,0) siasa from SMGeneral
           where UNIT_NAME like '%${ele.Unit}%' and Feaa_Code like  '%${category.text}%' 
          `,
          {
            type: QueryTypes.SELECT
          }
        );
        if (!ele[category.mappedValue]) ele[category.mappedValue] = {};

        // TODO: refactor it to check if wepon is not hars hodo from soldier table after refactor
        const totalSMCount = await db.sequelize.query(
          `
          select  Coalesce ( count(ID),0) totalSoliderCount  from SMSoldier
          join Unit on Unit.UnitID = SMSoldier.UnitID where Unit = N'${ele.Unit}'
          and RecuEndDate > getdate()
          and SoldierStatus = N'بالخدمة'
          and SoldierCategory  like N'%${category.text}%' 
          `,
          {
            type: QueryTypes.SELECT
          }
        );

        const value = await db.sequelize.query(
          `
          select  Coalesce ( count(ID),0) count  from Rateb join Unit on Unit.UnitID = Rateb.UnitID
           where Unit = N'${ele.Unit}'
          and RatebCategory like N'%${category.text}%'  
          `,
          {
            type: QueryTypes.SELECT
          }
        );

        ele[category.mappedValue] = {
          ...ele[category.mappedValue],
          ...moratbValue[0],
          ...totalSMCount[0],
          rateb: value[0].count
        };
      }

      categories.forEach(category => {
        ele[category.mappedValue]["total"] =
          ele[category.mappedValue].totalSoliderCount +
          ele[category.mappedValue].rateb;
      });
      // TODO: refactor it to check if wepon is hars hodo table after refactor
      const totalHododCount = await db.sequelize.query(
        `
        select  Coalesce ( count(ID),0) totalHododCount  from Soldier
         join Unit on Unit.UnitID = Soldier.UnitID 
         where Unit =  N'${ele.Unit}' and 
         RecuEndDate > getdate() and 
         SoldierStatus = N'بالخدمة'  and 
         SoldierCategory   = N'صف'
        `,
        {
          type: QueryTypes.SELECT
        }
      );

      const totalSupport = await db.sequelize.query(
        `
        select  Coalesce (Sum(convert( int ,  ImdadTotal)) , 0) totalSupport from SMDriversSuggestion
        join Unit on Unit.UnitID = SMDriversSuggestion.UnitID where Unit = N'${ele.Unit}'
        `,
        {
          type: QueryTypes.SELECT
        }
      );

      if (ele.officer) {
        ele.officer.totalSMSoliderCount = ele.officer.totalSoliderCount;
        ele.officer.totalHododCount = totalHododCount[0].totalHododCount;

        ele.officer.totalSoliderCount += totalHododCount[0].totalHododCount;
      }

      let totalImdad = calculateTotal("siasa");
      if (ele.driver) {
        ele.driver.totalSupport = totalSupport[0].totalSupport;
        totalImdad = totalImdad - ele.driver.siasa + ele.driver.totalSupport;
      }

      ele.totals = {
        totalMortab: calculateTotal("mortab"),
        totalSiasa: calculateTotal("siasa"),
        totalImdad: totalImdad,
        totalRatab: calculateTotal("rateb"),
        totalSolider: calculateTotal("totalSoliderCount"),
        totalSum: calculateTotal("total")
      };
      ele.percentages = {
        totalOverMortab:
          Math.ceil((ele.totals.totalSum / ele.totals.totalMortab) * 100) || 0,
        totalOverSiasa:
          Math.ceil((ele.totals.totalSum / ele.totals.totalSiasa) * 100) || 0,
        totalOverImdad:
          Math.ceil((ele.totals.totalSum / ele.totals.totalImdada) * 100) || 0
      };

      return ele;

      function calculateTotal(value) {
        return categories
          .map(category => ele[category.mappedValue][value])
          .reduce((perve, cur) => perve + cur, 0);
      }
    })
  );

  return result;
};
