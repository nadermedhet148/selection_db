module.exports = async (db, params) => {
  let include = [],
    findObject = {};
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
            attributes: ti.attrs,
            include: []
          };
          if (ti.where) {
            __obj.where = ti.where;
          }
          if (Object.keys(ti).includes("required")) {
            __obj.required = ti.required;
          }
          if (ti.include && ti.include.length > 0) {
            ti.include.forEach(tij => {
              let __obj__ = {
                model: db[tij.model],
                attributes: tij.attrs
              };
              if (tij.where) {
                __obj__.where = tij.where;
              }
              if (Object.keys(tij).includes("required")) {
                __obj__.required = ti.required;
              }
              __obj.include.push(__obj__);
            });
          }
          obj.include.push(__obj);
        });
      }
      include.push(obj);
    });
  }
  if (params.where) {
    findObject.where = params.where;
  }
  if (params.attrs) {
    findObject.attributes = params.attrs;
  }
  if (params.include && params.include.length > 0) {
    findObject.include = include;
  }
  if (params.order) {
    findObject.order = params.order;
  }
  if (params.limit) {
    findObject.limit = params.limit;
  }
  let records = await db[params.table].findAll(
    findObject
    // {
    // where: params.where ? params.where : {},
    // [params.attrs ? "attributes" : "include"]: params.attrs ? params.attrs : [],
    // include,
    // order: params.order ? params.order : [],
    // [params.limit ? "limit" : "include"]: params.limit ? params.limit : []
    // raw: true,
    // nest: true
    // }
  );
  return JSON.parse(JSON.stringify(records));
};
