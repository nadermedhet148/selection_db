module.exports = async (db, params) => {
  return new Promise((success, failure) => {
    let where = {
      stateIdCurrent: 1,
      stateId: 101
    };
    if (params.demobilizationDateFrom || params.demobilizationDateTo) {
      let from = params.demobilizationDateFrom,
        to = params.demobilizationDateTo;
      where.demobilizationDate = {
        [from && !to ? "$gte" : to && !from ? "$lte" : "$between"]:
          from && !to ? from : to && !from ? to : [from, to]
      };
    }
    if (params.conscriptionDateFrom || params.conscriptionDateTo) {
      let from = params.conscriptionDateFrom,
        to = params.conscriptionDateTo;
      where.conscriptionDate = {
        [from && !to ? "$gte" : to && !from ? "$lte" : "$between"]:
          from && !to ? from : to && !from ? to : [from, to]
      };
    }
    if (params.unitId) {
      where.unitId = params.unitId;
    }
    if (params.zoneId) {
      where.zoneId = params.zoneId;
    }
    db.conscriptes
      .findAll({
        where,
        attributes: ["militaryId", "fullName", "demobilizationDate"],
        include: [
          {
            model: db.units
          },
          {
            model: db.degrees
          },
          {
            model: db.medicalCommittees,
            required: true,
            where: {
              isFollowed: true,
              $and: {
                $or: {
                  committeeNumber: {
                    $is: null
                  },
                  comitDecisionId: {
                    $is: null
                  },
                  committeeDate: {
                    $is: null
                  }
                }
              }
            }
          }
        ]
      })
      .then(x => {
        let fixedItems = JSON.parse(JSON.stringify(x));
        fixedItems.forEach(c => {
          c.missedProcedures = [];
          let injury_proc = [];
          c.medicalCommittees.forEach(medCom => {
            if (!medCom.comitDecisionId) {
              injury_proc.push("قرار");
            }
            if (!medCom.committeeNumber) {
              injury_proc.push("رقم");
            }
            if (!medCom.committeeDate) {
              injury_proc.push("تاريخ");
            }
          });
          let lagna_text = "اللجنة الطبية",
            joined =
              injury_proc.length > 1
                ? "( " + injury_proc.join(" , ") + " )" + " " + lagna_text
                : injury_proc[0] + " " + lagna_text;
          c.missedProcedures =
            injury_proc.length > 0
              ? [...c.missedProcedures, joined]
              : c.missedProcedures;
        });
        success(fixedItems);
      })
      .catch(error => {
        success([]);
      });
  });
};
