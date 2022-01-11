module.exports = async (db, params) => {
  let record = await db[params.table].destroy({
    where: params.where,
    raw: true,
    nest: true
  });
  // Never remove or change the following line,
  // Because a lot of queries depend on it.
  return record
    ? params.returner && params.returner.length > 0
      ? record[params.returner]
      : "true"
    : "false";
};
