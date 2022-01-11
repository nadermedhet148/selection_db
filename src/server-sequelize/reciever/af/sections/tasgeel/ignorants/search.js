module.exports = async (db, params) => {
  console.log(params.search);
  let search = params.search,
    like = ["fullName", "militaryId"],
    date = [
      "conscriptionDate",
      "demobilizationDate",
      "demobilizationDateStarter"
    ],
    ignore = ["failureSessions"],
    where = {
      typeId: 1,
      qualificationId: 0,
      stateIdCurrent: search.stateIdCurrent ? search.stateIdCurrent : 1
    };
  Object.keys(search).forEach(key => {
    if (!ignore.includes(key)) {
      let val = search[key];
      if (
        ((typeof val == "string" || Array.isArray(val)) &&
          val &&
          val.length > 0) ||
        (typeof val == "number" && (val || val === 0))
      ) {
        if (like.includes(key)) {
          where[key] = {
            $like: `${val}%`
          };
        } else if (date.includes(key)) {
          if (val.length == 1) {
            where[key] = {
              $between: [new Date(val[0]), new Date(val[0])]
            };
          } else if (val.length > 1) {
            if (new Date(val[0]) > new Date(val[1])) {
              where[key] = {
                $between: [new Date(val[1]), new Date(val[0])]
              };
            } else {
              where[key] = {
                $between: [new Date(val[0]), new Date(val[1])]
              };
            }
          }
        } else {
          where[key] = val;
          console.log("else key = ", key, "val = ", val);
          console.log("====================================");
        }
      }
    }
  });
  console.log("====================================");
  console.log("where in search : .. ,", where);
  console.log("====================================");
  try {
    let conscriptes = await db.conscriptes.findAll({
        where,
        attributes: [
          "militaryId",
          "fullName",
          "demobilizationDate",
          "ignorantSupporterId",
          "forceId"
        ],
        include: [
          {
            model: db.units,
            attributes: ["unitText"],
            required: false
          },
          {
            model: db.dutyStates,
            attributes: ["text"],
            required: false
          },
          {
            model: db.dutyCurrentStates,
            attributes: ["text"],
            required: false
          },
          {
            model: db.ignorants,
            attributes: ["displayedText"],
            required: false
          },
          {
            model: db.ignorantSupporters,
            attributes: ["displayedText"],
            required: false
          },
          {
            model: db.failureSessions,
            required: false
          }
        ]
      }),
      parsed = JSON.parse(JSON.stringify(conscriptes)),
      returner = [];

    parsed.forEach((el, i) => {
      // skipe whose not hodod from feched data.
      if (!search.forceId) {
        let identifier = el.militaryId.slice(6, 8);
        let isHodod =
          ["18", "52", "04", "66", "77", "88"].includes(identifier) &&
          (el.forceId == 52 || el.forceId == null);
        if (!isHodod) {
          console.log("index = ", i, " hase been skipet");
          console.log(" == ", el);
          return;
        }
      }
      console.log("loop", i);
      //
      el.failureSessionsCounter = el.failureSessions
        ? el.failureSessions.length
        : 0;
      if (!search.failureSessions && search.failureSessions !== 0) {
        // محددش اي اختيار في الدورات
        returner.push(el);
      } else {
        if (search.failureSessions == 4) {
          if (el.failureSessionsCounter > 0) {
            returner.push(el);
          }
        } else {
          if (el.failureSessionsCounter == search.failureSessions) {
            returner.push(el);
          }
        }
      }
    });

    return returner;
  } catch (error) {
    return error;
  }
};
