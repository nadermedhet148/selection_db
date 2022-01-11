module.exports = async (db, params) => {
  let main_data = {},
    fugi_data = {},
    likes = ["militaryId", "fullName"];
  if (params.main_data) {
    params.main_data.forEach(t => {
      if (t.value || t.value === 0) {
        if (likes.includes(t.key)) {
          main_data[t.key] = {
            [db.Op.like]: `%${t.value}%`
          };
        } else {
          if (t.type == "date") {
            if (t.value.length > 0) {
              if (t.value.length > 1) {
                main_data[t.key] = {
                  [db.Op.between]: [new Date(t.value[0]), new Date(t.value[1])]
                };
              } else {
                main_data[t.key] = new Date(t.value);
              }
            }
          } else if (t.type == "select" && t.multiple) {
            if (t.value.length > 0) {
              main_data[t.key] = {
                [db.Op.like]: `%${t.value.join("%")}%`
              };
            }
          } else {
            main_data[t.key] = t.value;
          }
        }
      }
    });
  }
  if (params.fugi_data) {
    params.fugi_data.forEach(t => {
      if (t.value || t.value === 0) {
        if (likes.includes(t.key)) {
          fugi_data[t.key] = {
            [db.Op.like]: `%${t.value}%`
          };
        } else {
          if (t.type == "date") {
            if (t.value.length > 0) {
              if (t.value.length > 1) {
                fugi_data[t.key] = {
                  [db.Op.between]: [new Date(t.value[0]), new Date(t.value[1])]
                };
              } else {
                fugi_data[t.key] = new Date(t.value);
              }
            }
          } else if (t.type == "select" && t.multiple) {
            if (t.value.length > 0) {
              fugi_data[t.key] = {
                [db.Op.like]: `%${t.value.join("%")}%`
              };
            }
          } else {
            fugi_data[t.key] = t.value;
          }
        }
      }
    });
  }
  let records = await db.fugitives.findAll({
    where: fugi_data,
    // attrs: ["absenceDate", "strikeoffDate"],
    include: [
      {
        model: db.conscriptes,
        where: main_data,
        attrs: ["militaryId", "fullName", "demobilizationDate"],
        include: [
          {
            model: db.units,
            attrs: ["unitText"]
          },
          {
            model: db.degrees,
            attrs: ["degreeType"]
          }
        ]
      }
    ]
  });
  return JSON.parse(JSON.stringify(records));
};
