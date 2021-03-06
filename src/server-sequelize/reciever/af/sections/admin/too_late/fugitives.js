module.exports = async (db, params) => {
  return new Promise((success, failure) => {
    let where = {};
    if (params.demobilizationDateFrom || params.demobilizationDateTo) {
      let from = params.demobilizationDateFrom,
        to = params.demobilizationDateTo;
      where.demobilizationDate = {
        [from && !to ? "$gte" : to && !from ? "$lte" : "$between"]:
          from && !to ? from : to && !from ? to : [from, to]
      };
    }
    if (params.conscriptionDateFrom || params.conscriptionDateTo) {
      let from = params.conscriptionDateFrom,
        to = params.conscriptionDateTo;
      where.conscriptionDate = {
        [from && !to ? "$gte" : to && !from ? "$lte" : "$between"]:
          from && !to ? from : to && !from ? to : [from, to]
      };
    }
    if (params.unitId) {
      where.unitId = params.unitId;
    }
    if (params.zoneId) {
      where.zoneId = params.zoneId;
    }
    db.conscriptes
      .findAll({
        where,
        attributes: ["militaryId", "fullName", "demobilizationDate"],
        include: [
          {
            model: db.units
          },
          {
            model: db.degrees
          },
          {
            model: db.fugitives,
            required: true,
            where: {
              [db.Op.or]: [
                {
                  $and: {
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
                  }
                },
                {
                  returnDate: {
                    [db.Op.not]: null
                  },
                  $and: {
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
                },
                {
                  s1SendToUnitDate: {
                    [db.Op.not]: null
                  },
                  $and: {
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
                },
                {
                  returnDate: {
                    [db.Op.is]: null
                  },
                  $and: {
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
                              new Date().setFullYear(
                                new Date().getFullYear() - 2
                              )
                            ).setMonth(new Date().getMonth() - 1)
                          ).setDate(new Date().getDate() - 1)
                        }
                      }
                    ]
                  },
                  $and: {
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
                }
              ]
            }
          }
        ]
      })
      .then(x => {
        let fixedItems = JSON.parse(JSON.stringify(x));
        fixedItems.forEach(c => {
          c.missedProcedures = [];
          c.fugitives.forEach(f => {
            if (!f.absenceDate) {
              c.missedProcedures.push("?????????? ????????????");
            }
            if (!f.strikeoffDate) {
              c.missedProcedures.push("?????????? ??????????");
            }
            if (!f.strikeOffOrder) {
              c.missedProcedures.push("?????? ?????????? ??????????");
            }
            if (!f.absenceOrder) {
              c.missedProcedures.push("?????? ?????????? ????????????");
            }
            let s1AttachmentsAfter21Days = f.s1AttachmentsAfter21Days
              ? f.s1AttachmentsAfter21Days
                  .split(" ")
                  .join("")
                  .trim()
                  .split(",")
              : [];
            if (s1AttachmentsAfter21Days.length < 3) {
              if (!s1AttachmentsAfter21Days.includes("1")) {
                c.missedProcedures.push("?????????????? 61 ??");
              }
              if (!s1AttachmentsAfter21Days.includes("2")) {
                c.missedProcedures.push("?????????????? 63 ??");
              }
              if (!s1AttachmentsAfter21Days.includes("3")) {
                c.missedProcedures.push("???????? ??????????????????");
              }
            }
            if (f.returnDate) {
              if (!f.returnOrder) {
                c.missedProcedures.push("?????? ?????????? ????????????");
              }
              if (
                !f.s1AttachmentsBefore1Year ||
                !f.s1AttachmentsBefore1Year.includes("1")
              ) {
                c.missedProcedures.push("?????????????? 62 ??");
              }
            }
            if (f.s1SendToUnitDate) {
              if (!f.nameMostalem) {
                c.missedProcedures.push("?????? ??????????????");
              }
              if (!f.degreeMostalemId) {
                c.missedProcedures.push("???????? ??????????????");
              }
            }
            if (
              !f.returnDate &&
              new Date(f.absenceDate) <
                new Date(
                  new Date(
                    new Date().setFullYear(new Date().getFullYear() - 2)
                  ).setMonth(new Date().getMonth() - 1)
                ).setDate(new Date().getDate() - 1)
            ) {
              if (!f.unitNoticeDate) {
                c.missedProcedures.push("?????????? ?????????? ????????????");
              }
              if (!f.s1ReceptionDate) {
                c.missedProcedures.push("?????????? ???????????? ??????????????");
              }
              let s1Attachments = f.s1Attachments
                ? f.s1Attachments
                    .split(" ")
                    .join("")
                    .trim()
                    .split(",")
                : [];
              if (s1Attachments.length < 4) {
                if (!s1Attachments.includes("1")) {
                  c.missedProcedures.push("?????????????? 1 ?? ??????????");
                }
                if (!s1Attachments.includes("2")) {
                  c.missedProcedures.push("???????? ???????????? ???????????????? ??????????");
                }
                if (!s1Attachments.includes("3")) {
                  c.missedProcedures.push("?????? ??????????");
                }
                if (!s1Attachments.includes("4")) {
                  c.missedProcedures.push("?????????????? 15 ??");
                }
              }
            }
          });
        });
        success(fixedItems.filter(f => f.missedProcedures.length > 0));
      })
      .catch(error => {
        success([]);
      });
  });
};
