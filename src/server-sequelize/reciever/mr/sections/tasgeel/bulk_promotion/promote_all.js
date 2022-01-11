module.exports = async (db, params) => {
  let records = await db.conscriptes.update(
    {
      degreeId: db.sequelize.literal("DegreeId + 1"),
      currentPromotionDate: new Date()
    },
    {
      where: {
        militaryId: {
          [db.Op.in]: params.selected_deservers
        }
      },
      raw: true,
      nest: true
    }
  );
  return records;
};
