module.exports = async (db, params) => {
  return await db.users.findOne({
    where: {
      username: params.username,
      password: params.password
    },
    // raw: true,
    // nest: true
  });
};
