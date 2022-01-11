module.exports = async (db, params) => {
  let conscriptes = await db.conscriptes.findAll({
      attributes: ["militaryId", "fullName"],
      where: {
        "$courts.NotFollowingEhtyat$": true
      },
      include: [
        {
          model: db.courts,
          attributes: ["notFollowingEhtyat", "pYear", "pMonth", "pDay"],
          required: false
        }
      ]
    }),
    fixedConscriptes = JSON.parse(JSON.stringify(conscriptes));
  return fixedConscriptes;
};
