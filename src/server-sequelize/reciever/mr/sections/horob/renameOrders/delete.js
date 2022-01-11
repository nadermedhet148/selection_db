module.exports = async (db, params) => {
  let records = await db.renameOrders.destroy({
    where: {
      id: {
        [db.Op.in]: params.ids
      }
    },
    raw: true,
    nest: true
  });
  return records;
};
