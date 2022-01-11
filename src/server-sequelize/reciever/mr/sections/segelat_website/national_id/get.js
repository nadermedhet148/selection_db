module.exports = async (db, params) => {
  let cons = await db.conscriptes.findAll({
    where: {
      stateId: 102
      // conscriptionDate: {
      //   [db.Op.between]: [params.from_date, params.to_date]
      // }
    },
    include: [
      {
        model: db.fugitives,
        attributes: ["absenceDate"]
      }
    ],
    attributes: ["militaryId", "fullName", "nationalId"],
    raw: true,
    nest: true
  });
  return cons.filter(
    c =>
      !c.nationalId &&
      c.fugitives.absenceDate >= params.from_date &&
      c.fugitives.absenceDate <= params.to_date
  );
};
