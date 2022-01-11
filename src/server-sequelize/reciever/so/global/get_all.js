module.exports = async (db, params) => {
  let include = [];
  if (params.include && params.include.length > 0) {
    params.include.forEach(t => {
      let obj = {
        model: db[t.model],
        attributes: t.attrs,
        include: []
      };
      if (t.where) {
        obj.where = t.where;
      }
      if (Object.keys(t).includes("required")) {
        obj.required = t.required;
      }
      if (t.include && t.include.length > 0) {
        t.include.forEach(ti => {
          let __obj = {
            model: db[ti.model],
            attributes: ti.attrs
          };
          if (ti.where) {
            __obj.where = ti.where;
          }
          if (Object.keys(ti).includes("required")) {
            __obj.required = ti.required;
          }
          obj.include.push(__obj);
        });
      }
      include.push(obj);
    });
  }
  let records = await db[params.table].findAll({
    where: params.where ? params.where : {},
    [params.attrs ? "attributes" : "include"]: params.attrs ? params.attrs : [],
    [params.limit ? "limit" : "include"]: params.limit ? params.limit : [],
    include:
      params.includes && params.includes.length > 0 ? params.includes : include,
    order: params.order ? params.order : []
    // raw: true,
    // nest: true
  });
  return JSON.parse(JSON.stringify(records));
};
