import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);
import NProgress from "nprogress";
import "nprogress/nprogress.css";
const mix = require("@/mixin/fun.js");
const routes = [
  {
    path: "*",
    name: "error_404",
    component: mix.fun.loadView("errors/e404"),
    meta: {
      title: "لم يتم العثور على الصفحة المطلوبة",
      ok: true
    }
  },
  {
    path: "/no_tab_error",
    name: "no_tab_error",
    component: mix.fun.loadView("errors/no-tab"),
    meta: {
      title: "صفحة غير محددة",
      ok: true
    }
  },
  {
    path: "/eauth",
    name: "eauth",
    component: mix.fun.loadView("errors/eauth"),
    meta: {
      title: "ليس لديك الصلاحية لعرض هذه الصفحة",
      ok: true
    }
  },
  {
    path: "/",
    name: "home",
    component: mix.fun.loadView("Home"),
    // component: () => import("@/views/Home.vue"),
    meta: {
      title: "الصفحة الرئيسية",
      ok: true
    }
  },
  {
    path: "/home_counters/:section?",
    name: "home_counters",
    component: mix.fun.loadView("Global/Footer/HomeCounters"),
    meta: {
      title: "متابعات القسم",
      ok: true
    }
  },
  {
    path: "/followup",
    name: "followup",
    component: mix.fun.loadView("Global/Footer/Followup"),
    meta: {
      title: "المتابعة",
      ok: true
    }
  },
  {
    path: "/followup_admin",
    name: "followup_admin",
    component: mix.fun.loadView("Admin/Followup"),
    meta: {
      title: "متابعة مدير الفرع",
      ok: true
    }
  },
  {
    path: "/mokatabat_wared",
    name: "mokatabat_wared",
    component: mix.fun.loadView("Global/Footer/Mokatabat/Wared"),
    meta: {
      title: "أرشيف المكاتبات - وارد",
      ok: true
    }
  },
  {
    path: "/mokatabat_sader",
    name: "mokatabat_sader",
    component: mix.fun.loadView("Global/Footer/Mokatabat/Sader"),
    meta: {
      title: "أرشيف المكاتبات - صادر",
      ok: true
    }
  },
  {
    path: "/dafater_management",
    name: "dafater_management",
    component: mix.fun.loadView("Dafater/DafaterManage"),
    meta: {
      title: "ادارة الدفاتر",
      sections: [0, 12],
      ok: true
    }
  },
  {
    path: "/dafater_stats",
    name: "dafater_stats",
    component: mix.fun.loadView("Dafater/DafaterStats"),
    meta: {
      title: "احصائيات / الافراد بالدفاتر",
      ok: true
    }
  },
  {
    path: "/dafater_cons/:imgId?",
    name: "dafater_cons",
    component: mix.fun.loadView("Dafater/DafaterCons"),
    meta: {
      title: "اضافة/ تعديل الافراد بالدفاتر",
      ok: true
    }
  },
  {
    path: "/dafater_view",
    name: "dafater_view",
    component: mix.fun.loadView("Dafater/DafaterView"),
    meta: {
      title: "عرض الدفاتر",
      ok: true
    }
  },
  {
    path: "/dafater_import",
    name: "dafater_import",
    component: mix.fun.loadView("Dafater/Import"),
    meta: {
      sections: [0, 12],
      title: "تصدير الدفاتر",
      ok: true
    }
  },
  {
    path: "/dafater_statistics",
    name: "dafater_statistics",
    component: mix.fun.loadView("Dafater/DafaterStatistics"),
    meta: {
      sections: [0, 12],
      title: "احصاءات الدفاتر",
      ok: true
    }
  },
  {
    path: "/calendar/:id?",
    name: "calendar",
    component: mix.fun.loadView("Global/Footer/Calendar"),
    meta: {
      title: "التقويم",
      ok: true
    }
  },
  {
    path: "/messenger",
    name: "messenger",
    component: mix.fun.loadView("Global/Footer/Messenger"),
    meta: {
      title: "الماسنجر",
      ok: true
    }
  },
  {
    path: "/tasadek",
    name: "tasadek",
    component: mix.fun.loadView("Global/Footer/Tasadek"),
    meta: {
      title: "الإلتماسات",
      ok: true
    }
  },
  {
    path: "/change_log",
    name: "change_log",
    component: mix.fun.loadView("Global/Footer/ChangeLog"),
    meta: {
      title: "حول المنظومة",
      ok: true
    }
  },
  {
    path: "/segelat_website",
    name: "segelat_website",
    component: mix.fun.loadView("Global/Footer/SegelatWebsite"),
    meta: {
      title: "موقع السجلات الإلكتروني",
      ok: true
    }
  },
  {
    path: "/all_microfilm/:advanced_search?",
    name: "all_microfilm",
    component: mix.fun.loadView("Global/Footer/Microfilm"),
    meta: {
      title: "الميكروفيلم",
      ok: true
    }
  },
  // قسم النظم
  {
    path: "/nozom_operations/:section?/:id?",
    name: "nozom_operations",
    component: mix.fun.loadView("Nozom/Operations"),
    meta: {
      title: "العمليات الخاصة بالنظم",
      sections: [0, 12],
      ok: true
    }
  },
  {
    path: "/control_storage",
    name: "control_storage",
    component: mix.fun.loadView("Nozom/ControlStorage"),
    meta: {
      title: "التحكم في وحدة التخزين",
      sections: [0, 12],
      ok: true
    }
  },
  {
    path: "/add_periods",
    name: "add_periods",
    component: mix.fun.loadView("Nozom/add_periods"),
    meta: {
      title: "اضافة مرحلة تجنيدية",
      sections: [0, 12],
      ok: true
    }
  },
  // ../قسم النظم
  // الأدمن
  {
    path: "/admin_operations/:section?/:id?",
    name: "admin_operations",
    component: mix.fun.loadView("Nozom/newOperations"),
    meta: {
      title: "عمليات مدير النظام",
      sections: [0, 12],
      ok: true
    }
  },
  {
    path: "/admin_verifications",
    name: "admin_verifications",
    component: mix.fun.loadView("Admin/Verifications"),
    meta: {
      title: "المراجعة والتصديق",
      sections: [0, 12],
      ok: true
    }
  },
  {
    path: "/website_blacklists",
    name: "websiteBlacklists",
    component: mix.fun.loadView("Admin/WebsiteBlacklists"),
    meta: {
      title: "الروابط المحظورة",
      sections: [0, 12],
      ok: true
    }
  },
  {
    path: "/dafater_report",
    name: "dafater_report",
    component: mix.fun.loadView("Admin/DafaterReport"),
    meta: {
      title: "تقرير الدفاتر",
      sections: [0, 12],
      ok: true
    }
  },
  {
    path: "/s2followup/:ctype?",
    name: "s2followup",
    component: mix.fun.loadView("Admin/S2FolllowUp"),
    meta: {
      title: "متابعة 2 س",
      sections: [0, 12],
      ok: true
    }
  },
  {
    path: "/edit_units",
    name: "edit_units",
    component: mix.fun.loadView("Admin/EditUnits"),
    meta: {
      title: "الوحدات",
      sections: [0, 12],
      ok: true
    }
  },
  {
    path: "/units_passwords",
    name: "edit_units_passwords",
    component: mix.fun.loadView("Admin/EditUnitsPasswords"),
    meta: {
      title: "باسوردات الوحدات",
      sections: [0, 12],
      ok: true
    }
  },
  {
    path: "/edit_users",
    name: "edit_users",
    component: mix.fun.loadView("Admin/EditUsers"),
    meta: {
      title: "المستخدمين",
      sections: [0, 12],
      ok: true
    }
  },
  {
    path: "/admin_stats",
    name: "admin_stats",
    component: mix.fun.loadView("Admin/Stats"),
    meta: {
      title: "احصائات مدير النظام",
      sections: [0, 12],
      ok: true
    }
  },
  {
    path: "/admin_holder/:id?",
    name: "admin_holder",
    component: mix.fun.loadView("Admin/Holder"),
    meta: {
      title: "هولدر رئيس الفرع",
      sections: [0, 12],
      ok: true
    }
  },
  {
    path: "/missed_data_admin",
    name: "missed_data_admin",
    component: mix.fun.loadView("Admin/MissedData"),
    meta: {
      title: "أفراد لهم بيانات ناقصة",
      sections: [0, 12],
      ok: true
    }
  },
  {
    path: "/linked_databases",
    name: "linked_databases",
    component: mix.fun.loadView("Admin/LinkedDatabases"),
    meta: {
      title: "الربط بقواعد بيانات أخرى",
      sections: [0, 12],
      ok: true
    }
  },
  {
    path: "/describe_demob_date",
    name: "describe_demob_date",
    component: mix.fun.loadView("Admin/DescribeDemobDate"),
    meta: {
      title: "تجربة حساب تاريخ التسريح",
      sections: [0, 12, 2],
      ok: true
    }
  },
  {
    path: "/fix_demob_date",
    name: "fix_demob_date",
    component: mix.fun.loadView("Admin/FixDemobDate"),
    meta: {
      title: "تصحيح تاريخ التسريح",
      sections: [0, 12],
      ok: true
    }
  },
  {
    path: "/extract_images",
    name: "extract_images",
    component: mix.fun.loadView("Admin/ExtractImages"),
    meta: {
      title: "استخراج صور الأفراد",
      sections: [0, 12],
      ok: true
    }
  },
  {
    path: "/admin_too_late",
    name: "admin_too_late",
    component: mix.fun.loadView("Admin/TooLate"),
    meta: {
      title: "المتأخرات المجمعة",
      sections: [0, 12],
      ok: true
    }
  },
  {
    path: "/connected_devices",
    name: "connected_devices",
    component: mix.fun.loadView("Admin/ConnectedDevices"),
    meta: {
      title: "الأجهزة المتصلة",
      sections: [0, 12],
      ok: true
    }
  },
  // ../الأدمن
  // قسم التسجيل
  {
    path: "/social_profile/:id?/:section?",
    name: "social_profile",
    component: mix.fun.loadView("Tasgeel/SocialProfile"),
    meta: {
      title: "الملف الشخصي",
      sections: [0, 12, 1, 2, 3, 4],
      ok: true
    }
  },
  {
    path: "/soldiers_plus/:id?/:section?",
    name: "soldiers_plus",
    component: mix.fun.loadView("Tasgeel/SoldiersPlus"),
    meta: {
      title: "الراتب العالي والمجندين",
      sections: [0, 12, 1, 2, 3, 4, 5, 6],
      ok: true
    }
  },
  {
    path: "/penalties",
    name: "penalties",
    component: mix.fun.loadView("Tasgeel/Penalties"),
    meta: {
      title: "العقوبات",
      sections: [0, 12, 1, 2, 3, 4],
      ok: true
    }
  },
  {
    path: "/add_conscripte",
    name: "add_conscripte",
    component: mix.fun.loadView("Tasgeel/AddConscripte"),
    meta: {
      title: "إضافة / تعديل فرد",
      sections: [0, 12, 1, 2, 3, 4],
      ok: true
    }
  },
  {
    path: "/monthly_rev/:section/:unit?",
    name: "monthly_rev",
    component: mix.fun.loadView("Tasgeel/MonthlyRev"),
    meta: {
      title: "المراجعة الشهرية",
      section: [0, 12, 1, 2, 3],
      ok: true
    }
  },
  {
    path: "/bulk_promotion",
    name: "bulk_promotion",
    component: mix.fun.loadView("Tasgeel/BulkPromotion"),
    meta: {
      title: "إعداد مشروع الترقي",
      section: [0, 12, 1],
      ok: true
    }
  },
  {
    path: "/tasgeel_reports",
    name: "tasgeel_reports",
    component: mix.fun.loadView("Tasgeel/Reports"),
    meta: {
      title: "تقارير قسم التسجيل",
      section: [0, 12, 1],
      ok: true
    }
  },
  {
    path: "/too_late/:section",
    name: "too_late",
    component: mix.fun.loadView("Tasgeel/TooLate"),
    meta: {
      title: "المتأخرات",
      section: [0, 12, 1, 2],
      ok: true
    }
  },
  {
    path: "/injuries_isFollowed",
    name: "injuries_isFollowed",
    component: mix.fun.loadView("Tasgeel/injuries_isFollowed"),
    meta: {
      title: "متابعة المصابين",
      section: [0, 12, 1],
      ok: true
    }
  },
  {
    path: "/ignorants/:search?",
    name: "ignorants",
    component: mix.fun.loadView("Tasgeel/Ignorants"),
    meta: {
      title: "محو الأمية",
      section: [0, 12, 1, 2, 3, 4],
      ok: true
    }
  },
  // ../قسم التسجيل
  // قسم الإحتياط
  {
    path: "/e7tyat_files",
    name: "e7tyat_files",
    component: mix.fun.loadView("Admin/E7tyat_Files"),
    meta: {
      title: "دفاتر الإحتياط",
      sections: [0, 12],
      ok: true
    }
  },
  {
    path: "/radeef",
    name: "radeef",
    component: mix.fun.loadView("E7tyat/Radeef"),
    meta: {
      title: "كشف دفعة رديف",
      sections: [0, 12, 2],
      ok: true
    }
  },
  {
    path: "/dof3aStatistics",
    name: "dof3aStatistics",
    component: mix.fun.loadView("E7tyat/Dof3aStatistics"),
    meta: {
      title: "كشف احصائية دفعة",
      sections: [0, 12, 2],
      ok: true
    }
  },
  {
    path: "/report_radeef",
    name: "report_radeef",
    component: mix.fun.loadView("E7tyat/RadeefReport"),
    meta: {
      title: "تقرير دفعة رديف",
      sections: [0, 12, 2],
      ok: true
    }
  },
  {
    path: "/other_edarat_radeef",
    name: "other_edarat_radeef",
    component: mix.fun.loadView("E7tyat/RadeefReportOthers"),
    meta: {
      title: "رديف الإدارات الآخرى",
      sections: [0, 12, 2],
      ok: true
    }
  },
  {
    path: "/late_radeef",
    name: "late_radeef",
    component: mix.fun.loadView("E7tyat/LateRadeef"),
    meta: {
      title: "كشف المتأخرين عن التسريح",
      sections: [0, 12, 2],
      ok: true
    }
  },
  {
    path: "/lates_reserve/:section",
    name: "lates_reserve",
    component: mix.fun.loadView("E7tyat/Lates"),
    meta: {
      title: "المتأخرات",
      sections: [0, 12, 1, 2],
      ok: true
    }
  },
  {
    path: "/following_reserved_injuries",
    name: "following_reserved_injuries",
    component: mix.fun.loadView("E7tyat/FollowingReservedInjuries"),
    meta: {
      title: "مصابي النقل على الإحتياط",
      sections: [0, 12, 2],
      ok: true
    }
  },
  {
    path: "/trained_duty",
    name: "trained_duty",
    component: mix.fun.loadView("E7tyat/TrainedDuty"),
    meta: {
      title: "حصر الواجب المدرب عليه",
      sections: [0, 12, 2],
      ok: true
    }
  },
  // ../قسم الإحتياط
  // قسم الإنهاء
  {
    path: "/kashf_magles_tebby",
    name: "kashf_magles_tebby",
    component: mix.fun.loadView("Enhaa/KashfMaglesTebby"),
    meta: {
      title: "كشف بالعرض على المجلس الطبي",
      section: [0, 12, 1, 3],
      ok: true
    }
  },
  {
    path: "/ended_duty_main_data/:id?",
    name: "ended_duty_main_data",
    component: mix.fun.loadView("Enhaa/EndedDutyMainData"),
    meta: {
      title: "البيانات الأساسية للمنتهي خدمتهم",
      section: [0, 12, 3],
      ok: true
    }
  },
  {
    path: "/search_enhaa/:todo",
    name: "advanced_search_enhaa",
    component: mix.fun.loadView("Enhaa/AdvancedSearchEnhaa"),
    meta: {
      title: "المنتهي خدمتهم",
      section: [0, 12, 3],
      ok: true
    }
  },
  {
    path: "/kashf_40",
    name: "kashf_40",
    component: mix.fun.loadView("Enhaa/Kashf_40"),
    meta: {
      title: "كشف الأربعين",
      section: [0, 12, 3],
      ok: true
    }
  },
  {
    path: "/kashf_bologSen",
    name: "kashf_bologSen",
    component: mix.fun.loadView("Enhaa/Kashf_BologSen"),
    meta: {
      title: "كشف بلوغ السن",
      section: [0, 12, 3],
      ok: true
    }
  },
  {
    path: "/missed_161s",
    name: "missed_161s",
    component: mix.fun.loadView("Enhaa/Missed161s"),
    meta: {
      title: "منتظر الـ 161 س",
      sections: [0, 12, 3],
      ok: true
    }
  },
  {
    path: "/military_orders",
    name: "military_orders",
    component: mix.fun.loadView("Enhaa/MilitaryOrders"),
    meta: {
      title: "نشرة الأوامر العسكرية",
      sections: [0, 12, 3],
      ok: true
    }
  },
  {
    path: "/enhaa_stats",
    name: "enhaa_stats",
    component: mix.fun.loadView("Enhaa/Stats"),
    meta: {
      title: "احصائات بيانية - الإنهاء",
      sections: [0, 12, 3],
      ok: true
    }
  },
  {
    path: "/websites",
    name: "websites",
    component: mix.fun.loadView("Websites/index"),
    meta: {
      title: "الشبكة العسكرية",
      section: [0, 12, 1, 2, 3, 4, 5, 6],
      ok: true
    }
  },

  // ../البوابة
  // استقبال المواطنين
  {
    path: "/db_so/:section?",
    name: "db_so",
    component: mix.fun.loadView("dbs/so/index"),
    meta: {
      title: "استقبال المواطنين",
      sections: [0, 12, 1, 2, 3, 4],
      ok: true
    }
  }
  // ,
  //   {
  //     path: "/tsgel",
  //     name: "tsgel",
  //     component: mix.fun.loadView("Help/Tsgel"),
  //     meta: {
  //       title: "أسئلة التسجيل",
  //       ok: true
  //     }
  //   }
  // ../ البطاقات العلاجية
];

