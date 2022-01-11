function mapData(array, startedYear, endYear) {
  // todo Handel absent date hard way ...
  // let startedPointer = startedYear;
  // const endYear = endYear;

  let SortedData = {
    // "2001": {
    // returnedCounter  : 0,
    // absenceArray : []
  };

  array.forEach(item => {
    let absenceYear = item.absenceDate.getFullYear();
    let returnYear = item.returnDate;

    if (!SortedData[`${absenceYear}`]) {
      SortedData[`${absenceYear}`] = {
        returnedCounter: 0,
        absenceArray: []
      };
    }

    if (returnYear) {
      SortedData[`${absenceYear}`].returnedCounter += 1;
    }

    SortedData[`${absenceYear}`].absenceArray.push(item.conscripte);
  });

  return SortedData;
}

module.exports = async (db, params) => {
  whereTypeOf = [
    // جندي
    {
      degreeId: {
        [db.Op.eq]: 2
      }
    },
    // راتب عالي
    {
      degreeId: {
        [db.Op.not]: null,
        [db.Op.not]: 2
      }
    },
    {}
  ];

  console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>");
  console.log("====================================");
  console.log("params ", params.consType);
  console.log("whereTypeOf[params.consType]  ", whereTypeOf[params.consType]);
  console.log("====================================");

  let rec = await db.fugitives.findAll({
    where: {
      absenceDate: {
        [db.Op.not]: null,
        [db.Op.between]: [
          new Date(`${params.startYear}-01-01`),
          new Date(`${params.EndYear}-12-31`)
        ]
      }
    },
    attributes: ["absenceDate", "returnDate"],
    include: [
      {
        model: db.conscriptes,
        attributes: ["militaryId", "fullName", "birthDate"],
        required: true,
        include: [
          {
            model: db.degrees,
            where: whereTypeOf[params.consType],
            attributes: ["degreeType"],
            required: true
          }
        ]
      }
    ],
    oreder: ["absenceDate", "DESC"],
    raw: true,
    nest: true
  });

  return mapData(rec);
};
