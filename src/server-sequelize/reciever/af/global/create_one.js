module.exports = async (db, params) => {
  let record = await db[params.table].create(params.where ? params.where : {});
  console.log(record);
  // Never remove or change the following line,
  // Because a lot of queries depend on it.
  return record
    ? params.returner && params.returner.length > 0
      ? record[params.returner]
      : params.returnObject
      ? JSON.parse(JSON.stringify(record))
      : "true"
    : "false";
};
