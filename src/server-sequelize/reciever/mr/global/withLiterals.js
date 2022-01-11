module.exports = async (db, params) => {
  let literals = params.literals,
    include = [];
  if (literals && literals.length > 0) {
    literals.forEach(literal => {
      include.push([
        db.sequelize.literal(`${literal.query}`),
        `${literal.key}`
      ]);
    });
  }
  let records = await db[params.table].findAll({
    where: params.where,
    attributes: {
      include
    }
  });
  return JSON.parse(JSON.stringify(records));
};
