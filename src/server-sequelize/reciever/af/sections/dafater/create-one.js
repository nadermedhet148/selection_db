module.exports = async (db, params) => {
  let find = await db[params.table].findOne({
    where: {
      dafterIndex: params.where.dafterIndex,
      filmNumber: params.where.filmNumber
    }
  });
  if (find) {
    return -1;
  } else {
    let record = await db[params.table].create(params.where);
    return JSON.parse(JSON.stringify(record));
  }
};
