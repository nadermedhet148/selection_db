module.exports = async (db, params) => {
  return await db.users.findOne({
    where: {
      userId: params.userId
    },
    raw: true,
    nest: true
  });
};
