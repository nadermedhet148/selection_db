module.exports = async (db, params) => {
  return await db.users.findOne({
    where: {
      username: params.username
    },
    raw: true,
    nest: true
  });
};
