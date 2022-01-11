module.exports = async (db, params) => {
  return new Promise((success, failure) => {
    let now = new Date(),
      // السطر اللي جاي دا أنا حطيته ومستخدمتهوش لسبب
      // حطيته عشان أجيب الأميين اللي مر على تجنيدهم 4 شهور, بحيث إنه قبل الـ 4 شهور ميبقاش اسمه متأخرات
      // بس بعد كدا قولت, هو الراجل 3 سنين, فـ 4 شهور ايه اللي استناهم
      // طلع متاخرات علطول يا بشمهندس طارق ميهمكش
      // before4Months = new Date(now.setDate(now.getDate() - 135)),
      where = {
        stateIdCurrent: 1,
        qualificationId: 0,
        ignorantId: 1
        // conscriptionDate: {
        //   $lte: before4Months
        // }
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
          }
        ]
      })
      .then(x => {
        let fixedItems = JSON.parse(JSON.stringify(x));
        fixedItems.forEach(c => {
          c.missedProcedures = [];
          c.missedProcedures.push("شهادة محو أمية");
        });
        success(fixedItems);
      })
      .catch(error => {
        success([]);
      });
  });
};
