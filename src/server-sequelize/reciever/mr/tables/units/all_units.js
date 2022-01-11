module.exports = async (db, params) => {
  return await db.units.findAll({
    raw: true,
    nest: true
  });
};
