module.exports = async (db, params) => {
  let queries = {
      getGlobalStats: {
        isNonCommissioned: false
      },
      get1YearStats: {
        isNonCommissioned: false,
        returnDate: {
          [db.Op.is]: null
        },
        absenceDate: {
          [db.Op.between]: [
            new Date(`${params.search.year}-01-01`),
            new Date(`${params.search.year}-12-31`)
          ]
        }
      },
      getPeriodStats: {
        returnDate: {
          [db.Op.is]: null
        },
        absenceDate: {
          [db.Op.between]: [
            new Date(params.search.from),
            new Date(params.search.to)
          ]
        }
      },
      getBranchStats: {
        isNonCommissioned: false,
        returnDate: {
          [db.Op.is]: null
        },
        s1ReceptionDate: {
          [db.Op.not]: null
        }
      },
      getMoreThan1YearStats: {
        isNonCommissioned: false,
        returnDate: {
          [db.Op.is]: null
        },
        absenceDate: {
          [db.Op.between]: [
            new Date().setFullYear(new Date().getFullYear() - 13),
            new Date().setFullYear(new Date().getFullYear() - 1)
          ]
        }
      },
      get12YearStats: {
        isNonCommissioned: false,
        returnDate: {
          [db.Op.is]: null
        },
        absenceDate: {
          [db.Op.lte]: new Date().setFullYear(new Date().getFullYear() - 12)
        }
      },
      getOverageStats: {
        isNonCommissioned: false,
        returnDate: {
          [db.Op.is]: null
        }
      },
      getOneYearPassedNoAction: {
        absenceDate: {
          $lt: new Date().setFullYear(new Date().getFullYear() - 1)
        },
        returnDate: {
          $is: null
        },
        s1ReceptionDate: {
          $is: null
        },
        s1ExecutionCommiteeDate: {
          $is: null
        },
        isNonCommissioned: false
      }
    },
    where = queries[params.query],
    where_conscriptes = {};
  // where.isNonCommissioned = where.isNonCommissioned || false; // Gobal for every query
  // if (
  //   params.search &&
  //   params.search.oneYearPassedNoAction &&
  //   params.query !== "getGlobalStats"
  // ) {
  //   where.s1ReceptionDate = {
  //     [db.Op.is]: null
  //   };
  //   where.s1ExecutionCommiteeDate = {
  //     [db.Op.is]: null
  //   };
  //   where.isNonCommissioned = false;
  // }
  if (params.query == "getOverageStats") {
    where_conscriptes.birthDate = {
      [db.Op.lte]: new Date().setFullYear(new Date().getFullYear() - 36)
    };
  }
  let records = await db.fugitives.findAll({
    where,
    attributes: ["absenceDate", "strikeoffDate"],
    include: [
      {
        model: db.conscriptes,
        attributes: ["militaryId", "fullName", "birthDate"],
        where: where_conscriptes,
        required: false,
        include: [
          {
            model: db.units,
            attributes: ["unitText"]
          },
          {
            model: db.degrees,
            attributes: ["degreeType"]
          }
        ]
      }
    ],
    raw: true,
    nest: true
  });
  return records;
};
