module.exports = async (db, params) => {
  let msg = await db.messengerChats.findOne({
    where: {
      [db.Op.or]: [
        {
          user1: params.user1,
          user2: params.user2
        },
        {
          user1: params.user2,
          user2: params.user1
        }
      ]
    },
    order: [["date", "DESC"]],
    raw: true,
    nest: true
  });
  return msg ? msg : {};
};
