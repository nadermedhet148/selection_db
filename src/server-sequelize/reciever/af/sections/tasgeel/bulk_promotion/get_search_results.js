module.exports = async (db, params) => {
  let cons = await db.conscriptes.findAll({
    where: {
      stateIdCurrent: 1,
      [db.Op.or]: [
        {
          degreeId: 14,
          currentPromotionDate: {
            [db.Op.lte]: params.date_14
          }
        },
        {
          degreeId: 15,
          currentPromotionDate: {
            [db.Op.lte]: params.date_15
          }
        },
        {
          degreeId: 16,
          currentPromotionDate: {
            [db.Op.lte]: params.date_15
          }
        },
        {
          degreeId: 17,
          currentPromotionDate: {
            [db.Op.lte]: params.date_15
          }
        },
        {
          degreeId: 18,
          currentPromotionDate: {
            [db.Op.lte]: params.date_18
          }
        },
        {
          degreeId: 19,
          currentPromotionDate: {
            [db.Op.lte]: params.date_19
          }
        }
      ]
    },
    include: [
      {
        model: db.degrees,
        attributes: ["degreeType"]
      },
      {
        model: db.units,
        attributes: ["unitText"]
      }
    ],
    attributes: ["militaryId", "fullName", "currentPromotionDate", "degreeId"],
    raw: true,
    nest: true
  });
  return {
    "14": cons.filter(c => c.degreeId == 14),
    "15": cons.filter(c => c.degreeId == 15),
    "16": cons.filter(c => c.degreeId == 16),
    "17": cons.filter(c => c.degreeId == 17),
    "18": cons.filter(c => c.degreeId == 18)
    // "19": cons.filter(c => c.degreeId == 19)
  };
};
