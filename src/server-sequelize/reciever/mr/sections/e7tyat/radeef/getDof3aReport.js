module.exports = async (db, params) => {
  let records = await db.conscriptes.findAll({
    where: {
      DemobilizationDate: {
        $between: [params.date_from, params.date_to]
      }
    },
    include: [
      {
        model: db.dutyCurrentStates,
        attributes: ["text"],
        required: false
      },
      {
        model: db.dutyStates,
        attributes: ["text"],
        required: false
      },
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
  });
  records.forEach(record => {
    // Fullfill Situation
    record.situation = [];
    if (record.courts.isFollowed) {
      record.situation.push("court");
    }
    if (record.injuries.isFollowed) {
      record.situation.push("injury");
    }
    if (record.fugitives.absenceDate && !record.fugitives.returnDate) {
      record.situation.push("fugitive");
    }
    if (record.ignorantId == 1) {
      record.situation.push("ignorant");
    }

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
  });
  return records;
};
