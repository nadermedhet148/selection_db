module.exports = async (db, params) => {
  let date = await db.sequelize.query("select getdate()"),
    time = Object.values(date[0][0])[0],
    dateInCairo = new Date(time).setHours(new Date(time).getHours() - 2),
    timeInCairo = new Date(dateInCairo);
  return timeInCairo;
};
