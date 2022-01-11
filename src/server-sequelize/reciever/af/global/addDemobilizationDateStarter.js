module.exports = async (db, params) => {
  let e0 = await db.sequelize.query(`
        update [MilitaryRecordsDB].[dbo].[Conscriptes]
        set QualificationId = 0
        where TypeId = 1 and QualificationId is null and len(MilitaryId) = 13 and SUBSTRING(MilitaryId, 6, 1) = '0'
      `),
    e1 = await db.sequelize.query(`
        update [MilitaryRecordsDB].[dbo].[Conscriptes]
        set QualificationId = 1
        where TypeId = 1 and QualificationId is null and len(MilitaryId) = 13 and SUBSTRING(MilitaryId, 6, 1) = '1'
      `),
    e2 = await db.sequelize.query(`
        update [MilitaryRecordsDB].[dbo].[Conscriptes]
        set QualificationId = 2
        where TypeId = 1 and QualificationId is null and len(MilitaryId) = 13 and SUBSTRING(MilitaryId, 6, 1) = '2'
      `),
    e8 = await db.sequelize.query(`
        update [MilitaryRecordsDB].[dbo].[Conscriptes]
        set QualificationId = 8
        where TypeId = 1 and QualificationId is null and len(MilitaryId) = 13 and SUBSTRING(MilitaryId, 6, 1) = '8'
      `),
    e7 = await db.sequelize.query(`
        update [MilitaryRecordsDB].[dbo].[Conscriptes]
        set QualificationId = 7
        where TypeId = 1 and QualificationId is null and len(MilitaryId) = 13 and SUBSTRING(MilitaryId, 6, 1) = '7'
      `),
    cons = await db.conscriptes.findAll({
      where: {
        typeId: 1,
        qualificationId: {
          $not: null
        },
        $or: [
          {
            conscriptionDate: {
              $not: null
            }
          },
          {
            webConscriptionDate: {
              $not: null
            }
          }
        ],
        demobilizationDateStarter: {
          $is: null
        }
      },
      limit: 5000
    }),
    periods = {
      "0": 35,
      "1": 23,
      "2": 11,
      "8": 17,
      "7": 11
    },
    dof3as3 = [12, 1, 2],
    dof3as6 = [3, 4, 5],
    dof3as9 = [6, 7, 8],
    dof3as12 = [9, 10, 11],
    parsed = JSON.parse(JSON.stringify(cons)),
    promises = [];
  parsed.forEach(con => {
    let {
        militaryId,
        conscriptionDate,
        webConscriptionDate,
        qualificationId,
        additionalYearStateId,
        webAdditionalYearStateId
      } = con,
      ccdate = conscriptionDate ? conscriptionDate : webConscriptionDate,
      cdate = new Date(ccdate).setMonth(
        new Date(ccdate).getMonth() + periods[`${qualificationId}`]
      ),
      currentYear = Number(new Date(cdate).getFullYear()),
      hasAdditionalYear =
        additionalYearStateId == 4 || webAdditionalYearStateId == 2,
      cmonth = Number(new Date(cdate).getMonth() + 1),
      finish = new Date();
    if (dof3as3.includes(cmonth)) {
      if (cmonth == 12) {
        finish = new Date(`${Number(currentYear + 1)}-3-1`);
      } else {
        finish = new Date(`${currentYear}-3-1`);
      }
    }
    if (dof3as6.includes(cmonth)) {
      finish = new Date(`${currentYear}-6-1`);
    }
    if (dof3as9.includes(cmonth)) {
      finish = new Date(`${currentYear}-9-1`);
    }
    if (dof3as12.includes(cmonth)) {
      finish = new Date(`${currentYear}-12-1`);
    }
    finish = hasAdditionalYear
      ? new Date(finish).setMonth(new Date(finish).getMonth() + 2)
      : finish;
    con.demobilizationDateStarter = finish;
    promises.push(
      db.conscriptes.update(
        {
          demobilizationDateStarter: `${new Date(
            finish
          ).getFullYear()}-${Number(
            Number(new Date(finish).getMonth()) + 1
          )}-1 01:00:00.000`
        },
        {
          where: {
            militaryId
          }
        }
      )
    );
  });
  await Promise.all(promises);
  await db.sequelize.query(
    `update [MilitaryRecordsDB].[dbo].[Conscriptes] set DemobilizationDateStarter = SUBSTRING(CONVERT(varchar, DemobilizationDateStarter), 0, 13)`
  );
  return "ok";
};
