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
          model: db.injuries,
          attributes: [
            "followedAddedDate",
            "followedEndedDate",
            "isFollowed",
            "healingReportId"
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
                : true
          }
        },
        {
          model: db.medicalCommittees,
          attributes: [
            "committeeId",
            "medicalCommitteeTypeID",
            "comitDecisionId",
            "committeeDate",
            "committeeNumber"
          ],
          include: [
            {
              model: db.committees,
              attributes: ["id"]
            }
          ]
        }
      ],
      attributes: ["militaryId", "fullName", "demobilizationDate"],
      raw: true,
      nest: true
    });
  let cons_filtered = cons.filter(
    c =>
      c.injuries.healingReportId == null ||
      c.injuries.healingReportId == 4 ||
      (c.injuries.healingReportId == 2 &&
        ((c.medicalCommittees.medicalCommitteeTypeID == 1 &&
          !c.medicalCommittees.comitDecisionId) ||
          (c.medicalCommittees.medicalCommitteeTypeID == 1 &&
            !c.medicalCommittees.committeeDate) ||
          (c.medicalCommittees.medicalCommitteeTypeID == 1 &&
            !c.medicalCommittees.committeeNumber)))
  );
  cons_filtered.forEach(c => {
    c.procedures = [];
    let injury_proc = [];
    if (!c.injuries.healingReportId) {
      c.procedures.push("تقرير الشفاء النهائي");
    }
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
    let lagna_text = "اللجنة الطبية",
      joined =
        injury_proc.length > 1
          ? "( " + injury_proc.join(" - ") + " )" + " " + lagna_text
          : injury_proc[0] + " " + lagna_text;
    c.procedures =
      injury_proc.length > 0 ? [...c.procedures, joined] : c.procedures;
  });
  return cons_filtered;
};
