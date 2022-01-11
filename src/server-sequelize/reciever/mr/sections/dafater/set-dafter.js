module.exports = async (db, params) => {
  return await db.dafater.update(
    {
      name: params.name,
      path: params.path
    },
    {
      where: {
        code: params.code
      }
    }
  );
};
