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
  let cons = await db.medicalCommitteeCivilians.findAll({
    where,
    include: [
      {
        model: db.committeeCivilans,
        attributes: ["displayedText"]
      }
    ]
  });
  return JSON.parse(JSON.stringify(cons));
};
