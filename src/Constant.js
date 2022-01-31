export default {
  recommendationPassword: "qwerty",
  SoldierLevel: {
    text: "text",
    value: "text",
    data: [...["جندي", "عريف", "رقيب", "رقيب اول ", "مساعد ", "مساعد اول"]]
  },
  KnowledgeLevel: {
    text: "text",
    value: "text",
    data: [...["عليا", "فوق متوسطة", "متوسطه", "عادة"].map(text => ({ text }))]
  },
  Religion: {
    text: "text",
    value: "text",
    data: [...["اخري", "مسيحي", "مسلم"].map(text => ({ text }))]
  },
  levelMapping: {
    عليا: "High",
    "فوق متوسطة": "AboveAvg",
    متوسطه: "Avg",
    عادة: "Normal"
  },
  levelMapping: {
    عليا: "High",
    "فوق متوسطة": "AboveAvg",
    متوسطه: "Avg",
    عادة: "Normal"
  },
  levelMappingEn: {
    High: "عليا",
    Avg: "متوسطه",
    Normal: "عادة",
    AboveAvg: "فوق متوسطة"
  },
  RecommendTypes: {
    data: [...["مقترح فعلي", "مقترح اثناء التوزيع"].map(text => ({ text }))]
  },
  RecuTreat: {
    text: "text",
    value: "text",
    data: [
      ...["بدون", "سنة قابلة للرفع", "سنة غير قابلة للرفع"].map(text => ({
        text
      }))
    ]
  },
  SoldierCategory: {
    text: "text",
    value: "text",
    data: [
      ...[
        "صف",
        "كاتب عسكري",
        "كاتب مالي",
        "سائق عجل",
        "مهني ",
        "حرفي"
      ].map(text => ({ text }))
    ]
  },
  BloodType: {
    text: "text",
    value: "text",
    data: [
      ...[
        "A",
        "A+",
        "A-",
        "B",
        "B+",
        "B-",
        "O",
        "O+",
        "O-",
        "AB",
        "AB+",
        "AB-"
      ].map(text => ({ text }))
    ]
  },
  RecuRegion: {
    text: "text",
    value: "text",
    data: [
      ...[
        "القاهرة",
        "الجيزة",
        "الأسكندرية",
        "الزقازيق",
        "أسيوط",
        "طنطا",
        "قنا",
        "المنصورة",
        "المنيا"
      ].map(text => ({ text }))
    ]
  },
  RecuStage: {
    text: "text",
    value: "text",
    data: [
      ...["الاولي", "الثانية", "الثالثة", "الرابعة"].map(text => ({ text }))
    ]
  },
  Certificator: {
    data: [
      "السيد/قائد القوات",
      "السيد /نائب قائد القوات",
      "السيد/ رئيس الاركان",
      "السيد/مساعد رئيس الاركان",
      "السيد/ رئيس شعبةالتنظيم والادارة",
      "السيد/ رئيس فرع الافراد",
      "السيد/ رئيس القسم"
    ].map(text => {
      return { text };
    })
  },

  SoldierStatus: {
    text: "text",
    value: "text",
    data: [
      ...[
        "",
        "محول الى متطوع",
        "ترقى ملازم شرف",
        "نقل على الإحتياط",
        "اعفاء نهائى",
        "اعفاء مؤقت",
        "القبول بالكليات العسكريه",
        "رفت جوازى",
        "رفت وجوبى",
        "عدم الصلاحيه الفنيه",
        "الاستقاله",
        "عدم رغبه فى التجنيد",
        "الوفاه اثناء الخدمه",
        "الوفاه اثناء الغياب",
        "بلوغ السن القانونى",
        "مستجد بالمركز",
        "بالخدمة",
        "رفت طبي",
        "منتهى خدمته",
        "نقل خارج السلاح",
        "امني",
        "هارب",
        "إجراءات إنهاء خدمة"
      ].map(text => ({ text }))
    ]
  },
  College: {
    text: "text",
    value: "text",
    data: [
      ...[
        "فوق متوسطة",
        "متوسطة",
        "عادة",
        "اداب",
        "هندسة",
        "حاسبات ومعلومات",
        "تربية",
        "طب بشري",
        "طب بيطري",
        "طب اسنان",
        "صيدلة",
        "الالسن",
        "خدمة اجتماعيه",
        "جامعة عمالية",
        "حقوق",
        "تجارة",
        "زراعة",
        "شريعة وقانون",
        "دراسات اسلامية",
        "اصول دين",
        "فنون جميلة",
        "فنون تطبيقية",
        "اقتصاد وعلوم سياسية",
        "اعلام",
        "تربية رياضية",
        "علوم",
        "سياحة وفنادق",
        "تربية نوعية",
        "تمريض",
        "تربية موسيقية",
        "تربية فنية",
        "اثار",
        "دار العلوم"
      ].map(text => ({ text }))
    ]
  },
  FollowingRecommender: {
    text: "text",
    value: "text",
    data: [
      ...[
        "",
        "عقيد إيهاب جاهين",
        "عميد احمد نور",
        "فرع الشؤون المعنوية",
        "مذكرة الاستاد",
        "مذكرة الأمن",
        "مذكرة الدار",
        "مذكرة السجلات",
        "مذكرة الفرع المالى",
        "مذكرة الفندق",
        "مذكرة المتابعة",
        "مذكرة المنفذ",
        "مذكرة شعبة الامداد",
        "مذكرة شعبة تنظيم",
        "مذكرة شعبة عمليات",
        "مذكرة فرع الاتصال",
        "مذكرة فرع القضاء",
        "مذكرة فرع النظم",
        "مذكرة ك المقر",
        "مكتب القائد",
        "مكتب رئيس اركان",
        "مكتب نائب القائد"
      ].map(text => ({ text }))
    ]
  },
  FollowingOrder: {
    text: "text",
    value: "text",
    data: [
      ...[
        "",
        "قائد القوات",
        "رئيس الأركان",
        "مكتب القائد",
        "مكتب نائب القائد"
      ].map(text => ({ text }))
    ]
  },
  Direction: {
    text: "text",
    value: "text",
    data: [
      ...[
        "",
        "ج2",
        "ج3",
        "جنوبى",
        "شمالى",
        "غربى",
        "مركزى",
        "مج المخابرات",
        "رئاسة مج مخ والأمن",
        "رئاسة ومكاتب مج مخ البحر الأحمر",
        "رئاسة ومكاتب مج مخ الجنوبى",
        "رئاسة ومكاتب مج مخ الشمالى",
        "رئاسة ومكاتب مج مخ الغربى",
        "رئاسة ومكاتب مج مخ ج2 ",
        "رئاسة ومكاتب مج مخ ج3",
        "قيادات القطاعات",
        "كتائب م م م د",
        "قيادة الفوج 103",
        "قيادة الكتيبة 104"
      ].map(text => ({ text }))
    ]
  },
  years: [
    2019,
    2020,
    2021,
    2022,
    2023,
    2024,
    2025,
    2026,
    2027,
    2028,
    2029,
    2030
  ],
  sections: [
    {
      text: "مدير النظام",
      value: 0
    },
    {
      text: "نظم",
      value: 12
    },
    {
      text: "تسجيل",
      value: 1
    },
    {
      text: "المستجدين",
      value: 2
    }
  ],
  dailesSoliderCategories: ["صف", "كاتب", "سائق عجل", "مهني ", "حرفي"]
};
