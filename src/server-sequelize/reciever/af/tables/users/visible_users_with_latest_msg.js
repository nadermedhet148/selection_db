module.exports = async (db, params) => {
  try {
    let users = await db.users.findAll({
      where: {
        isVisible: true
      },
      raw: true,
      nest: true
    });
    return await db.sequelize.transaction(async t => {
      const promises = [];
      users.forEach(user => {
        promises.push(
          db.messengerChats.findOne({
            where: {
              [db.Op.or]: [
                {
                  user1: params.userId,
                  user2: user.userId
                },
                {
                  user1: user.userId,
                  user2: params.userId
                }
              ]
            },
            order: [["date", "DESC"]],
            raw: true,
            nest: true,
            transaction: t
          })
        );
      });
      const msgs = await Promise.all(promises);
      users.forEach((user, i) => {
        let msg = msgs[i] ? msgs[i] : {};
        users[i].messengerLastMsg = msg;
        delete users[i].password;
        delete users[i].username;
      });
      return users;
    });
  } catch (error) {
    return error;
  }
};

// sequelize
//   .transaction()
//   .then(function(t) {
//     return Term.create(query, { transaction: t })
//       .then(function(term) {
//         // Assume definitions
//         // For each definition in the request
//         return sequelize.Promise.map(definitions, function(definition) {
//           return Definition.create(query, { transaction: t }).then(function() {
//             return sequelize.Promise.map(examples, function(example) {
//               return Example.create;
//             });
//           });
//         });
//       })
//       .then(function(definitions) {
//         return t.commit();
//       });
//   })
//   .then(
//     function() {
//       // This happens after the transaction has commited / rolled back
//     },
//     function() {
//       // This is called if an error occurs within the transaction
//     }
//   );
