module.exports = async (db, params) => {
  let include = [],
    where = params.where;
  if (params.include && params.include.length > 0) {
    params.include.forEach(t => {
      let obj = {
        model: db[t.model],
        attributes: t.attrs,
        include: [],
        required: t.required ? true : false
      };
      if (t.where) {
        obj.where = t.where;
      }
      if (t.include && t.include.length > 0) {
        t.include.forEach(ti => {
          let __obj = {
            model: db[ti.model],
            attributes: ti.attrs,
            required: ti.required ? true : false
          };
          if (ti.where) {
            __obj.where = ti.where;
          }
          obj.include.push(__obj);
        });
      }
      include.push(obj);
    });
  }
  let counter = await db[params.table].count({
    where,
    include
  });
  return counter;
};
