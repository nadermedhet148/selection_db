const { QueryTypes } = require("sequelize");

const displayTypes = {
  headquerts: 0,
  intelligence: 1,
  unites: 3,
  directions: 4
};

const SoldierCategoryMap = [
  { text: "صف", mappedValue: "officer" },
  { text: "كاتب", mappedValue: "writer" },
  { text: "مهني ", mappedValue: "professional" },
  { text: "حرفي", mappedValue: "literal" },
  { text: "سائق عجل", mappedValue: "driver" }
];

module.exports = async (db, params) => {
  // get units
  let direct = "",
    units = [];

  if (params.Type == displayTypes.headquerts) direct = "قيادة";
  if (params.Type == displayTypes.intelligence) direct = "رئاسة";

  if (
    [displayTypes.headquerts, displayTypes.intelligence].indexOf(params.Type) >
    -1
  ) {
    units = await db.sequelize.query(
      genrateUnitQuery(
        `DirectionforFeaat like N'%${direct}%' and Unit != N'بدون'`
      ),

      {
        type: QueryTypes.SELECT
      }
    );
  } else if (displayTypes.unites == params.Type) {
    units = await db.sequelize.query(
      genrateUnitQuery(`UnitID in (${params.unitIds.join(",")})`),
      {
        type: QueryTypes.SELECT
      }
    );
  } else if (displayTypes.directions == params.Type) {
    units = await db.sequelize.query(
      genrateUnitQuery(
        `DirectionforFeaat in (${params.directions
          .map(ele => `N'${ele}'`)
          .join(",")})`
      ),
      {
        type: QueryTypes.SELECT
      }
    );
  }
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

      // /..., ...totalSupport[0]
      if (ele.officer) {
        ele.officer.totalSoliderCount =
          ele.officer.totalSoliderCount + totalHododCount[0].totalHododCount;
      }

      if (ele.driver) {
        ele.driver.totalSupport = totalSupport[0].totalSupport;
      }

      ele.totals = {
        totalMortab: calculateTotal("mortab"),
        totalSiasa: calculateTotal("siasa"),
        totalImdad: 0,
        totalRatab: calculateTotal("rateb"),
        totalSolider: calculateTotal("totalSoliderCount"),
        totalSum: 0
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

const genrateUnitQuery = whereCondation =>
  `Select distinct  Unit , DirectionforFeaat , OrderingFeaat  from Unit where ${whereCondation} and OrderingFeaat is not null  order by OrderingFeaat `;
