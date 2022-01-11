module.exports = async (db, params) => {
  return await db.zones.findAll({
    raw: true,
    nest: true
  });
};
