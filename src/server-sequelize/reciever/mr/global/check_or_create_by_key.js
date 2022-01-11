module.exports = async (db, params) => {
  // return -1 if obj is found
  // else will create and return new record
  let find = params.where
    ? await db[params.table].findOne({
        where: params.where
      })
    : null;
  if (find) {
    return -1;
  }
  let record = false;
  await db[params.table].create(params.params).then(result => {
    record = result;
  });
  return record ? JSON.parse(JSON.stringify(record)) : null;
};
