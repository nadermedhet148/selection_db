module.exports = async (db, params) => {
  let record = params.where
    ? await db[params.table].findOrCreate({
        where: params.where
      })
    : null;
  return record ? JSON.parse(JSON.stringify(record)) : null;
};
