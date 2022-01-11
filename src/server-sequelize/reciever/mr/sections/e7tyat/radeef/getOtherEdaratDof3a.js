module.exports = async (db, params) => {
  let searchBy =
    params.mil_id && params.mil_id.length > 0
      ? "MilitaryId"
      : "DemobilizationDate";
  let records = await db.conscriptes.findAll({
      where: {
        [searchBy]: {
          [searchBy == "MilitaryId" ? db.Op.substring : db.Op.between]:
            searchBy == "MilitaryId"
              ? params.mil_id
              : [params.date_from, params.date_to]
        }
      },
      include: [
        {
          model: db.units,
          attributes: ["unitText"],
          required: false
        },
        {
          model: db.fugitives,
          attributes: ["returnDate", "absenceDate"],
          where: {
            returnDate: {
              [db.Op.is]: null
            },
            absenceDate: {
              [db.Op.not]: null
            }
          },
          required: false
        },
        {
          model: db.injuries,
          attributes: ["isFollowed"],
          where: {
            isFollowed: true
          },
          required: false
        },
        {
          model: db.courts,
          attributes: ["isFollowed"],
          where: {
            isFollowed: true
          },
          required: false
        }
      ],
      attributes: [
        "militaryId",
        "fullName",
        "stateId",
        "stateIdCurrent",
        "ignorantId",
        "qualificationId",
        "notesDemobilization",
        "s25Correction",
        "s25Valid",
        "licenceLost",
        "licenceValid",
        "licenceCorrupted",
        "idLost",
        "idCorrupted",
        "idValid",
        "s2Receive"
      ],
      raw: true,
      nest: true
    }),
    fixedRecords = [];
  records.forEach(record => {
    // Check if conscripte will هيتسرح by us or not
    let identifier = record.militaryId.slice(6, 8),
      blackList = ["52", "04", "66", "77", "88"];
    if (record.militaryId.length !== 13 || !blackList.includes(identifier)) {
      // Fullfill Situation
      record.situation = [];
      if (record.courts.isFollowed) {
        record.situation.push("محكمة");
      }
      if (record.injuries.isFollowed) {
        record.situation.push("إصابة");
      }
      if (record.fugitives.absenceDate && !record.fugitives.returnDate) {
        record.situation.push("هروب");
      }
      if (record.ignorantId == 1) {
        record.situation.push("أمي");
      }

      record.situation = record.situation.join(",");

      // Fullfill S25, Id, License
      record.s25Check_alt = record.s25Valid
        ? "s25Valid"
        : record.s25Correction
        ? "s25Correction"
        : null;
      record.licenceCheck_alt = record.licenceValid
        ? "licenceValid"
        : record.licenceCorrupted
        ? "licenceCorrupted"
        : record.licenceLost
        ? "licenceLost"
        : null;
      record.idCheck_alt = record.idValid
        ? "idValid"
        : record.idCorrupted
        ? "idCorrupted"
        : record.idLost
        ? "idLost"
        : null;
      record.isHodod = false;
      fixedRecords.push(record);
    }
  });
  return fixedRecords;
};
