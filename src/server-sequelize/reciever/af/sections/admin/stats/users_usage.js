module.exports = async (db, params) => {
  let date = new Date().setDate(new Date().getDate() - params.days),
    items = await db.modifications.findAll({
      where: {
        date: {
          $gte: date
        }
      },
      attributes: ["date", "modifiedBy"]
    }),
    parsedItems = JSON.parse(JSON.stringify(items)),
    categories = [
      ...new Set(
        parsedItems.map(m => new Date(m.date).toISOString().substring(0, 10))
      )
    ],
    usersInPeriod = [...new Set(parsedItems.map(m => m.modifiedBy))],
    series = [];
  usersInPeriod.forEach(user => {
    let userDates = parsedItems
        .filter(p => p.modifiedBy == user)
        .map(p => new Date(p.date).toISOString().substring(0, 10)),
      obj = {
        name: user,
        data: []
      };
    categories.forEach(cat => {
      let counter = userDates.filter(d => d == cat).length;
      obj.data.push(counter);
    });
    series.push(obj);
  });
  return {
    categories,
    series
  };
};
