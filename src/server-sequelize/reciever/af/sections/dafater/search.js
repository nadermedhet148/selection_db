module.exports = async (db, params) => {
  let where = {};
  if (params.militaryId) {
    where.militaryId = {
      $like: `%${params.militaryId}%`
    };
  }
  if (params.fullName) {
    where.fullName = {
      $like: `%${params.fullName}%`
    };
  }
  let cons = await db.conscriptes.findAll({
    where,
    include: [
      {
        model: db.dafaterRel,
        include: [
          {
            model: db.dafaterImages
          }
        ]
      }
    ]
  });
  return JSON.parse(JSON.stringify(cons));
};
