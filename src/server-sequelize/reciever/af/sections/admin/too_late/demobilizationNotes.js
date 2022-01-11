module.exports = async (db, params) => {
  return new Promise((success, failure) => {
    let where = {
      stateIdCurrent: 1,
      notesDemobilization: {
        $not: null,
        $ne: ""
      }
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
        attributes: [
          "militaryId",
          "fullName",
          "demobilizationDate",
          "notesDemobilization"
        ],
        include: [
          {
            model: db.units
          },
          {
            model: db.degrees
          }
        ]
      })
      .then(x => {
        let fixedItems = JSON.parse(JSON.stringify(x));
        fixedItems.forEach(c => {
          c.missedProcedures = [];
          c.missedProcedures.push(c.notesDemobilization);
        });
        success(fixedItems);
      })
      .catch(error => {
        success([]);
      });
  });
};
