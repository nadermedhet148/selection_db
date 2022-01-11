module.exports = async (db, params) => {
  let search = params.search,
    like = ["fullName", "militaryId"],
    date = [
      "conscriptionDate",
      "demobilizationDate",
      "endingDutyDate",
      "birthDate",
      "highSalaryPayingOutDate",
      "currentPromotionDate",
      "currentUnitJoiningDate"
    ],
    ignore = ["failureSessions"],
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
    let conscriptes = await db.conscriptes.findAll({
        where,
        attributes: [
          "militaryId",
          "fullName",
          "conscriptionDate",
          "demobilizationDate",
          "degreeId",
          "unitId",
          "stateIdCurrent",
          "groupId",
          "isPartInMilitaryOperation",
          "forceId"
        ],
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
            model: db.units,
            attributes: ["unitText"],
            required: false
          },
          {
            model: db.militaryOperationParticipants,
            required: false,
            include: [
              {
                model: db.militaryOperations,
                required: false
              }
            ]
          },
          {
            model: db.dutyCurrentStates,
            attributes: ["text"],
            required: false
          },
          {
            model: db.groups,
            attributes: ["groupName"],
            required: false
          }
        ]
      }),
      parsed = JSON.parse(JSON.stringify(conscriptes));
    return parsed;
  } catch (error) {
    return error;
  }
};
