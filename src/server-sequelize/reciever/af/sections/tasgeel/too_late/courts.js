module.exports = async (db, params) => {
  let isExists = function(param) {
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
        [isExists(params.demob_date) && params.section == "2"
          ? "demobilizationDate"
          : "stateIdCurrent"]:
          isExists(params.demob_date) && params.section == "2"
            ? {
                [db.Op.lte]: new Date(params.demob_date)
              }
            : 1,
        [(params.unit || params.unit === 0) && params.section == "1"
          ? "unitId"
          : "stateIdCurrent"]:
          (params.unit || params.unit === 0) && params.section == "1"
            ? params.unit
            : 1,
        [(params.zone || params.zone === 0) && params.section == "1"
          ? "zoneId"
          : "stateIdCurrent"]:
          (params.zone || params.zone === 0) && params.section == "1"
            ? params.zone
            : 1,
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
        },
        {
          model: db.courts,
          attributes: [
            "lastShbka",
            "courtConfermation",
            "s161Date",
            "isFollowed",
            "followedAddedDate",
            "followedEndedDate"
          ],
          where: {
            isFollowed: true,
            [isExists(params.from_date) && params.section == "1"
              ? "followedAddedDate"
              : "isFollowed"]:
              isExists(params.from_date) && params.section == "1"
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
                : true,
            [isExists(params.to_date) && params.section == "1"
              ? "followedEndedDate"
              : "isFollowed"]:
              isExists(params.to_date) && params.section == "1"
                ? {
                    [db.Op.lte]: new Date(params.to_date)
                  }
                : true,
            [db.Op.and]: {
              [db.Op.or]: [
                {
                  courtConfermation: {
                    $or: {
                      $is: null,
                      $eq: 0
                    }
                  }
                },
                {
                  courtConfermation: {
                    [db.Op.in]: [1, 2]
                  },
                  s161Date: {
                    [db.Op.is]: null
                  }
                }
              ]
            }
          }
        }
      ],
      attributes: ["militaryId", "fullName", "demobilizationDate"],
      raw: true,
      nest: true
    });
  cons.forEach(c => {
    c.procedures = [];
    let co = c.courts;
    if (!co.courtConfermation) {
      c.procedures.push("تصديق الحكم");
    }
    if (!co.s161Date) {
      c.procedures.push("تاريخ الـ 161س");
    }
    if (!co.lastShbka) {
      c.procedures.push("التسجيل على الشبكة العسكرية");
    }
  });
  return cons;
};
