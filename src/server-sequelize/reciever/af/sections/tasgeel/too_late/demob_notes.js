module.exports = async (db, params) => {
  let cons = await db.conscriptes.findAll({
    where: {
      stateIdCurrent: 1,
      stateId: 101,
      notesDemobilization: {
        [db.Op.and]: [
          {
            [db.Op.not]: null
          },
          {
            [db.Op.ne]: ""
          }
        ]
      },
      demobilizationDate: {
        [db.Op.lte]: new Date(params.demob_date)
      },
      [params.unit || params.unit === 0 ? "unitId" : "stateIdCurrent"]:
        params.unit || params.unit === 0 ? params.unit : 1,
      [params.zone || params.zone === 0 ? "zoneId" : "stateIdCurrent"]:
        params.zone || params.zone === 0 ? params.zone : 1,

      // for Ehtyat it should show only soldiers
      [params.section == 2 ? "degreeId" : "stateIdCurrent"]:
        params.section == 2 ? 2 : 1
    },
    include: [
      {
        model: db.groups,
        attributes: ["groupName"]
      },
      {
        model: db.degrees,
        attributes: ["degreeType"]
      },
      {
        model: db.units,
        attributes: ["unitText"]
      }
    ],
    attributes: [
      "militaryId",
      "fullName",
      "demobilizationDate",
      "notesDemobilization"
    ],
    raw: true,
    nest: true
  });
  return cons;
};
