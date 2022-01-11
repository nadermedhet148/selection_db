module.exports = async (db, params) => {
  let counter = await db.conscriptes.count({
    where: {
      // stateIdCurrent: 1,
      // $and: {
      //   $or: [
      //     {
      //       "$injuries.InjuryId$": {
      //         $not: null
      //       },
      //       "$injuries.HealingReportId$": {
      //         $is: null
      //       }
      //     },
      //     {
      //       "$courts.CourtId$": {
      //         $not: null
      //       },
      //       "$courts.Judgment$": {
      //         $is: null
      //       }
      //     },
      //     {
      //       "$courts.CourtId$": {
      //         $not: null
      //       },
      //       "$courts.S161Date$": {
      //         $is: null
      //       },
      //       $or: [
      //         {
      //           typeId: 2, // صف ظابط
      //           "$courts.P_Year$": 0,
      //           "$courts.P_Month$": {
      //             $gte: 6
      //           }
      //         },
      //         {
      //           typeId: 1, // عسكري
      //           "$courts.P_Year$": {
      //             $gte: 1
      //           },
      //           ConscriptionDate: {
      //             $lte: db.sequelize.fn(
      //               "DATEADD",
      //               db.sequelize.literal("YEAR"),
      //               -1,
      //               db.sequelize.col("courts.CourtDate")
      //             )
      //           }
      //         }
      //       ]
      //     }
      //   ]
      // },
      // Old conditions
      stateIdCurrent: 1,
      "$fugitives.returnDate$": {
        $not: null
      },
      "$courts.courtId$": {
        $is: null
      },
      "$penalties.injuryId$": {
        $is: null
      },
      $and: {
        $or: [
          {
            ispunished: false
          },
          {
            ispunished: {
              $is: null
            }
          }
        ]
      }
    },
    include: [
      {
        model: db.fugitives,
        required: false
      },
      {
        model: db.penalties,
        required: false
      },
      {
        model: db.injuries,
        required: false
      },
      {
        model: db.courts,
        required: false
      }
    ]
  });
  return counter;
};
