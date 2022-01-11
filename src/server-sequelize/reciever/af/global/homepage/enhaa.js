module.exports = async (db, params) => {
  let now = new Date(),
    afterMonth = new Date(now.getMonth() + 1),
    conscriptes = await db.conscriptes.findAll({
      attributes: ["typeId", "stateIdCurrent", "demobilizationDate"],
      where: {
        stateIdCurrent: 1
      },
      include: [
        {
          model: db.courts,
          attributes: [
            "courtConfermation",
            "contDuty",
            "notFollowingEhtyat",
            "pYear",
            "pMonth",
            "pDay"
          ],
          required: false
        }
      ]
    }),
    fixedConscriptes = JSON.parse(JSON.stringify(conscriptes)),
    counter = 0;
  fixedConscriptes.forEach(c => {
    if (
      c.typeId == 1 &&
      c.stateIdCurrent == 1 &&
      c.demobilizationDate < now &&
      (!c.courts ||
        c.courts.length == 0 ||
        c.courts.filter(f => f.notFollowingEhtyat).length == 0)
    ) {
      counter++;
    } else {
      if (
        c.stateIdCurrent == 1 &&
        c.demobilizationDate > afterMonth &&
        c.courts.filter(
          f =>
            c.typeId == 1 &&
            !f.notFollowingEhtyat &&
            (f.pYear > 1 || (f.pYear == 1 && (f.pMonth > 0 || f.pDay > 0)))
        )
      ) {
        counter++;
      }
    }
  });
  return counter;
};
