module.exports = async (db, params) => {
  let img = await db.dafaterImages.findOne({
    where: {
      id: params.id
    },
    include: [
      {
        model: db.dafaterRel,
        include: [
          {
            model: db.conscriptes
          }
        ]
      }
    ]
  });
  return JSON.parse(JSON.stringify(img));
};
