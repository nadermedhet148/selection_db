module.exports = async (db, params) => {
  try {
    const result = await db.sequelize.transaction(async t => {
      const old_data = await db[params.table].findOne({
        where: params.where,
        attributes: params.attributes,
        raw: true,
        nest: true,
        transaction: t
      });
      let new_update = {};
      params.attributes.forEach(attribute => {
        new_update[attribute] = !old_data[attribute];
      });
      const records = await db[params.table].update(new_update, {
        where: params.where,
        raw: true,
        nest: true,
        transaction: t
      });
      return true; // Transaction is Ok
    });
    return result;
  } catch (error) {
    return error;
  }
};
