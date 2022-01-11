module.exports = async (db, params) => {
  let where = {};
  let records = await db.fugitives.findAll({
    where: {
      absenceDate: {
        [db.Op.between]: [params.from, params.to]
      }
    },
    include: [
      {
        model: db.conscriptes,
        where: {
          stateIdCurrent: 2,
          stateId: 102
        },
        attributes: [
          "fullName",
          "unitId",
          "nationalId",
          "zoneId",
          "address",
          "birthDate",
          "conscriptionDate",
          "degreeId"
        ]
      }
    ],
    attributes: [
      "militaryId",
      "id",
      "filmNumberFugitive",
      "sequenceNumberFugitive",
      "absenceDate"
    ],
    raw: true,
    nest: true
  });
  let fixed_records = [];
  records.forEach(record => {
    record.missedData = [];
    if (!record.conscripte.unitId && record.conscripte.unitId !== 0) {
      record.missedData.push("الوحدة");
    }
    if (!record.conscripte.nationalId) {
      record.missedData.push("الرقم القومي");
    }
    if (!record.conscripte.zoneId && record.conscripte.zoneId !== 0) {
      record.missedData.push("الجيش / المنطقة");
    }
    if (!record.conscripte.address) {
      record.missedData.push("العنوان");
    }
    if (!record.conscripte.birthDate) {
      record.missedData.push("تاريخ الميلاد");
    }
    if (!record.conscripte.conscriptionDate) {
      record.missedData.push("تاريخ التجنيد");
    }
    if (!record.conscripte.degreeId) {
      record.missedData.push("الدرجة");
    }
    if (!record.filmNumberFugitive) {
      record.missedData.push("رقم الفيلم");
    }
    if (!record.sequenceNumberFugitive) {
      record.missedData.push("المسلسل");
    }
    if (record.missedData.length > 0) {
      fixed_records.push(record);
    }
  });
  return fixed_records;
};
