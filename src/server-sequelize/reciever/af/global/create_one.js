module.exports = async (db, params) => {
  let record = await db[params.table].create(params.where ? params.where : {});
  // Never remove or change the following line,
  // Because a lot of queries depend on it.
  return JSON.parse(JSON.stringify(record));
};
