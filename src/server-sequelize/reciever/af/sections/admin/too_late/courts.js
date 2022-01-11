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
            model: db.courts,
            required: true,
            where: {
              isFollowed: true,
              $and: {
                $or: [
                  {
                    courtConfermation: {
                      $or: {
                        $is: null,
                        $eq: 0
                      }
                    }
                  },
                  {
                    s161Date: {
                      $is: null
                    },
                    courtConfermation: {
                      $in: [1, 2]
                    }
                  }
                ]
              }
            }
          }
        ]
      })
      .then(x => {
        let fixedItems = JSON.parse(JSON.stringify(x));
        fixedItems.forEach(c => {
          c.missedProcedures = [];
          c.courts.forEach(co => {
            if (!co.courtConfermation) {
              c.missedProcedures.push("تصديق الحكم");
            }
            if (!co.s161Date) {
              c.missedProcedures.push("تاريخ 161س");
            }
            if (!co.lastShbka) {
              c.missedProcedures.push("التسجيل على الشبكة");
            }
          });
        });
        success(fixedItems);
      })
      .catch(error => {
        success([]);
      });
  });
};
