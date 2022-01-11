module.exports = async (db, params) => {
  let searchBy =
      params.mil_id && params.mil_id.length > 0
        ? "MilitaryId"
        : "DemobilizationDate",
    where = {
      [searchBy]: {
        [searchBy == "MilitaryId" ? db.Op.substring : db.Op.between]:
          searchBy == "MilitaryId"
            ? params.mil_id
            : [params.date_from, params.date_to]
      }
    };
  if (params.unitId || params.unitId === 0) {
    where.unitId = params.unitId;
  }
  where.$and = {
    $or: {
      stateId: 101,
      stateIdCurrent: 1
    }
  };
  // where.stateId = 101;
  // where.stateIdCurrent = 1;
  let records = await db.conscriptes.findAll({
      where,
      include: [
        {
          model: db.units,
          required: false
        },
        {
          model: db.degrees,
          attributes: ["degreeType"],
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
        "s2Receive",
        "forceId"
      ],
      raw: true,
      nest: true
    }),
    fixedRecords = [],
    hododRecords = [];
  records.forEach(record => {
    // Check if conscripte will هيتسرح by us or not

    let identifier = record.militaryId.slice(6, 8),
      allowedList = ["52", "04", "66", "77", "88"]; // "88"
    // if (record.militaryId.length !== 13 || allowedList.includes(identifier)) {
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
    record.isHodod =
      ["52", "04", "66", "77", "88"].includes(identifier) &&
      (record.forceId == 52 || record.forceId == null);

    fixedRecords.push(record);
    // }
  });
  hododRecords = [...fixedRecords.filter(i => i.isHodod)];

  // fixedRecords

  return {
    items: fixedRecords,
    numbers: {
      total: hododRecords.length,
      in_service: [...hododRecords].filter(
        f =>
          f.stateIdCurrent == 1 &&
          f.ignorantId !== 1 &&
          f.groupId !== 2 &&
          !f.notesDemobilization &&
          !f.injuries.injuryId &&
          !f.courts.courtId
      ).length,
      e7tyat: [...hododRecords].filter(f => f.stateId == 105).length,
      duty_terminations: [...hododRecords].filter(
        f => f.stateIdCurrent == 2 && ![101, 102, 104, 105].includes(f.stateId)
      ).length,
      ignorants: [...hododRecords].filter(
        f => f.stateIdCurrent == 1 && f.ignorantId == 1
      ).length,
      injuries: [...hododRecords].filter(f => f.injuries.isFollowed).length,
      courts: [...hododRecords].filter(f => f.courts.isFollowed).length,
      fugitives: [...hododRecords].filter(
        f => f.stateIdCurrent == 2 && f.stateId == 102
      ).length,
      death: [...hododRecords].filter(
        f => f.stateIdCurrent == 2 && f.stateId == 104
      ).length,
      officers: [...hododRecords].filter(
        f => f.militaryId[6] + "" + f.militaryId[7] == "88"
      ).length
    }
  };
};
