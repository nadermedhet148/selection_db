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
        [isExists(params.unit) ? "unitId" : "stateIdCurrent"]: isExists(
          params.unit
        )
          ? params.unit
          : 1,
        [isExists(params.zone) ? "zoneId" : "stateIdCurrent"]: isExists(
          params.zone
        )
          ? params.zone
          : 1
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
          model: db.medicalCommittees,
          where: {
            isFollowed: true,
            [isExists(params.from_date)
              ? "followedAddedDate"
              : "isFollowed"]: isExists(params.from_date)
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
            [isExists(params.to_date)
              ? "followedEndedDate"
              : "isFollowed"]: isExists(params.to_date)
              ? {
                  [db.Op.lte]: new Date(params.to_date)
                }
              : true
          },
          attributes: [
            "committeeId",
            "committeeNumber",
            "comitDecisionId",
            "committeeDate",
            "isFollowed",
            "followedAddedDate",
            "followedEndedDate"
          ]
        }
      ],
      attributes: [
        "militaryId",
        "fullName",
        "demobilizationDate",
        "ignorantId",
        "ignorantFollowedAddedDate",
        "ignorantFollowedEndedDate"
      ],
      raw: true,
      nest: true
    });
  let cons_filtered = cons.filter(
    c =>
      !c.medicalCommittees.committeeNumber ||
      !c.medicalCommittees.comitDecisionId ||
      !c.medicalCommittees.committeeDate
  );
  cons_filtered.forEach(c => {
    c.procedures = [];
    let injury_proc = [];
    let medCom = c.medicalCommittees,
      medComId = medCom.committeeId;
    if (medComId && !medCom.comitDecisionId) {
      injury_proc.push("قرار");
    }
    if (medComId && !medCom.committeeNumber) {
      injury_proc.push("رقم");
    }
    if (medComId && !medCom.committeeDate) {
      injury_proc.push("تاريخ");
    }
    let joined =
      injury_proc.length > 1
        ? "( " + injury_proc.join(" - ") + " )" + " اللجنة الطبية"
        : injury_proc[0] + " اللجنة الطبية";
    c.procedures =
      injury_proc.length > 0 ? [...c.procedures, joined] : c.procedures;
  });
  return cons_filtered;
};
