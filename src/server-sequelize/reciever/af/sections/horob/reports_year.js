module.exports = async (db, params) => {
  let records = await db.fugitives.findAll({
    where: {
      absenceDate: {
        [db.Op.between]: [
          new Date(`${params.year}-01-01`),
          new Date(`${params.year}-12-31`)
        ]
      },
      isNonCommissioned: false
    },
    attributes: [
      "militaryId",
      "absenceDate",
      "returnDate",
      "s1ReceptionDate",
      "filmNumberFugitive",
      "sequenceNumberFugitive",
      "nameMostalem",
      "degreeMostalemId"
    ],
    include: [
      {
        model: db.conscriptes,
        attributes: ["fullName", "address"],
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
