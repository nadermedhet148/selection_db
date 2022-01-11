module.exports = async (db, params) => {
  let records = await db.fugitives.findAll({
    where: {
      absenceDate: {
        [db.Op.not]: null
      },
      isNonCommissioned: false
    },
    attributes: ["absenceDate"],
    raw: true,
    nest: true
  });
  return [
    ...new Set(records.map(r => new Date(r.absenceDate).getFullYear()))
  ].sort((a, b) => b - a);
};
