module.exports = async (db, params) => {
  let cons = await db.conscriptes.findAll({
      where: {
        demobilizationDateStarter: {
          $lte: params.date
        },
        stateIdCurrent: 1,
        typeId: 1,
        $or: [
          {
            militaryId: { $like: "______52%" }
          },
          { militaryId: { $like: "______66%" } },
          { militaryId: { $like: "______04%" } },
          { militaryId: { $like: "______88%" } },
          { militaryId: { $like: "______77%" } }
        ],
        forceId: "52"
      },
      include: [
        {
          model: db.degrees
        },
        {
          model: db.qualifications
        },
        {
          model: db.units
        },
        {
          model: db.courts,
          where: {
            isFollowed: true
          },
          required: false
        },
        {
          model: db.injuries,
          where: {
            isFollowed: true
          },
          required: false
        },
        {
          model: db.fugitives,
          required: false
        }
      ]
    }),
    parsed = JSON.parse(JSON.stringify(cons));
  parsed.forEach(con => {
    con.bayan = [];
    if (con.ignorantId == 1 && con.qualificationId == 0) {
      con.bayan.push("أمي");
    }
    if (con.courts && con.courts.length > 0) {
      con.bayan.push("محكمة");
    }
    if (con.injuries && con.injuries.length > 0) {
      con.bayan.push("إصابة");
    }
    if (con.fugitives && con.fugitives.length > 0) {
      con.bayan.push("هروب");
    }
  });
  return parsed;
};
