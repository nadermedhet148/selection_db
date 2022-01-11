module.exports = async (db, params) => {
  let where = {};
  where["typeId"] = 2; //typeId: 2,  صف ظابط
  where["stateIdCurrent"] = 1; // حالة الفرد : 1 بالخدمة
  where["webPower_Id"] = 2; //علشان اجيب كل الناس الي في قوات حرس الحدود
  if (params.id) {
    where["militaryId"] = params.id;
  } else {
    where["birthDate"] = {
      [db.Op.between]: [
        new Date(params.from).setFullYear(
          new Date(params.from).getFullYear() - 40
        ),
        new Date(params.to).setFullYear(new Date(params.to).getFullYear() - 40)
      ]
    };
    if (params.onlyHasMissedData) {
      where[db.Op.and] = [
        {
          [db.Op.or]: [
            {
              confirmationDate40: {
                [db.Op.is]: null
              }
            },
            {
              reviewDate40: {
                [db.Op.is]: null
              }
            },
            {
              letterSendingDate40: {
                [db.Op.is]: null
              }
            }
          ]
        }
      ];
    }
  }
  let cons = await db.conscriptes.findAll({
    where, //{typeId : 2, stateIdCurrent : 1, militaryID : id, birthDate: }
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
      },
      {
        model: db.injuries,
        where: {
          isFollowed: true
        },
        required: false
      },
      {
        model: db.courts,
        where: {
          isFollowed: true
        },
        required: false
      }
    ],
    raw: true,
    nest: true
  });
  // let fixed_cons = [];
  cons.forEach(con => {
    con["bayan"] = [];
    if (con.injuries && con.injuries.isFollowed) {
      con.bayan.push("إصابة");
    }
    if (con.courts && con.courts.isFollowed) {
      con.bayan.push("محكمة");
    }
  });
  return cons;
};
