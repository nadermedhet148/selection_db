export default {
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
  ]
};
