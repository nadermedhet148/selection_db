module.exports = async (db, params) => {
  let records = await db[params.table].update(params.update, {
    where: params.where,
    raw: true,
    nest: true
  });
  return records;
};
