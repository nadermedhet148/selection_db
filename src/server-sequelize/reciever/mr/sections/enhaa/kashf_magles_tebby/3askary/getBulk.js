module.exports = async (db, params) => {
  let where = {};
  if (params.show_followed) {
    where = {
      $or: [
        {
          committeeDate: {
            $is: null
          }
        },
        {
          committeeNumber: {
            $is: null
          }
        },
        {
          medicalCommitteeTypeId: {
            $is: null
          }
        },
        {
          comitDecisionId: {
            $is: null
          }
        },
        {
          isFollowed: true
        }
      ]
    };
  } else {
    where.committeeDate = {
      [db.Op.between]: [params.from_date, params.to_date]
    };
  }
  let cons = await db.medicalCommittees.findAll({
    where,
    include: [
      {
        model: db.conscriptes,
        attributes: ["fullName", "conscriptionDate", "demobilizationDate"],
        include: [
          {
            model: db.degrees,
            required: false
          },
          {
            model: db.units,
            required: false
          },
          {
            model: db.dutyStates,
            required: false
          }
        ]
      },
      {
        model: db.committees,
        required: false,
        attributes: ["displayedText"]
      },
      {
        model: db.medicalCommitteeTypes,
        required: false,
        attributes: ["displayedText"]
      }
    ]
  });
  return JSON.parse(JSON.stringify(cons));
};
