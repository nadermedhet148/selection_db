module.exports = async (db, params) => {
  let where = {},
    likes = ["militaryId", "fullName"],
    excludes = ["filmTitle", "state", "showOnlyHasFilm"],
    dates = ["demobilizationDate"];
  if (params.search.showOnlyHasFilm && params.search.showOnlyHasFilm === true) {
    // Only show what has a microfilmId
    where.microfilmId = {
      [db.Op.not]: null
    };
  }
  Object.keys(params.search).forEach(key => {
    if (!excludes.includes(key)) {
      let value = params.search[key];
      if (value) {
        if (dates.includes(key)) {
          value = {
            $between: [
              new Date(value).setDate(new Date(value).getDate() - 1),
              new Date(value).setDate(new Date(value).getDate() + 1)
            ]
          };
        }
        if (likes.includes(key)) {
          where[key] = {
            [db.Op.like]: `%${value}%`
          };
        } else {
          where[key] = value;
        }
      }
    }
  });
  console.log(where);
  let record = await db.conscriptes.findAll({
    where,
    attributes: [
      "militaryId",
      "fullName",
      "unitId",
      "demobilizationDate",
      "microfilmId",
      "microfilmSortIndex"
    ],
    include: [
      {
        model: db.units,
        attributes: ["unitText"]
      },
      {
        model: db.microfilms,
        attributes: ["state", "filmTitle"]
      }
    ],
    raw: true,
    nest: true
  });
  let filtered = record.filter(
    r =>
      !params.search.filmTitle ||
      (r.microfilm.filmTitle &&
        r.microfilm.filmTitle.includes(params.search.filmTitle))
  );
  return filtered;
};
