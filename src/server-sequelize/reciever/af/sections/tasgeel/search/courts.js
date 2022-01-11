module.exports = async (db, params) => {
  let search = params.search,
    like = ["fullName", "militaryId"],
    date = [
      "conscriptionDate",
      "demobilizationDate",
      "courtDate",
      "lastShabaka",
      "lastUnitReply"
    ],
    booleans = [
      "isFollowed",
      "checkbox-lastUnitReply",
      "checkbox-lastShabaka",
      "checkbox-healingReportId"
    ],
    ignore = ["failureSessions"],
    where = {},
    conscriptesWhere = {};
  Object.keys(search).forEach(key => {
    if (
      (key.includes(".") && !ignore.includes(key.split(".")[1])) ||
      (!key.includes(".") && !ignore.includes(key))
    ) {
      let val = search[key],
        isConscripte = key.includes("conscripte."),
        fixedKey = isConscripte ? key.replace("conscripte.", "") : key;
      if (booleans.includes(fixedKey) && val && val.length > 0) {
        val = val == "yes";
      }
      if (
        ((typeof val == "string" || Array.isArray(val)) &&
          val &&
          val.length > 0) ||
        (typeof val == "number" && (val || val === 0)) ||
        typeof val == "boolean"
      ) {
        if (like.includes(fixedKey)) {
          if (isConscripte) {
            conscriptesWhere[fixedKey] = {
              $like: `${val}%`
            };
          } else {
            where[fixedKey] = {
              $like: `${val}%`
            };
          }
        } else if (date.includes(fixedKey)) {
          if (val.length == 1) {
            if (isConscripte) {
              conscriptesWhere[fixedKey] = {
                $between: [new Date(val[0]), new Date(val[0])]
              };
            } else {
              where[fixedKey] = {
                $between: [new Date(val[0]), new Date(val[0])]
              };
            }
          } else if (val.length > 1) {
            if (new Date(val[0]) > new Date(val[1])) {
              if (isConscripte) {
                conscriptesWhere[fixedKey] = {
                  $between: [new Date(val[1]), new Date(val[0])]
                };
              } else {
                where[fixedKey] = {
                  $between: [new Date(val[1]), new Date(val[0])]
                };
              }
            } else {
              if (isConscripte) {
                conscriptesWhere[fixedKey] = {
                  $between: [new Date(val[0]), new Date(val[1])]
                };
              } else {
                where[fixedKey] = {
                  $between: [new Date(val[0]), new Date(val[1])]
                };
              }
            }
          }
        } else {
          if (isConscripte) {
            conscriptesWhere[fixedKey] = val;
          } else {
            where[fixedKey] = val;
          }
        }
      }
    }
  });
  try {
    let injuries = await db.courts.findAll({
        where,
        include: [
          {
            model: db.conscriptes,
            where: conscriptesWhere,
            attributes: ["militaryId", "fullName"],
            include: [
              {
                model: db.degrees,
                attributes: ["degreeType"],
                required: false
              },
              {
                model: db.units,
                attributes: ["unitText"],
                required: false
              },
              {
                model: db.zones,
                attributes: ["zoneText"],
                required: false
              }
            ]
          }
        ]
      }),
      parsed = JSON.parse(JSON.stringify(injuries));
    return parsed;
  } catch (error) {
    return error;
  }
};
