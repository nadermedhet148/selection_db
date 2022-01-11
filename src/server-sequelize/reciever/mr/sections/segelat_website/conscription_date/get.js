module.exports = async (db, params) => {
  let cons = await db.conscriptes.findAll({
    where: {
      stateId: 102
    },
    attributes: ["militaryId", "fullName", "conscriptionDate"],
    raw: true,
    nest: true
  });
  return cons.filter(c => !c.conscriptionDate);
};
