module.exports = async (db, params) => {
  return (
    await db.Users.findAll({
      where: {
        username: params.username
      },
      raw: true,
      nest: true
    })
  )[0];
};
