module.exports = async (db, params) => {
  // دمج المكاتب برئاسة المخابرات
  let zoneId;
  if (params.unitId == 100) {
    // "رئاسة مجموعة مخابرات اسماعيلية شمال سيناء";
    zoneId = 7;
  } else if (params.unitId == 101) {
    // "رئاسة مكتب مخابرات سويس و جنوب سيناء";
    zoneId = 8;
  } else if (params.unitId == 102) {
    // "رئاسة مكتب مخابرات المنطقة الشمالية";

    zoneId = 9;
  } else if (params.unitId == 103) {
    // "رئاسة مكتب مخابرات المنطقة الغربية";

    zoneId = 10;
  } else if (params.unitId == 104) {
    // "رئاسة مكتب مخابرات المنطقة الجنوبية";

    zoneId = 11;
  } else if (params.unitId == 105) {
    // "رئاسة مكتب مخابرات البحر الاحمر";

    zoneId = 12;
  }
  let isEnhaa = params.isEnhaa,
    year = 1000 * 60 * 60 * 24 * 30 * 12,
    cons = await db.conscriptes.findAll({
      where: {
        stateIdCurrent: 1,
        $and: [
          {
            $or: [
              {
                militaryId: { $like: "______52%" }
              },
              { militaryId: { $like: "______66%" } },
              { militaryId: { $like: "______04%" } },
              { militaryId: { $like: "______77%" } },
              { militaryId: { $like: "______88%" } },
              { militaryId: { $like: "______18%" } }
            ]
          },
          { $or: [{ forceId: 52 }, { forceId: { $is: null } }] }
        ]
      },
      include: [
        {
          model: db.units,
          required: true,
          where: {
            ...(zoneId ? { zoneId: zoneId } : { unitId: params.unitId })
          }
        },
        {
          model: db.groups,
          attributes: ["groupName"]
        },
        {
          model: db.degrees,
          attributes: ["degreeType"]
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
        },
        {
          model: db.medicalCommittees,
          where: {
            isFollowed: true
          },
          required: false,
          include: [
            {
              model: db.medicalCommitteeTypes,
              required: false,
              attributes: ["displayedText"]
            },
            {
              model: db.committees,
              required: false,
              attributes: ["displayedText"]
            }
          ]
        }
      ],
      raw: true,
      nest: true
    }),
    dutyTerminations = isEnhaa
      ? await db.dutyTerminations.findAll({
          attributes: ["militaryId"],
          where: {
            finished: true
          },
          include: [
            {
              model: db.conscriptes,
              where: {
                typeId: 1
              },
              attributes: ["militaryId", "fullName"],
              include: [
                {
                  model: db.degrees,
                  attributes: ["degreeType"]
                },
                {
                  model: db.units,
                  required: true,
                  where: {
                    ...(zoneId ? { zoneId: zoneId } : { unitId: params.unitId })
                  }
                }
              ]
            }
          ],
          raw: true,
          nest: true
        })
      : [];
  console.log(cons);
  let data = {
    conscriptes: !isEnhaa ? cons.filter(c => c.typeId == 1) : [],
    ignorants: !isEnhaa
      ? cons.filter(c => c.typeId == 1 && c.ignorantId == 1)
      : [],
    non_commession: !isEnhaa ? cons.filter(c => c.typeId == 2) : [],
    medicalCommittees: cons.filter(
      c => c.medicalCommittees["isFollowed"] == true // c.typeId == 1 &&
    ),
    injuries: !isEnhaa
      ? cons.filter(c => c.injuries["isFollowed"] == true) // c.typeId == 1 &&
      : [],
    courts: cons.filter(c => c.courts["isFollowed"] == true), // c.typeId == 1 &&
    kashf40: isEnhaa
      ? cons.filter(
          c =>
            c.birthDate &&
            c.typeId == 2 &&
            new Date() - new Date(c.birthDate) >= 40 * year - (1 / 12) * year &&
            (!c.letterSendingDate40 || !c.confirmationDate40 || !c.reviewDate40)
        )
      : [],
    kashf_bologSen: isEnhaa
      ? cons.filter(
          c =>
            c.birthDate &&
            c.typeId == 2 &&
            (([15, 16].includes(c.degreeId) &&
              new Date() - new Date(c.birthDate) >= 52 * year) ||
              ([17].includes(c.degreeId) &&
                new Date() - new Date(c.birthDate) >= 54 * year) ||
              ([18, 19].includes(c.degreeId) &&
                new Date() - new Date(c.birthDate) >= 56 * year))
        )
      : [],
    late_demob: dutyTerminations
  };

  Object.keys(data).forEach(key => {
    let vals = data[key];
    switch (key) {
      case "courts":
        vals.forEach(c => {
          c.procedures = [];
          let co = c.courts;
          if (!co.courtConfermation) {
            c.procedures.push("تصديق الحكم");
          }
          if (!co.s161Date) {
            c.procedures.push("تاريخ الـ 161س");
          }
          if (!co.lastShbka) {
            c.procedures.push("التسجيل على الشبكة العسكرية");
          }
        });
        break;
      case "injuries":
        vals.forEach(c => {
          c.procedures = [];
          let injury_proc = [];
          if (!c.injuries.healingReportId) {
            c.procedures.push("تقرير الشفاء النهائي");
          }
          let medCom = c.medicalCommittees,
            medComId = medCom.committeeId;
          if (medComId && !medCom.comitDecisionId) {
            injury_proc.push("قرار");
          }
          if (medComId && !medCom.committeeNumber) {
            injury_proc.push("رقم");
          }
          if (medComId && !medCom.committeeDate) {
            injury_proc.push("تاريخ");
          }
          let lagna_text = "اللجنة الطبية",
            joined =
              injury_proc.length > 1
                ? "( " + injury_proc.join(" , ") + " )" + " " + lagna_text
                : injury_proc[0] + " " + lagna_text;
          c.procedures =
            injury_proc.length > 0 ? [...c.procedures, joined] : c.procedures;
        });
        break;
      case "medicalCommittees":
        vals.forEach(c => {
          c.procedures = [];
          let injury_proc = [];
          let medCom = c.medicalCommittees,
            medComId = medCom.committeeId;
          if (medComId && !medCom.comitDecisionId) {
            injury_proc.push("قرار");
          }
          if (medComId && !medCom.committeeNumber) {
            injury_proc.push("رقم");
          }
          if (medComId && !medCom.committeeDate) {
            injury_proc.push("تاريخ");
          }
          let joined =
            injury_proc.length > 1
              ? "( " + injury_proc.join(" , ") + " )" + " اللجنة الطبية"
              : injury_proc[0] + " اللجنة الطبية";
          c.procedures =
            injury_proc.length > 0 ? [...c.procedures, joined] : c.procedures;
        });
        break;
      case "kashf40":
        vals.forEach(c => {
          c.procedures = [];
          let co = c.courts;
          if (!co.letterSendingDate40) {
            c.procedures.push("تاريخ مخاطبة الوحدة");
          }
          if (!co.confirmationDate40) {
            c.procedures.push("تاريخ التصديق");
          }
          if (!co.reviewDate40) {
            c.procedures.push("تاريخ العرض");
          }
        });
        break;
    }
  });
  return data;
};
