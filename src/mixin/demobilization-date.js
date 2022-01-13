import Vue from "vue";
Vue.mixin({
  methods: {
    fixIgnorantId(militaryId) {
      return new Promise((resolve, reject) => {
        this.api("global/get_one", {
          table: "conscriptes",
          where: {
            militaryId
          },
          include: [
            {
              model: "failureSessions"
            }
          ]
        })
          .then(async x => {
            let conscripte = x.data;
            console.log("before", conscripte);
            if (
              (conscripte.stateId == 101 || conscripte.stateIdCurrent == 1) &&
              conscripte.qualificationId !== null &&
              conscripte.qualificationId == 0 &&
              (conscripte.typeId == null || conscripte.typeId !== 2)
            ) {
              console.log("success");
              let isIgnorant = true, // مبدئياً كدا
                {
                  ignorantId,
                  ignorantSupporterId,
                  failureSessions
                } = conscripte;
              if (failureSessions.filter(f => f.supporterId == 1).length > 0) {
                // عنده دورة محو أمية ناجحة
                isIgnorant = false;
                conscripte.ignorantSupporterId = 1; // شهادة محو أمية عسكرية
              } else if (
                ignorantSupporterId &&
                ignorantSupporterId !== 7 &&
                ignorantSupporterId !== 1
              ) {
                isIgnorant = false;
              } else {
                conscripte.ignorantSupporterId = null;
              }
              let updateConscripte = await this.api("global/update_one", {
                table: "conscriptes",
                where: {
                  militaryId
                },
                update: {
                  ignorantId: isIgnorant ? 1 : 2,
                  ignorantSupporterId: conscripte.ignorantSupporterId
                    ? conscripte.ignorantSupporterId
                    : null
                }
              });

              console.log(isIgnorant, updateConscripte);
              resolve(true);
            } else {
              resolve(true);
            }
          })
          .catch(error => {
            console.log(error);
            resolve(true);
          });
      });
    },

    fixDemobilizationDate(
      militaryId = "",
      returnBoolean = false,
      returnNotes = false
    ) {
      return;
      let errors = [],
        procs = [],
        points = {};
      if (!militaryId) {
        // this.showError("من فضلك أدخل الرقم العسكري");
        errors.push("من فضلك أدخل الرقم العسكري");
        return errors;
      }
      /*
        Begin : ما وراء الطبيعة
        Begin : أصعب فنكشن في المنظومة
      */
      return new Promise((success, failure) => {
        this.api("global/get_one", {
          table: "conscriptes",
          where: {
            militaryId
          },
          attrs: { exclude: ["image"] },
          include: [
            // Must be included and should not be required
            {
              model: "courts",
              required: false
            },
            {
              model: "penalties",
              required: false
            },
            {
              model: "injuries",
              required: false
            },
            {
              model: "fugitives",
              required: false
            },
            {
              model: "failureSessions",
              required: false
            },
            {
              model: "qualifications",
              required: false
            },
            {
              model: "additionalYears",
              required: false
            },
            {
              model: "reductionStates",
              required: false
            },
            {
              // مدة سابقة حسنة
              /**
                مثلاً شخص كان في الجيش وخد اعفاء مؤقت 
                والمدة الي قعدها محسوبة
              */
              model: "prevPeriod",
              required: false
            }
          ]
        })
          .then(async data => {
            if (!data.data) {
              // this.$set(this, "loading", false);
              this.showError("الرقم العسكري غير صحيح");
              return;
            }
            let c = data.data,
              conscriptionDate = c.conscriptionDate
                ? c.conscriptionDate
                : c.webConscriptionDate,
              failureSessionsLength = c.failureSessions.length,
              sessionsHasOneSuccess =
                c.failureSessions.filter(f => f.supporterId == 1).length > 0,
              requiredMonth = {
                0: 35, // عادة
                7: 11, // ضابط احتياط
                2: 11, // عليا
                8: 17, // فوق متوسطة
                1: 23 // متوسطة
              },
              requiredDays = {
                0: 365 * 2 + 335, // عادة
                1: 365 + 335, // متوسطة
                2: 335, // عليا
                7: 335, // ضابط إحتياط
                8: 365 + 182 // فوق متوسطة
              },
              additionalYearAddCond = {
                0: 55,
                7: 18,
                2: 18,
                8: 27,
                1: 36
              },
              radModaCond = {
                0: 30,
                7: 10,
                2: 10,
                8: 15,
                1: 20
              },
              hasTroubleInLasthSixth = false,
              canRadModa = false,
              countStartingCrimeDays = 0,
              hasFugi = c.fugitives.length > 0,
              hasCourts = c.courts.length > 0,
              hasPenalities = c.penalties.length > 0;
            points.militaryId = c.militaryId;
            points.fullName = c.fullName;
            // console.log("conscriptionDate: " + conscriptionDate);
            points.additionalYearState = c.additionalYear
              ? c.additionalYear.state
              : "بدون";
            points.conscriptionDate = this.getNearestDay(c.conscriptionDate);
            points.qualification = c.qualification
              ? c.qualification.name
              : "بدون";

            // Fix IgnorantId - تصحيح موقف محو الأمية
            await this.fixIgnorantId(militaryId);
            /*
              1.
              Calculate demobilization date starter
            */
            if (!conscriptionDate) {
              // console.log(militaryId + " Error:");
              // console.log("Has no conscriptionDate nor webConscriptionDate");
              errors.push("لا يوجد تاريخ تجنيد يدوي ولا آلي");
              if (returnBoolean) {
                success(returnNotes ? errors : false);
              } else {
                failure(errors);
              }
            }

            // console.log("demobilizationDate: " + demobilizationDate);
            procs.push({
              key: "تاريخ التجنيد",
              value: this.getNearestDay(conscriptionDate)
            });

            // يوجد سابق مدة حسنة
            if (c.prevPeriod != null) {
              let years = c.prevPeriod.years ? c.prevPeriod.years : 0,
                months = c.prevPeriod.months ? c.prevPeriod.months : 0,
                days = c.prevPeriod.days ? c.prevPeriod.days : 0;
              console.log(years);
              let newConscriptionDate = new Date(conscriptionDate);
              newConscriptionDate = new Date(
                newConscriptionDate.setFullYear(
                  newConscriptionDate.getFullYear() - years
                )
              );
              newConscriptionDate = new Date(
                newConscriptionDate.setMonth(
                  newConscriptionDate.getMonth() - months
                )
              );
              newConscriptionDate = new Date(
                newConscriptionDate.setDate(
                  newConscriptionDate.getDate() - days
                )
              );
              procs.push({
                key:
                  "الشخص ده عنده مدة سابقة حسنة فنقد نقول إنه كأنه تاريخ تجنيده",
                value: this.getNearestDay(newConscriptionDate)
              });

              conscriptionDate = newConscriptionDate;
              console.log(new Date(conscriptionDate));
            }

            let demobilizationDate = new Date(conscriptionDate);
            if (
              (!c.qualificationId && c.qualificationId !== 0) ||
              !Object.keys(requiredMonth).includes(`${c.qualificationId}`)
            ) {
              errors.push("لا يوجد مؤهل. أو المؤهل غير صحيح");
              if (returnBoolean) {
                success(returnNotes ? errors : false);
              } else {
                failure(errors);
              }
            }
            procs.push({
              key: "المؤهل",
              value: c.qualification.name
            });
            let period = requiredMonth[c.qualificationId];

            //  هيكون فيه عدد الشهور للتخفيضات و ال6 شهور أو 3 لو سقط في محو الأمية
            // هحتاج المتغير ده لحساب صافي المدة الحسنة في رد المدة
            let plusMinusPeriod = 0;

            // console.log("period: " + period);
            procs.push({
              key: "وبالتالي مدة خدمته الحسنة هتكون",
              value: `${period} شهر`
            });
            demobilizationDate = new Date(demobilizationDate).setMonth(
              new Date(demobilizationDate).getMonth() + period
            );
            console.log(new Date(this.getNearestDay(demobilizationDate)));
            // console.log("demobilizationDate: " + new Date(demobilizationDate));
            // procs.push({
            //   key: "موقفه من السنة الزيادة",
            //   value:
            //     c.additionalYearStateId == 2
            //       ? "قابلة للرفع"
            //       : c.additionalYearStateId == 4
            //       ? "غير قابلة للرفع"
            //       : "ملهوش سنة زيادة"
            // });
            procs.push({
              key: "تاريخ التسريح هيكون",
              value: `${this.getNearestDay(
                demobilizationDate
              )} لكن دا مش تاريخ تسريح دفعة`
            });
            let getTotalFa2da = () => {
              let total = 0,
                dates = [],
                allHagsDays = 0;
              if (hasFugi) {
                // console.log("hasFugi");
                points.fugitives = [];
                c.fugitives.forEach(fugi => {
                  points.fugitives.push({
                    from: this.getNearestDay(fugi.absenceDate),
                    to: this.getNearestDay(fugi.returnDate)
                  });
                  if (fugi.returnDate && fugi.absenceDate) {
                    // removed until sorting
                    /*dates.push({
                      from: new Date(fugi.absenceDate),
                      to: new Date(fugi.returnDate)
                    });*/
                    // console.log("fugi from: " + fugi.absenceDate);
                    // console.log("fugi to: " + fugi.returnDate);
                    procs.push({
                      key: `عنده هروب من ${this.getNearestDay(
                        new Date(fugi.absenceDate)
                      )} الى ${this.getNearestDay(new Date(fugi.returnDate))}`,
                      value: `يعني ${this.countDays(
                        fugi.absenceDate,
                        fugi.returnDate,
                        true
                      )} يوم
                      بس مش بتدخل في المدة الفاقدة حاليا`
                    });
                  }
                });
              }

              if (hasPenalities) {
                points.penalties = [];
                c.penalties.forEach(peni => {
                  points.penalties.push({
                    from: this.getNearestDay(peni.penaltyStartDate),
                    to: this.getNearestDay(peni.penaltyEndDate),
                    crimeFrom: this.getNearestDay(peni.crimeStartDate),
                    crimeTo: this.getNearestDay(peni.crimeEndDate),
                    type: peni.penaltyTypeId == 1 ? "حبس" : "حجز"
                  });
                  let crimeDays = this.countDays(
                    peni.crimeStartDate,
                    peni.crimeEndDate
                  );
                  // مده الجريمه مش بتذيد يوم طبقا للشبكة العسكرية
                  // console.log("crimeDays: " + crimeDays);
                  if (crimeDays > 5) {
                    dates.push({
                      from: new Date(peni.crimeStartDate),
                      to: new Date(peni.crimeEndDate)
                    });
                    countStartingCrimeDays++;
                    // console.log("penalties from: " + peni.penaltyStartDate);
                    // console.log("penalties to: " + peni.penaltyEndDate);
                    procs.push({
                      key: `عنده جريمة من ${this.getNearestDay(
                        new Date(peni.crimeStartDate)
                      )} الى ${this.getNearestDay(
                        new Date(peni.crimeEndDate)
                      )}`,
                      value: `يعني ${this.countDays(
                        peni.crimeStartDate,
                        peni.crimeEndDate
                      )} يوم`
                    });
                  }
                  if (peni.penaltyStartDate && peni.penaltyEndDate) {
                    if (peni.penaltyTypeId == 1) {
                      // حبس
                      dates.push({
                        from: new Date(peni.penaltyStartDate),
                        to: new Date(peni.penaltyEndDate)
                      });
                      // console.log("crime from: " + peni.penaltyStartDate);
                      // console.log("crime to: " + peni.penaltyEndDate);
                      procs.push({
                        key: `عنده عقوبة حبس من ${this.getNearestDay(
                          new Date(peni.penaltyStartDate)
                        )} الى ${this.getNearestDay(
                          new Date(peni.penaltyEndDate)
                        )}`,
                        value: `يعني ${this.countDays(
                          peni.penaltyStartDate,
                          peni.penaltyEndDate,
                          true
                        )} يوم`
                      });
                    } else {
                      // حجز
                      let hagzDays = Math.ceil(
                        (new Date(peni.penaltyEndDate) -
                          new Date(peni.penaltyStartDate)) /
                          1000 /
                          60 /
                          60 /
                          24 +
                          1
                      );
                      allHagsDays += hagzDays;
                      //   penaltyStartDateFixed = new Date(
                      //     peni.penaltyEndDate
                      //   ).setDate(
                      //     new Date(peni.penaltyEndDate).getDate() - hagzDays
                      //   );
                      // dates.push({
                      //   from: new Date(peni.penaltyStartDate),
                      //   to: new Date(peni.penaltyEndDate)
                      // });
                      // procs.push({
                      //   key: `عنده عقوبة حجز من ${this.getNearestDay(
                      //     new Date(peni.penaltyStartDate)
                      //   )} الى ${this.getNearestDay(
                      //     new Date(peni.penaltyEndDate)
                      //   )} وهنقسمها للنص عشان الحجز نصف الحبس`,
                      //   value: `يعني ${this.countDays(
                      //     penaltyStartDateFixed,
                      //     peni.penaltyEndDate,
                      //     true
                      //   )} يوم`
                      // });
                    }
                  }
                });
              }
              if (hasCourts) {
                points.courts = [];
                c.courts.forEach(court => {
                  points.courts.push({
                    from: this.getNearestDay(court.imprisonFrom),
                    to: court.releaseDate
                      ? this.getNearestDay(court.releaseDate)
                      : this.getNearestDay(court.imprisonTo),
                    prosFrom: this.getNearestDay(court.prosecutionFrom),
                    prosTo: this.getNearestDay(court.prosecutionTo)
                  });
                  countStartingCrimeDays++;
                  if (![2, 4, 6, null].includes(court.courtConfermation)) {
                    // 2,4,6,null are إيقاف التنفيذ - إيقاف التنفيذ الشامل - البراءة - لم يتم الحكم
                    if (court.prosecutionFrom && court.prosecutionTo) {
                      // لو فيه تاريخ حبس احتياطي
                      dates.push({
                        from: new Date(court.prosecutionFrom),
                        to: new Date(court.prosecutionTo)
                      });
                      // console.log("court from: " + court.prosecutionFrom);
                      // console.log("court to: " + court.prosecutionTo);
                      procs.push({
                        key: `عنده حبس احتياطي من ${this.getNearestDay(
                          new Date(court.prosecutionFrom)
                        )} الى ${this.getNearestDay(
                          new Date(court.prosecutionTo)
                        )}`,
                        value: `يعني ${this.countDays(
                          court.prosecutionFrom,
                          court.prosecutionTo,
                          true
                        )} يوم`
                      });
                    }
                    if (
                      (court.releaseDate || court.imprisonTo) &&
                      court.imprisonFrom
                    ) {
                      let endImprison = court.releaseDate
                        ? court.releaseDate
                        : court.imprisonTo;
                      dates.push({
                        from: new Date(court.imprisonFrom),
                        to: new Date(endImprison)
                      });
                      // console.log(
                      //   "court.imprisonFrom: " + new Date(court.imprisonFrom)
                      // );
                      // console.log("endImprison: " + new Date(endImprison));
                      procs.push({
                        key: `عنده حبس من ${this.getNearestDay(
                          new Date(court.imprisonFrom)
                        )} الى ${this.getNearestDay(new Date(endImprison))}`,
                        value: `يعني ${this.countDays(
                          court.imprisonFrom,
                          endImprison,
                          true
                        )} يوم`
                      });
                    }
                  }
                  if (court.crimeStartDate && court.crimeEndDate) {
                    dates.push({
                      from: new Date(court.crimeStartDate),
                      to: new Date(court.crimeEndDate)
                    });
                    countStartingCrimeDays += 1;
                  }
                });
              }
              /*
              let isRepeated = d => {
                  let returner = false;
                  dates.forEach(date => {
                    let dif_1 = new Date(date.to) - new Date(d),
                      dif_2 = new Date(d) - new Date(date.from),
                      dif_3 = new Date(date.to) - new Date(date.from);
                    if (
                      dif_1 + dif_2 == dif_3 &&
                      dif_1 > 0 &&
                      dif_2 > 0 &&
                      dif_3 > 0
                    ) {
                      returner = true;
                    }
                  });
                  return returner;
                },
                isFrontEdge = d => {
                  return dates
                    .map(m => new Date(m.from).toISOString().substring(0, 10))
                    .includes(new Date(d).toISOString().substring(0, 10));
                },
                isBackEdge = d => {
                  return dates
                    .map(m => new Date(m.to).toISOString().substring(0, 10))
                    .includes(new Date(d).toISOString().substring(0, 10));
                };
              */
              if (dates.length > 0) {
                let dateList = [];
                dateList.push(dates[0].from);
                dateList.push(dates[0].to);
                // ex : [first fa2da from, first fa2da to]
                for (let i = 1; i < dates.length; i++) {
                  // loop 3la el f2da kolaha
                  let tempStart = dates[i].from,
                    tempEnd = dates[i].to;
                  // second fa2da from w second fa2da to
                  for (let li = 0; li < dateList.length; li += 2) {
                    // loop 3la el el first fa2da bs from w to
                    if (
                      tempStart >= dateList[li] &&
                      tempStart <= dateList[li + 1]
                    ) {
                      // lw el second fa2da from is between el first fa2da from and to

                      tempStart = dateList[li + 1];
                      // yeb2a el second fa2da from hateb2a equal el first fa2da to
                      // بالبلدي بيلحم الفاقده
                      // علشان لو افترضنا ان واحد واخد عقوبتين من 1/2/2020 : 20/2/2020
                      // والتانيه من 10/2/2020 : 25/2/2020
                      // بالتالي مش منطقي نحسب كل فاقده لوحدها و الا هيبقي فاقد 20 يوم في الاول و 15 في التانيه يعني 35 يوم و دع غير منطقي
                      // الصح انه يكون فاقد 25 يوم بس لان العقوبه التانيه اتطبقت و هو لسه بيقضي العقوبه الاول
                    }
                    if (
                      tempEnd >= dateList[li] &&
                      tempEnd <= dateList[li + 1]
                    ) {
                      // lw el second fa2da to is between el first fa2da from and to
                      tempEnd = dateList[li];
                      // yeb2a el second fa2da to hateb2a equal el first fa2da from
                      // نفس المثال الي فوق و لكن هنفترض هنا الن المصفوفه معكوسه
                    }
                  }
                  // اطلع بره اللوووب
                  if (tempEnd > tempStart) {
                    // lw el second to akbr mn el second from
                    dateList.push(tempStart);
                    dateList.push(tempEnd);
                    // لازم البوش دايما يبقي اتنينات علشان هو بيلووب باضافة 2 انديكس
                  }
                }
                // في النهايه ال ديت ليست بتكون عباره عند مصفوفة من عناصر من نوع ديت
                // كل عنصر من بعديه عنصر الي
                // و عمرك مهتلاقي اتنين داخلين في بعض

                for (let i = 0; i < dateList.length; i += 2) {
                  // لووب يمعلم عليها كلها
                  total +=
                    Math.ceil(
                      new Date(dateList[i + 1]) - new Date(dateList[i])
                    ) /
                      1000 /
                      60 /
                      60 /
                      24 +
                    1; // plus one to take the first date into consideration;
                  // اجمع بقي هنا يمعلم كله علي بعض
                }
                //total -= countStartingCrimeDays; // remove first date of crimes only as The military web
              }

              // console.log("totalFa2da: " + total);
              return { total, dates, allHagsDays };
            };
            let {
              total: totalFa2da,
              dates: allFa2daDates,
              allHagsDays: allHagsDays
            } = getTotalFa2da();
            points.fa2da = this.periodToDate(totalFa2da, false, true);
            if (totalFa2da > 0) {
              var totalFa2daBasicObj = this.daysToDate(totalFa2da, true);
              procs.push({
                key: "وبالتالي المدة الفاقدة هتكون",
                value: totalFa2da + " يوم"
              });
              procs.push({
                key: "المده الفاقدة بتقسيمة الشهر 30 يوم و السنه 365",
                value: `${totalFa2daBasicObj.years}-${totalFa2daBasicObj.months}-${totalFa2daBasicObj.days}`
              });
            }
            let isAdditionYearApplied = () => {
              let result = false;
              switch (c.additionalYearStateId) {
                case 4:
                  result = true;
                  break;
                case 2:
                  let yearCond = additionalYearAddCond[c.qualificationId];
                  let fa2daCond = totalFa2da + Math.ceil(allHagsDays / 2);
                  console.log("fa2daCond", fa2daCond);
                  if (fa2daCond >= yearCond) {
                    result = true;
                  }
                  if (failureSessionsLength == 3 && !sessionsHasOneSuccess) {
                    result = true;
                  }
                  if (failureSessionsLength > 3) {
                    result = true;
                  }
                  break;
              }
              return result;
            };
            // console.log("c.additionalYearStateId " + c.additionalYearStateId);
            let additionYearApplied = isAdditionYearApplied();
            // console.log("additionYearApplied: " + additionYearApplied);
            let demobilizationDateBeforeStarter = new Date(demobilizationDate);
            // console.log(
            //   "demobilizationDateBeforeStarter: " +
            //     demobilizationDateBeforeStarter
            // );
            // console.log("demobilizationDate: " + new Date(demobilizationDate));
            if ([2, 4].includes(c.additionalYearStateId)) {
              procs.push({
                key: "بالمناسبة الفرد دا عنده سنة زيادة",
                value:
                  c.additionalYearStateId == 2
                    ? "قابلة للرفع"
                    : "غير قابلة للرفع"
              });
              procs.push({
                key: additionYearApplied
                  ? "وهتتطبق عليه السنة الزيادة"
                  : "لكن مش هتطبق عليه السنة الزيادة",
                value: additionYearApplied
                  ? c.additionalYearStateId == 4
                    ? "لإنها غير قابلة للرفع"
                    : "لإن عنده مؤثرات تخليه يطبق عليه السنة الزيادة"
                  : "لإن مفيش عنده مؤثرات تخليها تطبق"
              });
            }
            let getClosestDof3a = d => {
              d = new Date(d);
              let { year, month, day } = {
                  year: d.getFullYear(),
                  month: d.getMonth() + 1,
                  day: d.getDate()
                },
                strictDate = false,
                mainDof3as = [3, 6, 9, 12];
              if (mainDof3as.includes(month) && day == 1) {
                strictDate = true;
              }
              if (!mainDof3as.includes(month)) {
                mainDof3as.push(month);
              }
              mainDof3as.sort((a, b) => a - b);
              let addZeroBeforeMonth = month => {
                month = month.toString();
                return month.length == 1 ? "0" + month : month;
              };
              let index = strictDate
                  ? mainDof3as.indexOf(month)
                  : mainDof3as.indexOf(month) + 1,
                requiredIndex = index == mainDof3as.length ? 0 : index,
                requiredMonth_inner = mainDof3as[requiredIndex],
                finalDate = new Date(
                  `${
                    (requiredIndex == 0 && !strictDate) ||
                    (additionYearApplied && requiredMonth_inner == 12)
                      ? year + 1
                      : year
                  }-${addZeroBeforeMonth(
                    additionYearApplied
                      ? requiredMonth_inner == 12
                        ? 2
                        : //  هنا  بتطبق السنة الزيادة
                          requiredMonth_inner + 2
                      : requiredMonth_inner
                  )}-01`
                );

              // console.log("mainDof3as " + mainDof3as);
              // console.log("finalDate " + finalDate);
              // console.log("requiredIndex " + requiredIndex);
              // console.log("requiredMonth_inner " + requiredMonth_inner);
              return new Date(finalDate);
            };
            demobilizationDate = getClosestDof3a(demobilizationDate);
            // console.log("getClosestDof3a: " + new Date(demobilizationDate));
            let demobilizationDateStarter = new Date(demobilizationDate);

            // console.log(
            //   "demobilizationDateStarter After getClosestDof3a: " +
            //     new Date(demobilizationDateStarter)
            // );
            points.demobilizationDateStarter = this.getNearestDay(
              demobilizationDateStarter
            );
            procs.push({
              key: "تاريخ تسريحه المبدئي هو",
              value: `${this.getNearestDay(demobilizationDateStarter)}`
            });
            console.log(procs);
            if (totalFa2da > 0) {
              //و  نضيف السنين الفاقدة علي تاريخ التسريح القبل مبدئي ونرجع ببقيت التاريخ
              demobilizationDateBeforeStarter = new Date(
                new Date(demobilizationDateBeforeStarter).setFullYear(
                  new Date(demobilizationDateBeforeStarter).getFullYear() +
                    totalFa2daBasicObj.years
                )
              );
              // نضيف بقي الشهور علي تاريخ التسريح النهائي الي هو بقي بيساوي نفس عدد شهور و ايام التسريح ما قبل المبدئي
              demobilizationDateBeforeStarter = new Date(
                new Date(demobilizationDateBeforeStarter).setMonth(
                  new Date(demobilizationDateBeforeStarter).getMonth() +
                    totalFa2daBasicObj.months
                )
              );

              // نضيف الايام و شكرااا
              demobilizationDateBeforeStarter = new Date(
                new Date(demobilizationDateBeforeStarter).setDate(
                  new Date(demobilizationDateBeforeStarter).getDate() +
                    totalFa2daBasicObj.days
                )
              );
              console.log(
                "before stater",
                demobilizationDateBeforeStarter.toISOString()
              );

              demobilizationDate = demobilizationDateBeforeStarter;
              demobilizationDate = getClosestDof3a(demobilizationDate);
              console.log("demo", demobilizationDate.toISOString());
              procs.push({
                key: "وتاريخ تسريحه بعد المدة الفاقدة هيكون",
                value: `${this.getNearestDay(demobilizationDate)}`
              });
            }
            // console.log("demobilizationDate: " + new Date(demobilizationDate));
            points.demobilizationDateAfterFa2da = this.getNearestDay(
              demobilizationDate
            );
            // console.log("failureSessionsLength " + failureSessionsLength);
            if (failureSessionsLength >= 3) {
              if (failureSessionsLength == 3 && sessionsHasOneSuccess) {
                // Do Nothing
              } else if (failureSessionsLength == 3 && !sessionsHasOneSuccess) {
                // هيفقد 6 شهور
                demobilizationDate = new Date(
                  new Date(demobilizationDate).setMonth(
                    new Date(demobilizationDate).getMonth() + 6
                  )
                );
                plusMinusPeriod += 6;
              } else if (failureSessionsLength > 3) {
                // هيفقد 6 شهور
                // وبعدها هيتخفضله 3 منهم
                demobilizationDate = new Date(
                  new Date(demobilizationDate).setMonth(
                    new Date(demobilizationDate).getMonth() + 6
                  )
                );
                plusMinusPeriod += 6;
                points.ignorantState = "أمي";
                procs.push({
                  key:
                    "لاحظ إن الفرد دا أمي, وعنده " +
                    failureSessionsLength +
                    " دورات تقصير , وبالتالي هيخسر 6 شهور",
                  value: `${this.getNearestDay(demobilizationDate)}`
                });
                if (c.ignorantId == 2 || sessionsHasOneSuccess) {
                  // مضى - يتم تخفيض 3 شهور
                  demobilizationDate = new Date(
                    new Date(demobilizationDate).setMonth(
                      new Date(demobilizationDate).getMonth() - 3
                    )
                  );
                  plusMinusPeriod -= 3;
                  procs.push({
                    key:
                      "بس هو أمضى في دورة أخرى خلال الـ 6 شهور, وبالتالي هيتخفضله 3 شهور",
                    value: `${this.getNearestDay(demobilizationDate)}`
                  });
                  points.ignorantState =
                    "أمي لكنه أمضى خلال أول 3 شهور من تاريخ فقده 6 شهور";
                }
              }
            }
            // console.log("demobilizationDate: " + demobilizationDate);
            let isHavingTrouble = () => {
              return {
                trouble: null,
                lastTrouble: null
              };
            };
            let { trouble, lastTrouble } = isHavingTrouble();
            if (trouble) {
              demobilizationDate = getClosestDof3a(trouble);
              if (
                trouble &&
                new Date(trouble) >
                  new Date(
                    new Date(demobilizationDate).setMonth(
                      new Date(demobilizationDate).getMonth() - 1
                    )
                  ) &&
                additionYearApplied
              ) {
                demobilizationDate = new Date(
                  new Date(demobilizationDate).setMonth(
                    new Date(demobilizationDate).getMonth() + 1
                  )
                );
              }
            }
            if (
              lastTrouble &&
              new Date(lastTrouble) >
                new Date(
                  new Date(demobilizationDate).setMonth(
                    new Date(demobilizationDate).getMonth() - 1
                  )
                ) &&
              additionYearApplied
            ) {
              demobilizationDate = new Date(
                new Date(demobilizationDate).setMonth(
                  new Date(demobilizationDate).getMonth() + 1
                )
              );
            }
            points.reductionState = c.reductionState
              ? c.reductionState.state
              : "بدون";

            /**
             * كنا في الاول فاكرين ان الشخص لو عنده قرار تخفيض واتحاكم قرار التخفيض بيتلغي
             * ولكن اتضح انه لا
             * قرار التخفيض مش هيتلغي
             * فشيلنا الكونديشن ده
             */
            switch (c.reductionStateId) {
              case 2:
                demobilizationDate = new Date(
                  new Date(demobilizationDate).setMonth(
                    new Date(demobilizationDate).getMonth() - 3
                  )
                );
                plusMinusPeriod -= 3;
                procs.push({
                  key:
                    "وبما إن الفرد دا عنده تخفيض 3 شهور, ومعندوش أي مؤثرات تمنع تطبيق التخفيض دا, فـ هيكون تاريخ تسريحه",
                  value: `${this.getNearestDay(demobilizationDate)}`
                });
                break;
              case 3:
                demobilizationDate = new Date(
                  new Date(demobilizationDate).setMonth(
                    new Date(demobilizationDate).getMonth() - 6
                  )
                );
                plusMinusPeriod -= 6;
                procs.push({
                  key:
                    "وبما إن الفرد دا عنده تخفيض 6 شهور, ومعندوش أي مؤثرات تمنع تطبيق التخفيض دا, فـ هيكون تاريخ تسريحه",
                  value: `${this.getNearestDay(demobilizationDate)}`
                });
                break;
            }
            // console.log("reductionStateId: " + c.reductionStateId);
            points.demobilizationDateAfterReductionState = this.getNearestDay(
              demobilizationDate
            );

            let isInBetween = (a, b, c) => {
              a = new Date(a);
              b = new Date(b);
              c = new Date(c);
              return a < b && a >= c;
            };
            let shouldLose4Months = () => {
              let result = false,
                result_replacer = false;
              if (additionYearApplied) {
                // تاريخ التسريح النهائي
                let d_date = new Date(demobilizationDate),
                  d_dateMinus1 = new Date(
                    new Date(d_date).setMonth(new Date(d_date).getMonth() - 1)
                  ),
                  // تاريخ التسريح المبدئي
                  d_starter = new Date(demobilizationDateStarter),
                  d_starterMinus1 = new Date(
                    new Date(d_starter).setMonth(
                      new Date(d_starter).getMonth() - 1
                    )
                  ),
                  d_starterPlus2 = new Date(
                    new Date(d_starter).setMonth(
                      new Date(d_starter).getMonth() + 2
                    )
                  ),
                  d_starterPlus3 = new Date(
                    new Date(d_starter).setMonth(
                      new Date(d_starter).getMonth() + 3
                    )
                  ),
                  datesToTest = [];
                if (hasFugi) {
                  // عنده هروب
                  c.fugitives.forEach(fugi => {
                    if (fugi.returnDate && fugi.absenceDate) {
                      datesToTest.push(fugi.returnDate);
                    }
                  });
                }
                if (hasCourts) {
                  // عنده محكمه
                  c.courts.forEach(court => {
                    if (
                      (court.releaseDate || court.imprisonTo) &&
                      court.imprisonFrom
                    ) {
                      let endImprison = court.releaseDate
                        ? court.releaseDate
                        : court.imprisonTo;
                      datesToTest.push(court.imprisonFrom);
                      datesToTest.push(endImprison);
                    }
                  });
                }
                if (hasPenalities) {
                  // عنده عقوبه
                  c.penalties.forEach(peni => {
                    if (
                      peni.crimeStartDate &&
                      peni.crimeEndDate &&
                      peni.penaltyStartDate &&
                      peni.penaltyEndDate
                    ) {
                      let crimeDays = Math.ceil(
                        (new Date(peni.crimeEndDate) -
                          new Date(peni.crimeStartDate)) /
                          1000 /
                          60 /
                          60 /
                          24
                      );
                      datesToTest.push(peni.penaltyStartDate);
                      datesToTest.push(peni.penaltyEndDate);
                      if (crimeDays > 5) {
                        datesToTest.push(peni.crimeEndDate);
                      }
                    }
                  });
                }
                datesToTest.forEach(dateToTest => {
                  // result =
                  //   result ||
                  //   isInBetween(dateToTest, d_starterPlus3, d_starterPlus2);
                  result =
                    result || isInBetween(dateToTest, d_date, d_dateMinus1); // داخل شهر التبكير
                  result_replacer =
                    result_replacer ||
                    new Date(dateToTest) > new Date(d_starterPlus3);
                  result_replacer =
                    result_replacer ||
                    new Date(dateToTest) > new Date(d_starter);
                });
              }
              // result = result_replacer ? false : result;
              return result;
            };
            let lose4Months = shouldLose4Months();
            // console.log("shouldLose4Months: " + lose4Months);
            let demobilizationDateWith4Months = lose4Months
              ? new Date(
                  new Date(demobilizationDate).setMonth(
                    new Date(demobilizationDate).getMonth() + 4
                  )
                )
              : demobilizationDate;
            if (lose4Months) {
              procs.push({
                key:
                  " الشخص ده جاتله عقوبة في شهر التبكير وبكدة هيتأخر اربع شهور ويبقى التاريخ ً",
                value: `${this.getNearestDay(demobilizationDateWith4Months)}`
              });
            }
            // console.log(
            //   "demobilizationDateWith4Months: " + demobilizationDateWith4Months
            // );
            demobilizationDate = this.getNearestDay(
              lose4Months
                ? new Date(demobilizationDate) >
                  new Date(demobilizationDateWith4Months)
                  ? demobilizationDate
                  : demobilizationDateWith4Months
                : demobilizationDate
            );

            ///////////////////////////
            //      جزئية
            // رد المدة الفاقدة
            ///////////////////////////

            // تاريخ التجنيد
            conscriptionDate;

            // تاريخ التسريح المبدأي
            demobilizationDateStarter;

            // تاريخ التسريح النهائي
            demobilizationDate;

            // تاريخ التسريح قبل النهائي
            let prevDemobilizationDate = this.getNearestDay(
              new Date(
                new Date(demobilizationDate).setMonth(
                  new Date(demobilizationDate).getMonth() - 3 // نقصت دفعة
                )
              )
            );

            let mainPrevDemobilizationDate = this.getNearestDay(
              new Date(
                new Date(demobilizationDate).setMonth(
                  new Date(demobilizationDate).getMonth() - 2 // نقصت دفعة
                )
              )
            );
            procs.push({
              key: "تاريخ التسريح قبل النهائي",
              value: `${prevDemobilizationDate}`
            });

            // تاريخ التجنيد + المدد الفاقدة + الشهور المطلوبة للجيش + مدد التخفيض أو الزيادة
            // الي لو نقصت منه رد المدة ووصل لتاريخ التسريح قبل النهائي
            // يبقى يستحق رد المدة
            let demobilizationDateForRadModa = new Date(
              new Date(conscriptionDate).setMonth(
                new Date(conscriptionDate).getMonth() +
                  requiredMonth[c.qualificationId]
              )
            );
            demobilizationDateForRadModa = this.getNearestDay(
              new Date(
                new Date(demobilizationDateForRadModa).setDate(
                  demobilizationDateForRadModa.getDate() + totalFa2da
                )
              ).toISOString()
            );

            procs.push({
              key:
                "مجموع تاريخ التجنيد + الشهور المطلوب + المدد الفاقدة + مدد التخفيض",
              value: `${demobilizationDateForRadModa}`
            });

            // سدس صافي المدة الحسنة بالأيام
            let sixthModaDays = Math.ceil(
              (this.countDays(conscriptionDate, mainPrevDemobilizationDate) -
                totalFa2da) /
                6
            );
            procs.push({
              key: "سدس صافي المدة الحسنة",
              value: `${sixthModaDays}`
            });

            // -_- تاريخ بداية آخر سدس من مدته -_-
            let startLastSixthDateRadModa = this.getNearestDay(
              new Date(
                new Date(mainPrevDemobilizationDate).setDate(
                  new Date(mainPrevDemobilizationDate).getDate() - sixthModaDays
                )
              )
            );
            procs.push({
              key: "تاريخ بداية سدس المدة الحسنة",
              value: `${startLastSixthDateRadModa}`
            });

            // هل عنده مشاكل في السدس الأخير
            allFa2daDates.forEach(el => {
              if (new Date(el.from) > new Date(startLastSixthDateRadModa)) {
                hasTroubleInLasthSixth = true;
              }
              if (new Date(el.to) > new Date(startLastSixthDateRadModa)) {
                hasTroubleInLasthSixth = true;
              }
            });

            // عدد الأيام الي الفرد محتاجها علشان يطلع في ال
            // prevDemobilizationDate
            let radModaCountDays = this.countDays(
              prevDemobilizationDate,
              demobilizationDateForRadModa,
              true
            );
            // كل مؤهل (عادة.. الخ) ليه عدد أيام ممكن يتردله متسجلة في المتغير
            radModaCond;
            // هل عدد الأيام ده هو مسمحوله ياخده
            if (
              new Date(demobilizationDateStarter).getTime() !=
                new Date(demobilizationDate).getTime() &&
              radModaCountDays <= radModaCond[c.qualificationId] &&
              radModaCountDays > 0
            ) {
              // نشوف لو معندوش محاكم او سنة زيادة
              // فيه تعديل حصل إنه ممكن يبقى عنده رد مدة فاقدة لو واخد محكمة وعقوبات
              if (
                (!hasCourts || (hasCourts && hasPenalities)) &&
                !additionYearApplied &&
                !hasTroubleInLasthSixth
              ) {
                canRadModa = true;
                errors.push(
                  "هذا الفرد يستحق رد المدة الفاقدة وقدرها " + radModaCountDays
                );
                this.showError(
                  "هذا الفرد يستحق رد المدة الفاقدة من إدارة السجلات وقدرها: " +
                    radModaCountDays +
                    "يوم"
                );

                procs.push({
                  key: "الشخص ده يستحق رد مدة خدمة وقدرها ",
                  value: `${radModaCountDays}`
                });
              } else {
                procs.push({
                  key: "الشخص ده لا يستحق رد مدة فاقدة ولو إستحقها سيرد له ",
                  value: `${radModaCountDays}`
                });
              }
            }
            ///////////////////////////
            // نهاية جزئية
            // رد المدة الفاقدة
            ///////////////////////////
            points.endingDutyDate = c.endingDutyDate;
            points.demobilizationDate = this.getNearestDay(demobilizationDate);

            procs.push({
              key: "تاريخ التسريح النهائي هو",
              value: `${this.getNearestDay(demobilizationDate)}`
            });
            let updateDemobDate = await this.api("global/update_one", {
              table: "conscriptes",
              where: {
                militaryId
              },
              update: {
                canRadModa,
                demobilizationDate: points.demobilizationDate,
                demobilizationDateStarter: points.demobilizationDateStarter
              }
            });
            if (updateDemobDate && updateDemobDate.ok && updateDemobDate.data) {
              procs.push({
                key: "التحديث في قاعدة البيانات",
                value: "تم تحديث تاريخ التسريح المبدئي والنهائي للفرد"
              });
            }
            if (returnBoolean) {
              success(returnNotes ? errors : true);
              // success({
              //   errors
              // });
            } else {
              success({
                procs,
                points,
                demobilizationDateStarter: this.getNearestDay(
                  demobilizationDateStarter
                ),
                demobilizationDate: this.getNearestDay(demobilizationDate),
                demobilizationDateBeforeStarter: this.getNearestDay(
                  demobilizationDateBeforeStarter
                ),
                period,
                totalFa2da,
                additionYearApplied
              });
            }
          })
          .catch(error => {
            // console.log(militaryId + " Error:");
            // console.log(error);
            errors.push(
              "تعذر إيجاد الفرد في قاعدة البيانات, برجاء التحقق من الرقم العسكري"
            );
            // this.showError(
            //   "تعذر إيجاد الفرد في قاعدة البيانات, برجاء التحقق من الرقم العسكري"
            // );
            if (returnBoolean) {
              success(false);
            } else {
              failure(errors);
            }
          });
      });
    }
  }
});
