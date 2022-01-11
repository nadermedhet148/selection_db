module.exports = async (db, params) => {
  return await db.users.findAll({
    where: {
      isVisible: true
    },
    raw: true,
    nest: true
  });
};
