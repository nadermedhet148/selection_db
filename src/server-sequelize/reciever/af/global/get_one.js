module.exports = async (db, params) => {
  let include = [];
  if (params.include && params.include.length > 0) {
    params.include.forEach(t => {
      let obj = {
        model: db[t.model],
        include: []
      };
      if (t.attrs) {
        obj.attributes = t.attrs;
      }
      if (t.where) {
        obj.where = t.where;
      }
      if (t.include && t.include.length > 0) {
        t.include.forEach(ti => {
          let __obj = {
            model: db[ti.model],
            // as: ti.as
          };
          if (ti.attrs) {
            __obj.attributes = ti.attrs;
          }
          if (ti.where) {
            __obj.where = ti.where;
          }
          obj.include.push(__obj);
        });
      }
      include.push(obj);
    });
  }
  // console.log(db);
  let record = await db[params.table].findOne({
    where: params.where ? params.where : {},
    [params.attrs ? "attributes" : "include"]: params.attrs ? params.attrs : [],
    [params.order ? "order" : "include"]: params.order ? params.order : [],
    include
    // raw: true,
    // nest: true
  });
  return record ? JSON.parse(JSON.stringify(record)) : null;
};
