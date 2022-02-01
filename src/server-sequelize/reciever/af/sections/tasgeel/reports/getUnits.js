const { QueryTypes } = require("sequelize");

const displayTypes = {
  headquerts: 0,
  intelligence: 1,
  unites: 3,
  directions: 4
};

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

  return units;
};

const genrateUnitQuery = whereCondation =>
  `Select distinct  Unit , DirectionforFeaat , OrderingFeaat  from Unit where ${whereCondation} and OrderingFeaat is not null  order by OrderingFeaat `;
