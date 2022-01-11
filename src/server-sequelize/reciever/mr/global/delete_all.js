module.exports = async (db, params) => {
  let include = [];
  if (params.include && params.include.length > 0) {
    params.include.forEach(t => {
      let obj = {
        model: db[t.model],
        include: []
      };
      if (t.include && t.include.length > 0) {
        t.include.forEach(ti => {
          let __obj = {
            model: db[ti.model]
          };
          obj.include.push(__obj);
        });
      }
      include.push(obj);
    });
  }
  let record = await db[params.table].destroy({
    where: params.where,
    include
  });
  // Never remove or change the following line,
  // Because a lot of queries depend on it.
  let records = JSON.parse(JSON.stringify(record));
  return record
    ? params.returner && params.returner.length > 0
      ? records[params.returner]
      : "true"
    : "false";
};
