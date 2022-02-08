module.exports = async (db, params) => {
  let search = params.search,
    like = ["ID", "Name"],
    multi = [
      "SoldierLevel",
      "SoldierStatus",
      "KnowledgeLevel",
      "SoldierCategory",
      "RecuTreat",
      "RecuStage",
      "Direction",
      "WeaponID",
      "UnitID",
      "DutyID",
      "CityID",
      "CentreID",
      "Religion",
      "BloodType",
      "College",
      "RecuRegion",
      "Treatment",
      "DriverLevel"
    ],
    date = ["ArrivalDate", "BirthDate", "RecuStartDate", "RecuEndDate"],
    ignore = [],
    where = {};
  Object.keys(search).forEach(key => {
    if (!ignore.includes(key)) {
      let val = search[key];
      if (
        typeof val == "boolean" ||
        ((typeof val == "string" || Array.isArray(val)) &&
          val &&
          val.length > 0) ||
        (typeof val == "number" && (val || val === 0)) ||
        (typeof val == "object" && date.includes(key))
      ) {
        if (like.includes(key)) {
          where[key] = {
            $like: `${val}%`
          };
        } else if (multi.includes(key)) {
          where[key] = {
            $in: val
          };
        } else if (date.includes(key)) {
          if (val.from || val.to) {
            where[key] = {
              [val.from && val.to ? "$between" : val.from ? "$gte" : "$lte"]:
                val.from && val.to
                  ? [
                      new Date(
                        new Date(val.from).setDate(
                          new Date(val.from).getDate() - 1
                        )
                      ),
                      new Date(
                        new Date(val.to).setDate(new Date(val.to).getDate() + 1)
                      )
                    ]
                  : new Date(val.from)
                  ? new Date(val.from)
                  : new Date(val.to)
            };
          }
        } else {
          where[key] = val;
        }
      }
    }
  });
  try {
    let conscriptes = await db.Soldier.findAll({
        where,
        include: [
          {
            model: db.Weapon
          },
          {
            model: db.Unit
          },
          {
            model: db.Duty
          },
          {
            model: db.City
          },
          {
            model: db.Centre
          }
        ]
      }),
      parsed = JSON.parse(JSON.stringify(conscriptes));
    return parsed;
  } catch (error) {
    return error;
  }
};
