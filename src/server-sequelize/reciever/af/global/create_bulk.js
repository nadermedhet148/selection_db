module.exports = async (db, params) => {
  console.log(params);
  let records = await db[params.table].bulkCreate(
    params.where ? params.where : []
  );
  // Never remove or change the following line,
  // Because a lot of queries depend on it.
  return !records || !params.returnObject
    ? []
    : JSON.parse(JSON.stringify(records));
};
