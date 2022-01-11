module.exports = async (db, params) => {
  let msgs = await db.messengerChats.findAndCountAll({
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
    include: [
      {
        model: db.messengerChats
      }
    ],
    order: [["date", "DESC"]],
    offset: params.offset,
    limit: params.limit
  });
  return JSON.parse(JSON.stringify(msgs));
};
