module.exports = async (db, params) => {
  let records = await db.fugitives.findAll({
    where: {
      [db.Op.and]: [
        {
          absenceDate: {
            [db.Op.or]: [
              {
                [db.Op.between]: [new Date(params.from), new Date(params.to)]
              },
              {
                [db.Op.is]: null
              }
            ]
          }
        },
        {
          [db.Op.or]: [
            {
              [db.Op.or]: [
                {
                  strikeoffDate: {
                    [db.Op.is]: null
                  }
                },
                {
                  absenceOrder: {
                    [db.Op.is]: null
                  }
                },
                {
                  strikeOffOrder: {
                    [db.Op.is]: null
                  }
                },
                {
                  s1AttachmentsAfter21Days: {
                    [db.Op.notLike]: "%1%2%3%"
                  }
                }
              ]
            },
            {
              [db.Op.and]: [
                {
                  returnDate: {
                    [db.Op.not]: null
                  }
                },
                {
                  [db.Op.or]: [
                    {
                      returnOrder: {
                        [db.Op.or]: [
                          {
                            [db.Op.is]: null
                          },
                          {
                            [db.Op.eq]: ""
                          }
                        ]
                      }
                    },
                    {
                      s1AttachmentsBefore1Year: {
                        [db.Op.notLike]: "%1%"
                      }
                    }
                  ]
                }
              ]
            },
            {
              [db.Op.and]: [
                {
                  s1SendToUnitDate: {
                    [db.Op.not]: null
                  }
                },
                {
                  [db.Op.or]: [
                    {
                      nameMostalem: {
                        [db.Op.or]: [
                          {
                            [db.Op.is]: null
                          },
                          {
                            [db.Op.eq]: ""
                          }
                        ]
                      }
                    },
                    {
                      degreeMostalemId: {
                        [db.Op.or]: [
                          {
                            [db.Op.is]: null
                          },
                          {
                            [db.Op.eq]: ""
                          }
                        ]
                      }
                    }
                  ]
                }
              ]
            },
            {
              [db.Op.and]: [
                {
                  returnDate: {
                    [db.Op.is]: null
                  }
                },
                {
                  [db.Op.or]: [
                    {
                      absenceDate: {
                        [db.Op.lte]: new Date().setFullYear(
                          new Date().getFullYear() - 2
                        )
                      }
                    },
                    {
                      absenceDate: {
                        [db.Op.lte]: new Date(
                          new Date(
                            new Date().setFullYear(new Date().getFullYear() - 2)
                          ).setMonth(new Date().getMonth() - 1)
                        ).setDate(new Date().getDate() - 1)
                      }
                    }
                  ]
                },
                {
                  [db.Op.or]: [
                    {
                      unitNoticeDate: {
                        [db.Op.not]: null
                      }
                    },
                    {
                      s1ReceptionDate: {
                        [db.Op.not]: null
                      }
                    },
                    {
                      s1Attachments: {
                        [db.Op.notLike]: "%1%2%3%4%"
                      }
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    include: [
      {
        model: db.conscriptes,
        attributes: ["militaryId", "fullName"],
        // where: {
        //   [db.Op.or]: [
        //     {
        //       birthDate: {
        //         [db.Op.is]: null
        //       }
        //     },
        //     {
        //       address: {
        //         [db.Op.or]: [
        //           {
        //             [db.Op.is]: null
        //           },
        //           {
        //             [db.Op.eq]: ""
        //           }
        //         ]
        //       }
        //     }
        //   ]
        // },
        include: [
          {
            model: db.units,
            attributes: ["unitText"]
          },
          {
            model: db.degrees,
            attributes: ["degreeType"]
          }
        ]
      }
    ],
    raw: true,
    nest: true
  });
  let fixed_records = [];
  records.forEach(record => {
    record.missedData = [];
    if (!record.absenceDate) {
      record.missedData.push("تاريخ الغياب");
    }
    if (!record.strikeoffDate) {
      record.missedData.push("تاريخ الشطب");
    }
    if (!record.strikeOffOrder) {
      record.missedData.push("بند أوامر الشطب");
    }
    if (!record.absenceOrder) {
      record.missedData.push("بند أوامر الغياب");
    }
    let s1AttachmentsAfter21Days = record.s1AttachmentsAfter21Days
      ? record.s1AttachmentsAfter21Days
          .split(" ")
          .join("")
          .trim()
          .split(",")
      : [];
    if (s1AttachmentsAfter21Days.length < 3) {
      if (!s1AttachmentsAfter21Days.includes("1")) {
        record.missedData.push("النموذج 61 س");
      }
      if (!s1AttachmentsAfter21Days.includes("2")) {
        record.missedData.push("النموذج 63 س");
      }
      if (!s1AttachmentsAfter21Days.includes("3")) {
        record.missedData.push("صورة البروفايل");
      }
    }
    if (record.returnDate) {
      if (!record.returnOrder) {
        record.missedData.push("بند أوامر العودة");
      }
      if (
        !record.s1AttachmentsBefore1Year ||
        !record.s1AttachmentsBefore1Year.includes("1")
      ) {
        record.missedData.push("النموذج 62 س");
      }
    }
    if (record.s1SendToUnitDate) {
      if (!record.nameMostalem) {
        record.missedData.push("اسم المستلم");
      }
      if (!record.degreeMostalemId) {
        record.missedData.push("درجة المستلم");
      }
    }
    if (
      !record.returnDate &&
      new Date(record.absenceDate) <
        new Date(
          new Date(
            new Date().setFullYear(new Date().getFullYear() - 2)
          ).setMonth(new Date().getMonth() - 1)
        ).setDate(new Date().getDate() - 1)
    ) {
      if (!record.unitNoticeDate) {
        record.missedData.push("تاريخ اخطار الوحدة");
      }
      if (!record.s1ReceptionDate) {
        record.missedData.push("تاريخ استلام النموذج");
      }
      let s1Attachments = record.s1Attachments
        ? record.s1Attachments
            .split(" ")
            .join("")
            .trim()
            .split(",")
        : [];
      if (s1Attachments.length < 4) {
        if (!s1Attachments.includes("1")) {
          record.missedData.push("النموذج 1 س الأصل");
        }
        if (!s1Attachments.includes("2")) {
          record.missedData.push("خطاب الأدلة الجنائية معتمد");
        }
        if (!s1Attachments.includes("3")) {
          record.missedData.push("فيش ثلاثي");
        }
        if (!s1Attachments.includes("4")) {
          record.missedData.push("اجراءات 15 ر");
        }
      }
    }
    fixed_records.push(record);
  });
  return fixed_records.filter(f => f.missedData && f.missedData.length > 0);
};
