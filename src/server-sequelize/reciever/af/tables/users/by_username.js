module.exports = async (db, params) => {
  return await db.Users.findOne({
    where: {
      username: params.username
    },
    raw: true,
    nest: true
  });
};
