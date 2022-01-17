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
  new_comers = function(t) {
    return "sections.2." + t;
  },
  // الإنهاء
  en = function(t) {
    return "sections.3." + t;
  },
  // الهروب
  ho = function(t) {
    return "sections.4." + t;
  },
  // الحاسب
  haseb = function(t) {
    return "section.haseb." + t;
  },
  // البوابة
  gate = function(t) {
    return "sections.gate." + t;
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
      // {
      //   type: "single",
      //   icon: "mdi-web",
      //   text: "websites",
      //   href: "/websites",
      //   targetBlank: true,
      //   onlySegelat: true
      // },
      // {
      //   type: "single",
      //   icon: "mdi-eye-outline",
      //   text: "followup",
      //   href: "/followup",
      //   onlySegelat: true
      // },
      // // {
      // //   type: "single",
      // //   icon: "mdi-file-document-multiple",
      // //   text: "new_comerstyat_docs",
      // //   href: "/new_comerstyat_docs"
      // // },
      // {
      //   type: "single",
      //   icon: "mdi-collage",
      //   text: "tasadek",
      //   href: "/tasadek",
      //   onlySegelat: true
      // },
      // {
      //   type: "single",
      //   icon: "mdi-calendar",
      //   text: "calendar",
      //   desc: "مفكرة لمهام الأقسام",
      //   href: "/calendar"
      // },
      // {
      //   type: "single",
      //   icon: "mdi-facebook-messenger",
      //   text: "messenger",
      //   href: "/messenger",
      //   onlySegelat: true
      // },
      // {
      //   type: "single",
      //   icon: "mdi-dresser-outline",
      //   text: "change_log",
      //   href: "/change_log"
      // },
      {
        type: "single",
        icon: "mdi-power",
        text: "logout",
        href: "",
        click: "request_logout"
      }
    ],
    // ../Footer
    // Nozom
    nozom: [
      {
        type: "group",
        icon: "mdi-code-json",
        text: nozom("_self"),
        model: false,
        onlySegelat: true,
        children: [
          // {
          //   type: "single",
          //   icon: "mdi-block-helper",
          //   text: admin("website_blacklists"),
          //   href: "/website_blacklists"
          // },
          {
            type: "single",
            icon: "mdi-view-dashboard-outline",
            text: admin("operations"),
            href: "/admin_operations"
          }
          // {
          //   type: "single",
          //   icon: "mdi-view-dashboard-variant",
          //   text: admin("edit_units"),
          //   href: "/edit_units"
          // },
          // {
          //   type: "single",
          //   icon: "mdi-lock-alert",
          //   text: admin("edit_units_passwords"),
          //   href: "/units_passwords"
          // },
          // {
          //   type: "single",
          //   icon: " ",
          //   text: nozom("describe_demob_date"),
          //   href: "/describe_demob_date"
          // },
          // {
          //   type: "single",
          //   icon: " ",
          //   text: nozom("fix_demob_date"),
          //   href: "/fix_demob_date"
          // },
          // {
          //   type: "single",
          //   icon: " ",
          //   text: nozom("extract_images"),
          //   href: "/extract_images",
          //   onlySegelat: true
          // },
          // {
          //   type: "single",
          //   icon: "mdi-view-dashboard-outline",
          //   text: nozom("operations"),
          //   href: "/nozom_operations"
          // },
          // // {
          // //   type: "single",
          // //   icon: "mdi-view-dashboard-outline",
          // //   text: nozom("control_storage"),
          // //   href: "/control_storage"
          // // },
          // {
          //   type: "single",
          //   icon: " ",
          //   text: dafater("manage"),
          //   href: "/dafater_management",
          //   onlySegelat: true
          // },
          // {
          //   type: "single",
          //   icon: " ",
          //   text: dafater("import"),
          //   sections: [0, 12],
          //   href: "/dafater_import",
          //   onlySegelat: true
          // },
          // {
          //   type: "single",
          //   icon: " ",
          //   sections: [0],
          //   text: dafater("stats"),
          //   href: "/dafater_statistics",
          //   onlySegelat: true
          // },
          // {
          //   type: "single",
          //   icon: " ",
          //   text: nozom("add_periods"),
          //   href: "/add_periods",
          //   onlySegelat: true
          // }
        ]
      }
    ],
    // admin
    admin: [
      {
        type: "single",
        icon: " ",
        text: admin("connected_devices"),
        href: "/connected_devices",
        onlySegelat: true
      },
      // {
      //   type: "single",
      //   icon: " ",
      //   text: admin("followup_admin"),
      //   href: "/followup_admin",
      //   onlySegelat: true
      // },
      // {
      //   type: "single",
      //   icon: "mdi-check-bold",
      //   text: admin("verifications"),
      //   href: "/admin_verifications"
      // },
      // {
      //   type: "single",
      //   icon: "mdi-check-bold",
      //   text: admin("dafaterReport"),
      //   href: "/dafater_report",
      //   onlySegelat: true
      // },
      // {
      //   type: "single",
      //   icon: "mdi-eye",
      //   text: admin("s2followup"),
      //   href: "/s2followup",
      //   onlySegelat: true
      // },
      {
        type: "single",
        icon: "mdi-account-group-outline",
        text: admin("edit_users"),
        href: "/edit_users"
      }
      // {
      //   type: "single",
      //   icon: "mdi-chart-line",
      //   text: admin("admin_stats"),
      //   href: "/admin_stats"
      // },
      // {
      //   type: "single",
      //   icon: "mdi-book-open-variant",
      //   text: admin("admin_holder"),
      //   href: "/admin_holder/",
      //   onlySegelat: true
      // }
      // {
      //   type: "single",
      //   icon: "mdi-file-document",
      //   text: new_comers("new_comerstyat_files"),
      //   href: "/new_comerstyat_files"
      // }
      // {
      //   type: "single",
      //   icon: "mdi-file-document",
      //   text: admin("missed_data"),
      //   href: "/missed_data_admin"
      // }
      // {
      //   type: "single",
      //   icon: "mdi-tournament",
      //   text: admin("linked_databases"),
      //   href: "/linked_databases"
      // },
      // {
      //   type: "single",
      //   icon: " ",
      //   text: admin("admin_too_late"),
      //   href: "/admin_too_late",
      //   text: admin("describe_demob_date"),
      //   href: "/describe_demob_date"
      // },
      // {
      //   type: "single",
      //   icon: " ",
      //   text: admin("fix_demob_date"),
      //   href: "/fix_demob_date"
      // },
      // {
      //   type: "single",
      //   icon: " ",
      //   text: admin("extract_images"),
      //   href: "/extract_images"
      // },
    ],
    // ../admin
    // Tasgeel
    tas: [
      // {
      //   type: "single",
      //   icon: "mdi-account-outline",
      //   text: tas("new_profile"),
      //   href: "/new_profile"
      // },
      // {
      //   type: "single",
      //   icon: "mdi-account-group",
      //   text: mic("ignorants"),
      //   href: "/ignorants"
      // },
      {
        type: "single",
        icon: "mdi-update",
        text: tas("monthly_rev"),
        href: "/monthly_rev/1",
        onlySegelat: true
      }
      // {
      //   type: "single",
      //   icon: "mdi-hospital-box-outline",
      //   text: tas("injuries"),
      //   href: "/soldiers_plus/advanced_search/injuries"
      // },
      // {
      //   type: "single",
      //   icon: "mdi-apple-keyboard-caps",
      //   text: tas("promotion"),
      //   href: "/bulk_promotion",
      //   onlySegelat: true
      // },
      // {
      //   type: "single",
      //   icon: "mdi-file-table-box-multiple-outline",
      //   text: tas("reports"),
      //   href: "/tasgeel_reports"
      // },
      // {
      //   type: "single",
      //   icon: "mdi-newspaper-variant-multiple-outline",
      //   text: tas("too_late"),
      //   href: "/too_late/1",
      //   onlySegelat: true
      // },
      // {
      //   type: "single",
      //   icon: "mdi-newspaper-variant-multiple-outline",
      //   text: tas("injuries_isFollowed"),
      //   href: "/injuries_isFollowed",
      //   onlySegelat: true
      // },
      // {
      //   type: "single",
      //   icon: "mdi-account-group",
      //   text: tas("penalties"),
      //   href: "/penalties"
      // },
      // {
      //   type: "single",
      //   icon: "mdi-doctor",
      //   text: tas("kashf_magles_tebby"),
      //   href: "/kashf_magles_tebby",
      //   onlySegelat: true
      // }
    ],
    // ../Tasgeel
    // new_comerstyat
    new_comers: [
      {
        type: "single",
        icon: "mdi-update",
        text: new_comers("tmam_elwosol"),
        href: "/tmam_elwosol",
        onlySegelat: true
      },
      {
        type: "single",
        icon: "mdi-update",
        text: new_comers("tmam_eltasgel"),
        href: "/tmam_eltasgel",
        onlySegelat: true
      },
      {
        type: "single",
        icon: "mdi-update",
        text: new_comers("distributed_suggest"),
        href: "/distributed_suggest",
        onlySegelat: true
      },
      {
        type: "single",
        icon: "mdi-update",
        text: new_comers("Recommandations"),
        href: "/Recommandations",
        onlySegelat: true
      },
      {
        type: "single",
        icon: "mdi-update",
        text: new_comers("effects"),
        href: "/effects",
        onlySegelat: true
      }
    ],
    // ../new_comerstyat
    // ..Enhaa
    en: [],
    // ../Enhaa
    // ..Horob
    ho: [],
    // ../Horob
    // Gate
    gate: [],
    // calendar: [
    //   {
    //     type: "group",
    //     icon: "mdi-calendar",
    //     text: "calendar",
    //     model: false,
    //     children: [
    //       {
    //         type: "single",
    //         icon: " ",
    //         text: "calendar_holiday",
    //         href: "/calendar_holiday"
    //       },
    //       {
    //         type: "single",
    //         icon: " ",
    //         text: "calendar_notifier",
    //         href: "/calendar_notifier"
    //       }
    //     ]
    //   }
    // ],
    // ../Gate

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
  _12 = [...items.nozom],
  _1 = [
    // قسم التسجيل
    ...items.tas
  ],
  _2 = [
    // احتياط
    ...items.new_comers
  ],
  _3 = [
    // انهاء
    ...items.en
  ],
  _4 = [
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
export { seperator, header, footer, _0, _12, _1, _2, _3, _4 };
