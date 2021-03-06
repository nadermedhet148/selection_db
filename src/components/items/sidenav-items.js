let nozom = function(t) {
    return "sections.12." + t;
  },
  // مدير النظام
  admin = function(t) {
    return "sections.0." + t;
  },
  // التسجيل
  tas = function(t) {
    return "sections.1." + t;
  },
  // الإحتياط
  activities = function(t) {
    return "sections.2." + t;
  },
  // الإنهاء
  notes = function(t) {
    return "sections.3." + t;
  },
  // الهروب
  archived = function(t) {
    return "sections.4." + t;
  },
  // الحاسب
  haseb = function(t) {
    return "section.haseb." + t;
  },
  // البوابة
  stats = function(t) {
    return "sections.stats." + t;
  },
  mic = function(t) {
    return "sections.5." + t;
  },
  db_so = function(t) {
    // Segelat Operations - البوابة
    return "sections.6." + t;
  },
  tc = function(t) {
    // Treatments Cards - البطاقات العلاجية
    return "sections.7." + t;
  },
  moka = function(t) {
    // أرشيف المكاتبات
    return "sections.8." + t;
  },
  dafater = function(t) {
    // دفاتر الافراد
    return "sections.9." + t;
  },
  cards = function(t) {
    //البطايق العلاجيه
    return "sections.10." + t;
  },
  help = function(t) {
    // المساعدة
    return "sections.11." + t;
  },
  selections = function(t) {
    // الانتقاء
    return "sections.13." + t;
  },
  /*
   ! You can't use '12' - because it's for nozom ( see first 2 lines in this file )
  */
  rand_id = () => Math.random(111111111, 999999999),
  seperator = function(i) {
    return { type: "divider", text: `just_a_divider_${i}` };
  },
  items = {
    // Header
    header: [
      // {
      //   type: "single",
      //   icon: "mdi-view-dashboard-outline",
      //   text: admin("dashboard"),
      //   href: "/"
      // },
      {
        type: "single",
        icon: "mdi-earth",
        text: admin("home"),
        href: "/"
      },
      {
        type: "single",
        icon: "mdi-account-group-outline",
        text: tas("soldier_plus"),
        desc: "[ بحث - تعديل - حذف ]",
        href: "/soldiers_plus"
      }
    ],
    // ../Header
    // Footer
    footer: [
      {
        type: "single",
        icon: "mdi-file",
        text: archived("references"),
        href: "/references"
      },
      {
        type: "single",
        icon: "mdi-power",
        text: "logout",
        href: "",
        click: "request_logout"
      }
    ],

    admin: [
      {
        type: "single",
        icon: "mdi-account-group-outline",
        text: admin("edit_users"),
        href: "/edit_users"
      },
      {
        type: "single",
        icon: "mdi-account-group-outline",
        text: admin("edit_stages"),
        href: "/edit_stages"
      },
      {
        type: "single",
        icon: "mdi-account-group-outline",
        text: admin("units"),
        href: "/units"
      }
    ],

    notes: [
      {
        type: "single",
        icon: "mdi-account-outline",
        text: notes("branchNotes"),
        href: "/branchNotes"
      },
      {
        type: "single",
        icon: "mdi-account-outline",
        text: notes("centerNotes"),
        href: "/centerNotes"
      },
      {
        type: "single",
        icon: "mdi-account-outline",
        text: notes("committeNotes"),
        href: "/committeNotes"
      }
    ],
    activities: [
      {
        type: "single",
        icon: "mdi-account-outline",
        text: activities("followed_soldiers"),
        href: "/followed_soldiers"
      },
      {
        type: "single",
        icon: "mdi-account-outline",
        text: activities("delays"),
        href: "/delays"
      },
      {
        type: "single",
        icon: "mdi-account-outline",
        text: activities("safeSoliders"),
        href: "/safeSoliders"
      }
    ],
    archived: [
      {
        type: "single",
        icon: "mdi-account-outline",
        text: archived("stage_soldiers"),
        href: "/stage_soldiers"
      },
      {
        type: "single",
        icon: "mdi-account-outline",
        text: archived("stage_notes"),
        href: "/stage_notes"
      },
      {
        type: "single",
        icon: "mdi-account-outline",
        text: archived("stage_plan"),
        href: "/stage_plan"
      }
    ],
    stats: [
      {
        type: "single",
        icon: "mdi-account-outline",
        text: stats("stage_stats"),
        href: "/stage_stats"
      },
      {
        type: "single",
        icon: "mdi-account-outline",
        text: stats("stage_notes"),
        href: "/stage_notes_stats"
      },
      {
        type: "single",
        icon: "mdi-account-outline",
        text: stats("units"),
        href: "/units"
      }
    ],
    en: [],
    // ../Enhaa
    // ..Horob
    ho: [],
    // ../Horob
    // Gate
    gate: [],

    // cards in_service and out_service
    cards: [],

    // Microfilm
    mic: [],
    db_so: [
      // {
      //   type: "single",
      //   icon: "mdi-television",
      //   text: db_so("main"),
      //   href: "/db_so",
      //   click: "",
      //   onlySegelat: true
      // }
    ],
    tc: [
      // {
      //   type: "group",
      //   icon: "mdi-credit-card-multiple",
      //   text: tc("_self"),
      //   sections: [0, 1, 3],
      //   model: false,
      //   onlySegelat: true,
      //   children: [
      //     {
      //       type: "single",
      //       icon: " ",
      //       text: tc("search"),
      //       sections: [0, 1, 3],
      //       href: "/cards/search/dialogSearch"
      //     }
      //   ]
      // }
    ],
    mokatabat: [
      // {
      //   type: "group",
      //   icon: "mdi-file-document-multiple-outline",
      //   text: moka("mokatabat"),
      //   model: false,
      //   onlySegelat: true,
      //   children: [
      //     {
      //       type: "single",
      //       icon: " ",
      //       text: moka("sader"),
      //       href: "/mokatabat_sader"
      //     },
      //     {
      //       type: "single",
      //       icon: " ",
      //       text: moka("wared"),
      //       href: "/mokatabat_wared"
      //     }
      //   ]
      // }
    ],
    dafater: [
      // {
      //   type: "group",
      //   icon: "mdi-image-album",
      //   text: dafater("dafater"),
      //   model: false,
      //   onlySegelat: true,
      //   children: [
      //     {
      //       type: "single",
      //       icon: " ",
      //       text: dafater("cons"),
      //       href: "/dafater_cons"
      //     },
      //     {
      //       type: "single",
      //       icon: " ",
      //       text: dafater("stats"),
      //       href: "/dafater_stats"
      //     },
      //     {
      //       type: "single",
      //       icon: " ",
      //       text: dafater("view"),
      //       href: "/dafater_view"
      //     }
      //   ]
      // }
    ],
    help: [
      {
        type: "group",
        icon: "mdi-help",
        text: help("_self"),
        model: false,
        onlySegelat: true,
        children: [
          {
            type: "single",
            icon: " ",
            text: help("gate_services"),
            href: "/gate_services"
          },
          {
            type: "single",
            icon: " ",
            text: help("tsgel"),
            href: "/tsgel"
          },
          {
            type: "single",
            icon: " ",
            text: help("anhaa"),
            href: "/anhaa"
          },
          {
            type: "single",
            icon: " ",
            text: help("hasb"),
            href: "/hasb"
          }
        ]
      }
    ]
    // ../Microfilm
    // Ignorants
    // ignorants: [
    //   {
    //     type: "single",
    //     icon: "mdi-account-group",
    //     text: mic("ignorants"),
    //     href: "/ignorants"
    //   }
    // ]
    // ../Ignoratns
  },
  header = [...items.header],
  footer = [
    // ...items.db_so,
    ...items.mic,
    ...items.tc, // Commented to build a new version
    ...items.mokatabat,
    ...items.dafater,
    ...items.gate,
    // ...items.cards,
    // ...items.help,
    ...items.footer
  ],
  _0 = [...items.admin],
  _4 = [...items.archived],
  _5 = [...items.stats],
  _2 = [...items.activities],
  _3 = [...items.notes],
  _12 = [
    // هروب
    ...items.ho
    // {
    //   type: "group",
    //   key: 5,
    //   value: items.mic
    // }
  ];
// _6 = [...items.db_so];
// _5 = [
//   // ميكروفيلم
//   ...items.mic
// ]
export { seperator, header, footer, _0, _12, _5, _2, _3, _4 };
