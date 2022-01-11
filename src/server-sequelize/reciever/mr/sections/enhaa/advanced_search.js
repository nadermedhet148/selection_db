module.exports = async (db, params) => {
  let { search, values, late_stuff } = params,
    getObjectValueByPath = (obj, path, fallback = undefined) => {
      // credit: http://stackoverflow.com/questions/6491463/accessing-nested-javascript-objects-with-string-key#comment55278413_6491621
      if (obj == null || !path || typeof path !== "string") return fallback;
      if (obj[path] !== undefined) return obj[path];
      path = path.replace(/\[(\w+)\]/g, ".$1"); // convert indexes to properties
      path = path.replace(/^\./, ""); // strip a leading dot
      return getNestedValue(obj, path.split("."), fallback);
    },
    getNestedValue = (obj, path, fallback) => {
      const last = path.length - 1;
      if (last < 0) return obj === undefined ? fallback : obj;
      for (let i = 0; i < last; i++) {
        if (obj == null) {
          return fallback;
        }
        obj = obj[path[i]];
      }
      if (obj == null) return fallback;
      return obj[path[last]] === undefined ? fallback : obj[path[last]];
    },
    /**
     * get the court which have the conditions that
     * must be in the court to end the service of the conscripte
     * the same code exists in the front end
     */
    getTheCourt = (courts, degreeId) => {
      let courtsLength = courts.length,
        theCourt = courts[courts.length - 1],
        error = false;

      /**
       * لو مفيش غير محاكمة واحدة
       * استخدمها حتى لو مينطبقش عليها الشروط كاملة
       * وده ميمنعش إن الايرورز تظهر كتنبيه
       * وده بأمر من المقدم
       *
       *
       * لكن لو في حالة اكتر من محاكمة لازم
       * واحدة عالاقل ينطبق عليها الشروط
       */

      // دراسة انهاء خدمة = منتهي
      courts = courts.filter(court => court.contDuty === false);
      if (courts.length == 0) {
        if (courtsLength > 1) {
          // عندي اكتر من محاكمة طلع إيرور
          // لحد ما يحل المشكلة
          theCourt = {};
        }
        error = true;
      } else if (courts.length > 1) {
        theCourt = {};
        error = true;
      }

      /**
       * the period should be:
       * - for soldier      = 1 year or more
       * - for saff         = 6 months or more
       * - or isDishonorable // مخله بالشرف
       * - isForSecurity &  = 3 months or more
       */
      courts = courts.filter(court => {
        let { year, month, day } = getPrisonPeriod(court);

        return (
          (degreeId == 2 && year >= 1) ||
          (degreeId != 2 && month >= 6) ||
          court.isDishonorable ||
          (court.isForSecurity && month >= 3)
        );
      });

      // there's no courts after last filter
      // and there's no error from the first
      if (!courts.length && !error) {
        if (courtsLength > 1) {
          theCourt = {};
        }
        error = true;
      } else if (courts.length) {
        theCourt = courts[courts.length - 1];
      }

      return theCourt;
    },
    getPrisonPeriod = court => {
      let {
          // الحبس الإحتياطي
          prosecutionFrom,
          prosecutionTo,
          // الحبس
          imprisonFrom,
          imprisonTo,
          // الإفراج
          releaseDate,
          // الحبس
          pYear,
          pMonth,
          pDay,
          // التخفيض
          reductionYear,
          reductionMonth,
          reductionDay,
          // العفو
          forgiveYear,
          forgiveMonth,
          forgiveDay
        } = court,
        startDate = prosecutionFrom
          ? prosecutionFrom
          : imprisonFrom
          ? imprisonFrom
          : null,
        endDate = imprisonTo
          ? imprisonTo
          : prosecutionTo
          ? prosecutionTo
          : null,
        reductionPeriod = 0;
      reductionPeriod += Number(reductionDay) > 0 ? Number(reductionDay) : 0;
      reductionPeriod +=
        Number(reductionMonth) > 0 ? Number(reductionMonth) * 30 : 0;
      reductionPeriod +=
        Number(reductionYear) > 0 ? Number(reductionYear) * (30 * 12) : 0;
      reductionPeriod = Number(reductionPeriod) * (24 * 60 * 60 * 1000);
      let diff =
        startDate && endDate ? new Date(endDate) - new Date(startDate) : 0;
      if (diff > 0) {
        diff -= reductionPeriod;
      }
      let diffWithReleaseDate =
          startDate && releaseDate
            ? new Date(releaseDate) - new Date(startDate)
            : 0,
        { year: fyear, month: fmonth, day: fday } = periodToDate(
          diffWithReleaseDate == 0 || diffWithReleaseDate > diff
            ? 0
            : diff - diffWithReleaseDate,
          false
        );
      return periodToDate(diffWithReleaseDate ? diffWithReleaseDate : diff);
    },
    periodToDate = (period, addDay = true, inDays = false) => {
      if (!period) {
        return {
          year: 0,
          month: 0,
          day: 0
        };
      }
      // 8640000000
      period = period / (inDays ? 1 : 86400000) + (addDay ? 1 : 0); // Period in days
      let years = Math.floor(Number(period) / (12 * 30)),
        months = Math.floor((Number(period) - years * (12 * 30)) / 30),
        days = Number(period) - years * (12 * 30) - months * 30;
      return {
        year: Math.round(years),
        month: Math.round(months),
        day: Math.round(days)
      };
    },
    new_values = {
      main: {
        // endingDutyDate: {
        //   $gte: "2020-12-31"
        // }
      },
      enhaa: {},
      courts: {}
    },
    groups = [],
    proc_cards_select = [
      {
        text: "لم يتم الإستلام",
        value: 1
      },
      {
        text: "تم الإستلام",
        value: 2
      },
      {
        text: "فقد",
        value: 3
      },
      {
        text: "لا يستحق",
        value: 4
      },
      {
        text: "لم يدرج",
        value: 5
      }
    ],
    mayI_In = function(stateId, sectionId) {
      /**
       * all_sections: {
       *   1: "النموذج 20 س", // w
       *   2: "النموذج 21 س / 26 س", // w
       *   3: "الإعفاء المؤقت",
       *   4: "اللجنة الطبية",
       *   5: "في حالة تأخير الإنهاء للترقية",
       *   6: "الكلية الحربية",
       *   7: "تسليم الموقف المالي", // تأمينات ومعاشات // w
       *   8: "قرار السببية", // w
       *   9: "شهادة الوفاة", // w
       *   10: "دراسة سوء السلوك",
       *   11: "لجنة التعويضات",
       *   12: "استكمال الإجراءات",
       *   13: "بيان الشهيد",
       *   14: "النموذج 170 س",
       *   15: "مستحقات مالية",
       *   16: "الترقي الإستثنائي", // w
       *   17: "الملاحظات"
       * }
       */
      let between = [
          "8",
          "9",
          "14",
          "3",
          "6",
          "10",
          "15",
          "13",
          "4",
          "7",
          "11",
          "12",
          "16"
        ],
        other = [
          "1",
          "8",
          "2",
          "9",
          "14",
          "3",
          "6",
          "10",
          "15",
          "13",
          "4",
          "7",
          "11",
          "12",
          "16"
        ],
        obj = {
          // عدم لياقة طبية
          150: ["9", "3", "6", "10", "13", "16", "15", "12"], // Added Manually "15", "12"
          // عدم لياقة استثنائية
          151: [
            "1",
            "8",
            "9",
            "14",
            "3",
            "6",
            "10",
            "15",
            "13",
            "4",
            "7",
            "11",
            "12",
            "16"
          ],
          // عدم لياقة قبل الخدمة
          152: ["9", "3", "6", "10", "15", "13", "7", "11", "12", "16"],
          // سوء السلوك
          153: ["8", "9", "3", "6", "15", "13", "4", "7", "11", "12", "16"],
          154: ["8", "9", "3", "6", "15", "13", "4", "7", "11", "12", "16"],
          155: ["8", "9", "3", "6", "15", "13", "4", "7", "11", "12", "16"],
          156: ["8", "9", "3", "6", "15", "13", "4", "7", "11", "12", "16"],
          // الإعفاء المؤقت والنهائي
          157: ["8", "9", "6", "10", "15", "13", "4", "7", "11", "12", "16"],
          158: ["8", "9", "6", "10", "15", "13", "4", "7", "11", "12", "16"],
          // تعديل صفة
          159: ["8", "9", "3", "6", "10", "15", "13", "4", "12", "16"],
          // الكلية الحربية
          160: [
            "8",
            "2",
            "9",
            "3",
            "10",
            "15",
            "13",
            "4",
            "7",
            "11",
            "12",
            "16"
          ],
          // دواعي الصالح العام
          161: [
            "8",
            "9",
            "3",
            "6",
            "10",
            "15",
            "13",
            "4",
            "7",
            "11",
            "12",
            "16"
          ],
          // الإستشهاد
          162: ["2", "3", "6", "10", "15", "4", "11", "12", "16"],
          // الوفاة
          163: ["2", "3", "6", "10", "15", "13", "4", "11", "12", "16"],
          // عدم الصلاحية الفنية
          164: [
            "1",
            "8",
            "2",
            "9",
            "14",
            "3",
            "6",
            "10",
            "15",
            "13",
            "4",
            "7",
            "11",
            "12",
            "16"
          ],
          // مادة 109
          165: ["8", "9", "14", "3", "6", "10", "15", "13", "4", "11", "16"],
          // عدم - التصديق | الرغبة - في التجديد + الإستقالة
          166: ["8", "2", "9", "3", "6", "10", "13", "4", "11", "16"],
          167: ["8", "2", "9", "3", "6", "10", "13", "4", "11", "16"],
          168: ["8", "2", "9", "3", "6", "10", "13", "4", "11", "16"],
          // الوفاة أثناء الغياب
          171: [
            "8",
            "2",
            "14",
            "3",
            "6",
            "10",
            "15",
            "13",
            "4",
            "11",
            "12",
            "16"
          ],
          // بلوع السن القانوني
          172: ["8", "9", "3", "6", "10", "13", "4", "11", "16"],
          // بلوغ السن أثناء الغياب
          173: ["8", "14", "3", "6", "10", "15", "13", "4", "11", "12", "16"],
          // الفقرة 107
          174: ["8", "14", "3", "6", "10", "13", "4", "11", "16"],
          // سبب الإنهاء الجديد اللي المقدم قاللي أضيفه
          175: ["3", "4", "5", "6", "10", "11", "12", "13", "14", "15"]
        };
      if (obj[stateId]) {
        return !obj[stateId].includes(sectionId);
      }
      if (stateId >= 150 && stateId < 200) {
        return !between.includes(sectionId);
      }
      if (stateId < 150 || stateId >= 200) {
        return !other.includes(sectionId);
      }
      return false;
    },
    include = [
      {
        model: db.conscriptes,
        required: true,
        include: [
          {
            model: db.units,
            required: false
          },
          {
            model: db.degrees,
            required: false
          },
          {
            model: db.dutyStates,
            required: false
          },
          {
            model: db.courts,
            required: false
          }
        ]
      }
    ],
    exlude = ["termDateByPromotion"];
  if (late_stuff) {
    // new_values.main["typeId"] = 1;
    // new_values.enhaa["finished"] = true;
  } else {
    console.log("This is search query");
    console.log(search);
    Object.keys(search).forEach(key => {
      // Main, Enhaa
      let section = search[key];
      section.forEach(s => {
        s.childs.forEach(c => {
          // c.type can be one of [checkbox, select, text, date]
          let value = values[key][c.value];
          if (
            (value || value === 0) &&
            (!Array.isArray(value) || value.length > 0)
          ) {
            switch (c.type) {
              case "date":
                if (value.length == 1) {
                  value[1] = value[0];
                }
                new_values[c.value.includes("lastCourt") ? "courts" : key][
                  c.value.replace("lastCourt.", "")
                ] = {
                  [db.Op.between]: [new Date(value[0]), new Date(value[1])]
                };
                break;
              case "checkbox":
                new_values[c.value.includes("lastCourt") ? "courts" : key][
                  c.value.replace("lastCourt.", "")
                ] = {
                  [value == "yes" ? db.Op.not : db.Op.is]: null
                };
                break;
              default:
                new_values[c.value.includes("lastCourt") ? "courts" : key][
                  c.value.replace("lastCourt.", "")
                ] = c.likeData
                  ? {
                      [db.Op.like]: `%${value}%`
                    }
                  : value;
                break;
            }
          }
        });
      });
    });
  }
  if (Object.keys(new_values.main).length > 0) {
    include[0].where = new_values.main;
  }
  if (Object.keys(new_values.courts).length > 0) {
    include[0].include[3].where = new_values.courts;
  }
  let dutyStates = await db.dutyStates.findAll({
      raw: true,
      nest: true
    }),
    cons = await db.dutyTerminations.findAll({
      where: { ...new_values.enhaa },
      include,
      raw: true,
      nest: true
    }),
    // cons = _cons.slice(0, 100),
    usedDutyStates = cons.map(c => c.conscripte.stateId),
    uniqueDutyStates = [...new Set(usedDutyStates)],
    fixed_cons = {
      unStated: {
        title: "ليس له سبب إنهاء",
        id: "unStated",
        items: [],
        search: "",
        selected: [],
        headers: [],
        groups: []
      }
    },
    changeKey = {
      fullName: "conscripte.fullName",
      // militaryId: "conscripte.militaryId",
      degreeId: "conscripte.degree.degreeType",
      unitId: "conscripte.unit.unitText",
      "lastCourt.lastUnitReply": "conscripte.courts.lastUnitReply",
      "lastCourt.lastBranchReply": "conscripte.courts.lastBranchReply",
      "lastCourt.s161Date": "conscripte.courts.s161Date"
    },
    main_headers = [];
  groups.push(search.main[0]);
  search.main
    .filter(i => i.id == "0")[0]
    .childs.filter(c =>
      ["militaryId", "fullName", "degreeId", "unitId"].includes(c.value)
    )
    .forEach(header => {
      header.value = changeKey[header.value]
        ? changeKey[header.value]
        : header.value;
      header.sortable = true;
      header.group = "0";
      main_headers.push(header);
    });
  fixed_cons.unStated.headers = main_headers;
  fixed_cons.unStated.groups = groups;
  uniqueDutyStates.forEach(un => {
    let headers = [...main_headers],
      in_groups = [...groups];
    search.enhaa.forEach(el => {
      if (mayI_In(un, el.id)) {
        in_groups.push(el);
        el.childs.forEach(header => {
          header.value = changeKey[header.value]
            ? changeKey[header.value]
            : header.value;
          header.sortable = true;
          header.group = el.id;
          headers.push(header);
        });
      }
    });
    if (dutyStates.filter(d => d.stateId == un)[0]) {
      fixed_cons[un] = {
        title: dutyStates.filter(d => d.stateId == un)[0].text,
        id: un,
        items: [],
        search: "",
        selected: [],
        headers,
        groups: in_groups
      };
    }
  });
  let unRequired = ["finished"];

  /**
   * This a filteration of courts to leave the correct record
   * because only one court will end the service of a conscripte
   * I accepted a little bad performance instead of wasting time to recreate this page
   */
  let filteredCons = [];
  for (let i = 0; i < cons.length; i++) {
    con = cons[i];

    // any states that don't need courts
    if (![154, 156].includes(con.conscripte.stateId)) {
      filteredCons.push(con);
      continue;
    }

    let courts = await db.courts.findAll({
      where: { militaryId: con.conscripte.militaryId }
    });

    // the record doesn't have courts
    if (courts.length == 0) {
      filteredCons.push(con);
      continue;
    }

    let theCourt = getTheCourt(courts, con.conscripte.degreeId);
    if (con.conscripte.courts.courtId == theCourt.courtId) {
      filteredCons.push(con);
      continue;
    }
  }
  cons = filteredCons;

  cons.forEach(con => {
    let isFollowed = false,
      headers =
        con.conscripte.stateId && fixed_cons[con.conscripte.stateId]
          ? fixed_cons[con.conscripte.stateId].headers
          : [];
    if (con.conscripte.stateId && late_stuff) {
      headers.forEach(header => {
        if (
          !unRequired.includes(header.value) &&
          (!header.onlyFor || header.onlyFor == con.conscripte.typeId)
        ) {
          let v = getObjectValueByPath(con, header.value);

          if (!v) {
            // console.log(header.value);
            isFollowed = true;
          }
        }
      });
    } else {
      isFollowed = true;
    }
    if (isFollowed) {
      let proc_cards = ["medicalCard", "militaryCard", "drivingLicence"];
      proc_cards.forEach(pcard => {
        let exists =
          proc_cards_select.filter(p => p.value == con[pcard]).length > 0;
        con[pcard] = exists
          ? proc_cards_select.filter(p => p.value == con[pcard])[0].text
          : con[pcard];
      });
      con.tableId = con.conscripte.stateId
        ? con.conscripte.stateId
        : "unStated";
      fixed_cons[
        con.conscripte.stateId ? con.conscripte.stateId : "unStated"
      ].items.push(con);
    }
  });
  let arr_fixed_cons = [],
    removedKeys = ["101", "102", "105", "106", "107"];
  Object.keys(fixed_cons).forEach(key => {
    if (!removedKeys.includes(key)) {
      let value = fixed_cons[key];
      if (value.items && value.items.length > 0) {
        arr_fixed_cons.push(value);
      }
    }
  });
  return arr_fixed_cons;
};
