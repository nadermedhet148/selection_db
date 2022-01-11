module.exports = async (db, params) => {
  let dafterReport = await db.dafater.findOne({
    where: {
      id: params.id
    },
    include: [
      {
        model: db.dafaterImages,
        include: [
          {
            model: db.dafaterRel
          }
        ]
      }
    ]
  });
  return JSON.parse(JSON.stringify(dafterReport));
};
