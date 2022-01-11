module.exports = async (db, params) => {
  console.log(db);

  return await db.users.findOne({
    where: {
      username: params.username
    },
    raw: true,
    nest: true
  });
};