routes.forEach((r, i) => {
  let c = r.component;
  if (!r.meta) {
    r.meta = {};
  }
  r.meta.component = c;
});

const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    return { x: 0, y: 0 };
  },
  routes
});

let appStarted = false;

router.beforeEach((to, from, next) => {
  // NProgress.start();
  // mix.fun.setRouter(to);
  // next();
  console.log(to.fullPath);
  if (!appStarted) {
    appStarted = true;
    if (!to.fullPath.includes("websites")) {
      console.log(to.fullPath);
      next("/");
      //next("cards/profile/1988311034851");
      return;
    }
  }
  if (to && to.meta && to.meta.ok) {
    mix.fun.setRouterObj(to.fullPath, from.fullPath);
    mix.fun.setNewRoute(to);
    if (to.name) {
      NProgress.start();
      if (to.meta.title) {
        document.title = to.meta.title + " - " + mix.vars.app_title;
        mix.fun.commit("setRouterTitle", to.meta.title);
      } else {
        mix.fun.return_defaults();
      }
    } else {
      mix.fun.return_defaults();
    }
    let toNext,
      noAuthPath = "/eauth",
      authPath = "/dashboard",
      indexPath = "/index.html";
    const requiresAuth = to.matched.some(x => x.meta.requiresAuth);
    const requiresNoAuth = to.matched.some(x => x.meta.requiresNoAuth);
    const allowed_sections = to.meta.sections;
    const currentUser = mix.fun.currentUser();
    const user_section = currentUser ? currentUser.section : null;
    if (
      currentUser &&
      allowed_sections &&
      allowed_sections.length > 0 &&
      !allowed_sections.includes(user_section)
    ) {
      toNext = noAuthPath;
    }
    if (from.path == noAuthPath && to.meta.requiresAuth) {
      // Do nothing
    } else if (from.path == authPath && to.meta.requiresNoAuth) {
      // Do nothing
    } else {
      if (requiresAuth && !currentUser) {
        toNext = noAuthPath;
      } else if (requiresNoAuth && currentUser) {
        toNext = authPath;
      } else {
        // Do nothing
      }

      if (to.fullPath == indexPath) {
        toNext = "/";
      }
      next(toNext);
    }
  } else {
    let toSplitter =
        to && to.fullPath
          ? to.fullPath.split("segelat/resources/app.asar")
          : "/",
      customTo = toSplitter[1] ? toSplitter[1] : "/";
    next(customTo);
  }
});
router.afterEach(() => {
  NProgress.done();
});

export default router;