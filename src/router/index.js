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
    path: "/distributed_suggest",
    name: "distributed_suggest",
    component: mix.fun.loadView("new_comers/distributed_suggest"),
    meta: {
      title: "مقترح التوزيع",
      ok: true
    }
  },
  {
    path: "/tmam_elwosol",
    name: "tmam_elwosol",
    component: mix.fun.loadView("new_comers/new_comers"),
    meta: {
      title: "تمام الوصول",
      ok: true
    }
  },
  {
    path: "/tmam_eltasgel",
    name: "tmam_eltasgel",
    component: mix.fun.loadView("new_comers/tmam_eltasgel"),
    meta: {
      title: "تمام التسجيل",
      ok: true
    }
  },
  {
    path: "/tmam_eltarhel",
    name: "tmam_eltarhel",
    component: mix.fun.loadView("new_comers/tmam_eltarhel"),
    meta: {
      title: "تمام التسجيل",
      ok: true
    }
  },
  {
    path: "/malaheq_suggest",
    name: "malaheq_suggest",
    component: mix.fun.loadView("new_comers/malaheq_suggest"),
    meta: {
      title: "مقترح الملاحق المرحلة",
      ok: true
    }
  },
  {
    path: "/recommandations",
    name: "recommandations",
    component: mix.fun.loadView("new_comers/recommandations"),
    meta: {
      title: "التوصيات",
      ok: true
    }
  },
  {
    path: "/effects",
    name: "effects",
    component: mix.fun.loadView("new_comers/effects"),
    meta: {
      title: "مؤثرات المرحلة",
      ok: true
    }
  },
  {
    path: "/tmam_elthr7el",
    name: "tmam_elthr7el",
    component: mix.fun.loadView("new_comers/tmam_elthr7el"),
    meta: {
      title: "تمام الترحيل",
      ok: true
    }
  },
  {
    path: "/categories_dailes",
    name: "categories_dailes",
    component: mix.fun.loadView("tasgeel/categories_dailes"),
    meta: {
      title: "اليومية العديدة",
      ok: true
    }
  },
  {
    path: "/SMYearQuarter",
    name: "SMYearQuarter",
    component: mix.fun.loadView("tasgeel/SMYearQuarter"),
    meta: {
      title: "يومية الربع السنوي",
      ok: true
    }
  },
  {
    path: "/360_normal_dailes",
    name: "360_normal_dailes",
    component: mix.fun.loadView("tasgeel/360_normal_dailes"),
    meta: {
      title: "يومية 360 عادة",
      ok: true
    }
  },
  {
    path: "/unit_managment",
    name: "unit_managment",
    component: mix.fun.loadView("salaries/unit_managment"),
    meta: {
      title: "ادارة الواحدات",
      ok: true
    }
  },

  {
    path: "/drivers_support",
    name: "drivers_support",
    component: mix.fun.loadView("salaries/drivers_support"),
    meta: {
      title: "امداد السائقين",
      ok: true
    }
  },
  {
    path: "/360_mokrar_dailes",
    name: "360_mokrar_dailes",
    component: mix.fun.loadView("tasgeel/360_mokrar_dailes"),
    meta: {
      title: "يومية 360 مكرر",
      ok: true
    }
  },
  {
    path: "/dalies",
    name: "dalies",
    component: mix.fun.loadView("new_comers/dalies"),
    meta: {
      title: "اليوميات العديدة",
      ok: true
    }
  },
  {
    path: "/soliders_brothers",
    name: "v",
    component: mix.fun.loadView("new_comers/soliders_brothers"),
    meta: {
      title: "الاشقاء",
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
    path: "/add_conscripte/:id?/:type?",
    name: "add_conscripte",
    component: mix.fun.loadView("tasgeel/AddConscripte"),
    meta: {
      title: "إضافة / تعديل فرد",
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
    path: "/stage_soldiers",
    name: "stage_soldiers",
    component: mix.fun.loadView("archive/stage_soldiers"),
    meta: {
      title: "طباعة المجندين الذين تم اختبارهم بالمرحلة",
      ok: true
    }
  },
  {
    path: "/stage_notes",
    name: "stage_notes",
    component: mix.fun.loadView("archive/stage_notes"),
    meta: {
      title: "طباعة الملحظوين الذين تم اختبارهم بالمرحلة",
      ok: true
    }
  },
  {
    path: "/references",
    name: "references",
    component: mix.fun.loadView("archive/references"),
    meta: {
      title: "المراجع",
      ok: true
    }
  },
  {
    path: "/stage_plan",
    name: "stage_plan",
    component: mix.fun.loadView("archive/stage_plan"),
    meta: {
      title: "طباعة خطة المرحلة",
      ok: true
    }
  },
  {
    path: "/stage_stats",
    name: "stage_stats",
    component: mix.fun.loadView("stats/stage_stats"),
    meta: {
      title: "احصائيات مجندين المرحلة",
      ok: true
    }
  },
  {
    path: "/stage_notes_stats",
    name: "stage_notes_stats",
    component: mix.fun.loadView("stats/stage_notes"),
    meta: {
      title: "احصائيات الملاحظات الخاصة بالمرحلة",
      ok: true
    }
  },
  {
    path: "/dafater_import",
    name: "dafater_import",
    component: mix.fun.loadView("Dafater/Import"),
    meta: {
      title: "تصدير الدفاتر",
      ok: true
    }
  },
  {
    path: "/dafater_statistics",
    name: "dafater_statistics",
    component: mix.fun.loadView("Dafater/DafaterStatistics"),
    meta: {
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
      ok: true
    }
  },
  {
    path: "/control_storage",
    name: "control_storage",
    component: mix.fun.loadView("Nozom/ControlStorage"),
    meta: {
      title: "التحكم في وحدة التخزين",
      ok: true
    }
  },
  {
    path: "/add_periods",
    name: "add_periods",
    component: mix.fun.loadView("Nozom/add_periods"),
    meta: {
      title: "اضافة مرحلة تجنيدية",
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
      ok: true
    }
  },
  {
    path: "/admin_verifications",
    name: "admin_verifications",
    component: mix.fun.loadView("Admin/Verifications"),
    meta: {
      title: "المراجعة والتصديق",
      ok: true
    }
  },
  {
    path: "/website_blacklists",
    name: "websiteBlacklists",
    component: mix.fun.loadView("Admin/WebsiteBlacklists"),
    meta: {
      title: "الروابط المحظورة",
      ok: true
    }
  },
  {
    path: "/dafater_report",
    name: "dafater_report",
    component: mix.fun.loadView("Admin/DafaterReport"),
    meta: {
      title: "تقرير الدفاتر",
      ok: true
    }
  },
  {
    path: "/s2followup/:ctype?",
    name: "s2followup",
    component: mix.fun.loadView("Admin/S2FolllowUp"),
    meta: {
      title: "متابعة 2 س",
      ok: true
    }
  },
  {
    path: "/safeSoliders",
    name: "safeSoliders",
    component: mix.fun.loadView("activites/safeSoliders"),
    meta: {
      title: "تقرير الجنود المستبعدة من البؤر الارهابية",
      ok: true
    }
  },
  {
    path: "/units",
    name: "units",
    component: mix.fun.loadView("Admin/units"),
    meta: {
      title: "الوحدات",
      ok: true
    }
  },
  {
    path: "/units_passwords",
    name: "edit_units_passwords",
    component: mix.fun.loadView("Admin/EditUnitsPasswords"),
    meta: {
      title: "باسوردات الوحدات",
      ok: true
    }
  },
  {
    path: "/edit_users",
    name: "edit_users",
    component: mix.fun.loadView("Admin/EditUsers"),
    meta: {
      title: "المستخدمين",
      ok: true
    }
  },
  {
    path: "/edit_stages",
    name: "edit_stages",
    component: mix.fun.loadView("Admin/EditStages"),
    meta: {
      title: "المراحل",
      ok: true
    }
  },
  {
    path: "/admin_stats",
    name: "admin_stats",
    component: mix.fun.loadView("Admin/Stats"),
    meta: {
      title: "احصائات مدير النظام",
      ok: true
    }
  },
  {
    path: "/years_notes_stats",
    name: "years_notes_stats",
    component: mix.fun.loadView("stats/years_notes_stats"),
    meta: {
      title: "احصائات مقارنة المراحل",
      ok: true
    }
  },
  {
    path: "/admin_holder/:id?",
    name: "admin_holder",
    component: mix.fun.loadView("Admin/Holder"),
    meta: {
      title: "هولدر رئيس الفرع",
      ok: true
    }
  },
  {
    path: "/missed_data_admin",
    name: "missed_data_admin",
    component: mix.fun.loadView("Admin/MissedData"),
    meta: {
      title: "أفراد لهم بيانات ناقصة",
      ok: true
    }
  },
  {
    path: "/linked_databases",
    name: "linked_databases",
    component: mix.fun.loadView("Admin/LinkedDatabases"),
    meta: {
      title: "الربط بقواعد بيانات أخرى",
      ok: true
    }
  },
  {
    path: "/describe_demob_date",
    name: "describe_demob_date",
    component: mix.fun.loadView("Admin/DescribeDemobDate"),
    meta: {
      title: "تجربة حساب تاريخ التسريح",
      ok: true
    }
  },
  {
    path: "/fix_demob_date",
    name: "fix_demob_date",
    component: mix.fun.loadView("Admin/FixDemobDate"),
    meta: {
      title: "تصحيح تاريخ التسريح",
      ok: true
    }
  },
  {
    path: "/extract_images",
    name: "extract_images",
    component: mix.fun.loadView("Admin/ExtractImages"),
    meta: {
      title: "استخراج صور الأفراد",
      ok: true
    }
  },
  {
    path: "/admin_too_late",
    name: "admin_too_late",
    component: mix.fun.loadView("Admin/TooLate"),
    meta: {
      title: "المتأخرات المجمعة",
      ok: true
    }
  },
  {
    path: "/connected_devices",
    name: "connected_devices",
    component: mix.fun.loadView("Admin/ConnectedDevices"),
    meta: {
      title: "الأجهزة المتصلة",
      ok: true
    }
  },
  // ../الأدمن
  // قسم التسجيل
  {
    path: "/social_profile/:id?/:section?",
    name: "social_profile",
    component: mix.fun.loadView("tasgeel/SocialProfile"),
    meta: {
      title: "الملف الشخصي",
      ok: true
    }
  },
  {
    path: "/soldiers_plus/:id?/:section?",
    name: "soldiers_plus",
    component: mix.fun.loadView("tasgeel/SoldiersPlus"),
    meta: {
      title: "المجندين",
      ok: true
    }
  },

  {
    path: "/buck_conscript",
    name: "buck_conscript",
    component: mix.fun.loadView("tasgeel/buck_conscript"),
    meta: {
      title: "رفع الملف",
      ok: true
    }
  },
  {
    path: "/branchNotes",
    name: "branchNotes",
    component: mix.fun.loadView("Notes/branch_notes"),
    meta: {
      title: "ملاحظات معمل الانتقاء والتوجيه ",
      ok: true
    }
  },
  {
    path: "/centerNotes",
    name: "centerNotes",
    component: mix.fun.loadView("Notes/center_notes"),
    meta: {
      title: "ملاحظات مركز الانتقاء",
      ok: true
    }
  },
  {
    path: "/committeNotes",
    name: "committeNotes",
    component: mix.fun.loadView("Notes/committe_notes"),
    meta: {
      title: "ملاحظات اللجنة النفسية",
      ok: true
    }
  },
  {
    path: "/followed_soldiers",
    name: "followed_soldiers",
    component: mix.fun.loadView("activites/followed_soldiers"),
    meta: {
      title: "متابعة الجنود",
      ok: true
    }
  },
  {
    path: "/delays",
    name: "delays",
    component: mix.fun.loadView("activites/delays"),
    meta: {
      title: "المتأخرات",
      ok: true
    }
  }
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
