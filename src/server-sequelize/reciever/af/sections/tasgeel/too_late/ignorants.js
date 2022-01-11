module.exports = async (db, params) => {
  let now = new Date(),
    before4Months = new Date(now.setDate(now.getDate() - 135)), // 4 Months and 15 Days
    isExists = function(param) {
      if (
        ![null, undefined, "undefined"].includes(param) &&
        typeof param !== "undefined"
      ) {
        return true;
      }
      return false;
    },
    cons = await db.conscriptes.findAll({
      where: {
        stateIdCurrent: 1,
        stateId: 101,
        qualificationId: 0,
        ignorantId: 1,
        [isExists(params.demob_date)
          ? "demobilizationDate"
          : "stateIdCurrent"]: isExists(params.demob_date)
          ? {
              [db.Op.lte]: new Date(params.demob_date)
            }
          : 1,
        [params.unit || params.unit === 0 ? "unitId" : "stateIdCurrent"]:
          params.unit || params.unit === 0 ? params.unit : 1,
        [params.zone || params.zone === 0 ? "zoneId" : "stateIdCurrent"]:
          params.zone || params.zone === 0 ? params.zone : 1,
        [isExists(params.from_date)
          ? "ignorantFollowedAddedDate"
          : "stateIdCurrent"]: isExists(params.from_date)
          ? {
              [db.Op.or]: [
                {
                  [db.Op.gte]: new Date(params.from_date)
                },
                {
                  [params.hide_null_added_date == "true"
                    ? db.Op.gte
                    : db.Op.is]:
                    params.hide_null_added_date == "true"
                      ? new Date(params.from_date)
                      : null
                }
              ]
            }
          : 1,
        [isExists(params.to_date) && params.section == "1"
          ? "ignorantFollowedEndedDate"
          : "stateIdCurrent"]:
          isExists(params.to_date) && params.section == "1"
            ? {
                [db.Op.lte]: new Date(params.to_date)
              }
            : 1,
        conscriptionDate: {
          [db.Op.lte]: before4Months
        },
        // for Ehtyat it should show only soldiers
        [params.section == 2 ? "degreeId" : "stateIdCurrent"]:
          params.section == 2 ? 2 : 1
      },
      include: [
        {
          model: db.groups,
          attributes: ["groupName"]
        },
        {
          model: db.degrees,
          attributes: ["degreeType"]
        },
        {
          model: db.units,
          attributes: ["unitText"]
        }
      ],
      attributes: [
        "militaryId",
        "fullName",
        "demobilizationDate",
        "ignorantId",
        "ignorantFollowedAddedDate",
        "ignorantFollowedEndedDate"
      ]
    }),
    cons_fixed = JSON.parse(JSON.stringify(cons));
  return cons_fixed;
};
