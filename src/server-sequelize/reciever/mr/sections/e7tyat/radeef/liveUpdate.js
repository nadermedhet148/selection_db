module.exports = async (db, params) => {
  let checkboxes = {
    s25Check_alt: ["s25Valid", "s25Correction"],
    licenceCheck_alt: ["licenceValid", "licenceCorrupted", "licenceLost"],
    idCheck_alt: ["idValid", "idCorrupted", "idLost"]
  };
  try {
    const result = await db.sequelize.transaction(async t => {
      const old_data = await db[params.table].findOne({
        where: params.where,
        attributes: [params.status],
        raw: true,
        nest: true,
        transaction: t
      });
      let new_update = {};
      checkboxes[params.parent].forEach(el => {
        new_update[el] = false;
      });
      new_update[params.status] = !old_data[params.status];
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
