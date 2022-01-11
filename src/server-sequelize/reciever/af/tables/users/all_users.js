module.exports = async (db, params) => {
  return await db.users.findAll({
    raw: true,
    nest: true
  });
};
