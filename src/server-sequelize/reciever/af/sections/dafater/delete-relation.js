module.exports = async (db, params) => {
  let rel = await db.dafaterRel.destroy({
      where: {
        id: params.relationId
      }
    }),
    fixedRel = JSON.parse(JSON.stringify(rel));
  return fixedRel;
};
