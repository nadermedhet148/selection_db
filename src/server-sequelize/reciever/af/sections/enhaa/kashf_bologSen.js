module.exports = async (db, params) => {
  let where = {};
  where["typeId"] = 2;
  where["stateIdCurrent"] = 1;
  if (params.id) {
    where["militaryId"] = params.id;
  } else {
    where[db.Op.or] = [
      {
        degreeId: [15, 16],
        birthDate: {
          [db.Op.lte]: new Date(params.date).setFullYear(
            new Date(params.date).getFullYear() - 52
          )
        }
      },
      {
        degreeId: 17,
        birthDate: {
          [db.Op.lte]: new Date(params.date).setFullYear(
            new Date(params.date).getFullYear() - 54
          )
        }
      },
      {
        degreeId: [18, 19],
        birthDate: {
          [db.Op.lte]: new Date(params.date).setFullYear(
            new Date(params.date).getFullYear() - 56
          )
        }
      }
    ];
  }
  let cons = await db.conscriptes.findAll({
    where,
    include: [
      {
        model: db.degrees,
        attributes: ["degreeType"]
      },
      {
        model: db.units,
        attributes: ["unitText"]
      },
      {
        model: db.groups,
        attributes: ["groupName"]
      }
    ],
    raw: true,
    nest: true
  });
  return cons;
};
