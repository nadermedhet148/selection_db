module.exports = async (db, params) => {
  let search = params.search,
    like = [
      "conscriptes.fullName",
      "conscriptes.militaryId",
      "conscriptes.nationalId",
      "conscriptes.phoneNumber"
    ],
    date = [
      "birthDate",
      "dateOfIssurance",
      "dateOfRenewal",
      "dateOfExpiration"
    ],
    where = {
      conscriptes: {},
      cardsFamilyMembers: {},
      cards: {},
      cardsTracking: {}
    };

  //console.log(search);
  Object.keys(search).forEach(key => {
    let val = search[key],
      tableName = key.split(".")[0],
      column = key.split(".")[1];
    if (
      ((typeof val == "string" || Array.isArray(val)) &&
        val &&
        val.length > 0) ||
      (typeof val == "number" && (val || val === 0)) ||
      (typeof val == "object" && date.includes(column))
    ) {
      if (like.includes(key)) {
        where[tableName][column] = {
          $like: `${val}%`
        };
      } else if (date.includes(column)) {
        if (val.from || val.to) {
          where[tableName][column] = {
            [val.from && val.to ? "$between" : val.from ? "$gte" : "$lte"]:
              val.from && val.to
                ? [
                    new Date(
                      new Date(val.from).setDate(
                        new Date(val.from).getDate() - 1
                      )
                    ),
                    new Date(
                      new Date(val.to).setDate(new Date(val.to).getDate() + 1)
                    )
                  ]
                : val.from
                ? new Date(val.from)
                : new Date(val.to)
          };
        }
      } else {
        where[tableName][column] = val;
      }
    }
  });
  //console.log(where);
  try {
    let include = {
      conscriptes: {
        model: db.conscriptes,
        attributes: [
          "militaryId",
          "fullName",
          "nationalId",
          "degreeId",
          "unitId",
          "stateIdCurrent"
        ]
      },
      cards: {
        model: db.cards
      },
      cardsFamilyMembers: {
        model: db.cardsFamilyMembers
      },
      cardsTracking: {
        model: db.cardsTracking
      }
    };
    if (Object.keys(where.conscriptes).length > 0) {
      include.conscriptes.where = where.conscriptes;
    }
    if (Object.keys(where.cardsFamilyMembers).length > 0) {
      include.cardsFamilyMembers.where = where.cardsFamilyMembers;
    }
    if (Object.keys(where.cards).length > 0) {
      include.cards.where = where.cards;
    }
    if (Object.keys(where.cardsTracking).length > 0) {
      include.cardsTracking.where = where.cardsTracking;
    }
    let conscriptes = await db.conscriptes.findAll({
      where: where.conscriptes,
      attributes: [
        "militaryId",
        "fullName",
        "nationalId",
        "degreeId",
        "unitId",
        "stateIdCurrent"
      ],
      include: [
        {
          model: db.degrees,
          attributes: ["degreeType"],
          required: false
        },
        {
          model: db.units,
          attributes: ["unitText"],
          required: false
        },
        {
          model: db.dutyCurrentStates,
          attributes: ["text"],
          required: false
        },
        {
          ...include.cards,
          include: [{ ...include.cardsTracking }]
        },
        {
          ...include.cardsFamilyMembers
        }
      ]
    });

    let cards = await db.cards.findAll({
      where: where.cards,
      include: [
        {
          ...include.conscriptes
        },
        {
          model: db.cardTypes,
          required: false
        },
        {
          ...include.cardsFamilyMembers
        },
        {
          ...include.cardsTracking
        }
      ]
    });

    let cardsFamilyMembers = await db.cardsFamilyMembers.findAll({
      where: where.cardsFamilyMembers,
      include: [
        {
          model: db.cardsFamilyTypeRel
        },
        {
          model: db.nationalities
        },
        {
          ...include.cards,
          include: [{ ...include.cardsTracking }]
        },
        {
          ...include.conscriptes
        }
      ]
    });
    let parsed = JSON.parse(
      JSON.stringify({ conscriptes, cards, cardsFamilyMembers })
    );
    return parsed;
  } catch (error) {
    return error;
  }
};
