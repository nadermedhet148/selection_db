const { QueryTypes } = require("sequelize");

module.exports = async (db, params) => {
  const data = await db.sequelize.query(params.query, {
    type: QueryTypes.SELECT
  });

  return data;
};
