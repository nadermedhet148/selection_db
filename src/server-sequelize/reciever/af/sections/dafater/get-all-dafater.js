module.exports = async (db, params) => {
  let getDafter = await db.dafater.findAll(),
    arr = JSON.parse(JSON.stringify(getDafter));

  return arr;
};
