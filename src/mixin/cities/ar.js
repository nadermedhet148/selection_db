"use strict";

let eg = [
  {
    Name: "القاهرة",
    Governorate: "القاهرة"
  },
  {
    Name: "الإسكندرية",
    Governorate: "الإسكندرية"
  },
  {
    Name: "الجيزة",
    Governorate: "الجيزة"
  },
  {
    Name: "شبرا الخيمة",
    Governorate: "القليوبية"
  },
  {
    Name: "بورسعيد",
    Governorate: "بورسعيد"
  },
  {
    Name: "السويس",
    Governorate: "السويس"
  },
  {
    Name: "المحلة الكبرى",
    Governorate: "الغربية"
  },
  {
    Name: "المنصورة",
    Governorate: "الدقهلية"
  },
  {
    Name: "طنطا",
    Governorate: "الغربية"
  },
  {
    Name: "أسيوط",
    Governorate: "أسيوط"
  },
  {
    Name: "الفيوم",
    Governorate: "الفيوم"
  },
  {
    Name: "الزقازيق",
    Governorate: "الشرقية"
  },
  {
    Name: "الإسماعيلية",
    Governorate: "الإسماعيلية"
  },
  {
    Name: "خيسوس",
    Governorate: "القليوبية"
  },
  {
    Name: "أسوان",
    Governorate: "أسوان"
  },
  {
    Name: "دمنهور",
    Governorate: "البحيرة"
  },
  {
    Name: "المنيا",
    Governorate: "المنيا"
  },
  {
    Name: "دمياط",
    Governorate: "دمياط"
  },
  {
    Name: "الأقصر",
    Governorate: "الأقصر"
  },
  {
    Name: "قنا",
    Governorate: "قنا"
  },
  {
    Name: "بني سويف",
    Governorate: "بني سويف"
  },
  {
    Name: "سوهاج",
    Governorate: "سوهاج"
  },
  {
    Name: "شبين الكوم",
    Governorate: "المنوفية"
  },
  {
    Name: "الغردقة",
    Governorate: "البحر الاحمر"
  },
  {
    Name: "بنها",
    Governorate: "القليوبية"
  },
  {
    Name: "كفر الشيخ",
    Governorate: "كفر الشيخ"
  },
  {
    Name: "ملوي",
    Governorate: "المنيا"
  },
  {
    Name: "العريش",
    Governorate: "شمال سيناء"
  },
  {
    Name: "بلبيس",
    Governorate: "الشرقية"
  },
  {
    Name: "مدينة العاشر من رمضان",
    Governorate: "الشرقية"
  },
  {
    Name: "مرسى مطروح",
    Governorate: "مطروح"
  },
  {
    Name: "ميت غمر",
    Governorate: "الدقهلية"
  },
  {
    Name: "كفر الدوار",
    Governorate: "البحيرة"
  },
  {
    Name: "قليوب",
    Governorate: "القليوبية"
  },
  {
    Name: "دسوق",
    Governorate: "كفر الشيخ"
  },
  {
    Name: "ابو كبير",
    Governorate: "الشرقية"
  },
  {
    Name: "جرجا",
    Governorate: "سوهاج"
  },
  {
    Name: "أخميم",
    Governorate: "سوهاج"
  },
  {
    Name: "جريدة المطرية",
    Governorate: "الدقهلية"
  },
  {
    Name: "إدكو",
    Governorate: "البحيرة"
  },
  {
    Name: "بلقاس",
    Governorate: "الدقهلية"
  },
  {
    Name: "زفتى",
    Governorate: "الغربية"
  },
  {
    Name: "سمالوط",
    Governorate: "المنيا"
  },
  {
    Name: "منوف",
    Governorate: "المنوفية"
  },
  {
    Name: "السنبلاوين",
    Governorate: "الدقهلية"
  },
  {
    Name: "التحتا",
    Governorate: "سوهاج"
  },
  {
    Name: "دفع",
    Governorate: "بني سويف"
  },
  {
    Name: "أشمون",
    Governorate: "المنوفية"
  },
  {
    Name: "منفلوط",
    Governorate: "أسيوط"
  },
  {
    Name: "سنورس",
    Governorate: "الفيوم"
  },
  {
    Name: "بني مزار",
    Governorate: "المنيا"
  },
  {
    Name: "فاقوس",
    Governorate: "الشرقية"
  },
  {
    Name: "طلخا",
    Governorate: "الدقهلية"
  },
  {
    Name: "أرمنت",
    Governorate: "قنا"
  },
  {
    Name: "مغاغة",
    Governorate: "المنيا"
  },
  {
    Name: "المنزلة",
    Governorate: "الدقهلية"
  },
  {
    Name: "ديروط",
    Governorate: "أسيوط"
  },
  {
    Name: "كوم امبو",
    Governorate: "أسوان"
  },
  {
    Name: "كفر الزيات",
    Governorate: "الغربية"
  },
  {
    Name: "ابو تيج",
    Governorate: "أسيوط"
  },
  {
    Name: "قوص",
    Governorate: "أسيوط"
  },
  {
    Name: "إدفو",
    Governorate: "أسوان"
  },
  {
    Name: "رشيد",
    Governorate: "البحيرة"
  },
  {
    Name: "إسنا",
    Governorate: "قنا"
  },
  {
    Name: "دكرنس",
    Governorate: "الدقهلية"
  },
  {
    Name: "أبنوب",
    Governorate: "أسيوط"
  },
  {
    Name: "طعمة",
    Governorate: "سوهاج"
  },
  {
    Name: "بيلا",
    Governorate: "كفر الشيخ"
  },
  {
    Name: "القناطر الخيرية",
    Governorate: "القليوبية"
  },
  {
    Name: "الفشن",
    Governorate: "بني سويف"
  },
  {
    Name: "المنشاة",
    Governorate: "سوهاج"
  },
  {
    Name: "القرين",
    Governorate: "الشرقية"
  },
  {
    Name: "شرم الجمالية",
    Governorate: "الدقهلية"
  },
  {
    Name: "فوا",
    Governorate: "كفر الشيخ"
  },
  {
    Name: "منيا القمح",
    Governorate: "الشرقية"
  },
  {
    Name: "الخارجة",
    Governorate: "الوادي الجديد"
  },
  {
    Name: "قوص",
    Governorate: "قنا"
  },
  {
    Name: "الخانكة",
    Governorate: "القليوبية"
  },
  {
    Name: "ابو قرقاص",
    Governorate: "المنيا"
  },
  {
    Name: "بيبا",
    Governorate: "بني سويف"
  },
  {
    Name: "سمنود",
    Governorate: "الغربية"
  },
  {
    Name: "منية النصر",
    Governorate: "الدقهلية"
  },
  {
    Name: "شبين القناطر",
    Governorate: "القليوبية"
  },
  {
    Name: "إبشواي",
    Governorate: "الفيوم"
  },
  {
    Name: "شربين",
    Governorate: "الدقهلية"
  },
  {
    Name: "ديرب نجم",
    Governorate: "الشرقية"
  },
  {
    Name: "بسيون",
    Governorate: "الغربية"
  },
  {
    Name: "سرس الليان",
    Governorate: "المنوفية"
  },
  {
    Name: "دشنا",
    Governorate: "قنا"
  },
  {
    Name: "الحمول",
    Governorate: "كفر الشيخ"
  },
  {
    Name: "فرشوط",
    Governorate: "قنا"
  },
  {
    Name: "تالا",
    Governorate: "المنوفية"
  },
  {
    Name: "الشهداء",
    Governorate: "المنوفية"
  },
  {
    Name: "طامية",
    Governorate: "الفيوم"
  },
  {
    Name: "مشتول السوق",
    Governorate: "الشرقية"
  },
  {
    Name: "مدينة السادات",
    Governorate: "المنوفية"
  },
  {
    Name: "الغنايم",
    Governorate: "أسيوط"
  },
  {
    Name: "اطسا",
    Governorate: "الفيوم"
  },
  {
    Name: "البلينة",
    Governorate: "سوهاج"
  },
  {
    Name: "حوش عيسى",
    Governorate: "البحيرة"
  },
  {
    Name: "مطاي",
    Governorate: "المنيا"
  },
  {
    Name: "جهينة",
    Governorate: "سوهاج"
  },
  {
    Name: "سيدي سالم",
    Governorate: "كفر الشيخ"
  },
  {
    Name: "نجع حمادي",
    Governorate: "قنا"
  },
  {
    Name: "قويسنا",
    Governorate: "المنوفية"
  },
  {
    Name: "ههيا",
    Governorate: "الشرقية"
  },
  {
    Name: "ابو المطامير",
    Governorate: "البحيرة"
  },
  {
    Name: "العبور",
    Governorate: "القليوبية"
  },
  {
    Name: "البدارى",
    Governorate: "أسيوط"
  },
  {
    Name: "القنايات",
    Governorate: "الشرقية"
  },
  {
    Name: "التل الكبير",
    Governorate: "الإسماعيلية"
  },
  {
    Name: "الدلنجات",
    Governorate: "البحيرة"
  },
  {
    Name: "الحمام",
    Governorate: "مطروح"
  },
  {
    Name: "طوخ",
    Governorate: "القليوبية"
  },
  {
    Name: "الباجور",
    Governorate: "المنوفية"
  },
  {
    Name: "ايتاي البارود",
    Governorate: "البحيرة"
  },
  {
    Name: "دير مواس",
    Governorate: "المنيا"
  },
  {
    Name: "بلطيم",
    Governorate: "كفر الشيخ"
  },
  {
    Name: "ابو حماد",
    Governorate: "الشرقية"
  },
  {
    Name: "ابو حمص",
    Governorate: "البحيرة"
  },
  {
    Name: "نبروة",
    Governorate: "الدقهلية"
  },
  {
    Name: "شرم الشيخ",
    Governorate: "جنوب سيناء"
  },
  {
    Name: "دراو",
    Governorate: "أسوان"
  },
  {
    Name: "المراغة",
    Governorate: "سوهاج"
  },
  {
    Name: "سومستا الوقف",
    Governorate: "بني سويف"
  },
  {
    Name: "الواسطى",
    Governorate: "بني سويف"
  },
  {
    Name: "إهناسيا",
    Governorate: "بني سويف"
  },
  {
    Name: "كوم حمادة",
    Governorate: "البحيرة"
  },
  {
    Name: "القصير",
    Governorate: "البحر الاحمر"
  },
  {
    Name: "قلين",
    Governorate: "كفر الشيخ"
  },
  {
    Name: "بركة السبع",
    Governorate: "المنوفية"
  },
  {
    Name: "سفاجا",
    Governorate: "البحر الاحمر"
  },
  {
    Name: "عزبة البرج",
    Governorate: "دمياط"
  },
  {
    Name: "فارسكور",
    Governorate: "دمياط"
  },
  {
    Name: "الإبراهيمية",
    Governorate: "الشرقية"
  },
  {
    Name: "السنطة",
    Governorate: "الغربية"
  },
  {
    Name: "رأس غريب",
    Governorate: "البحر الاحمر"
  },
  {
    Name: "ساحل سليم",
    Governorate: "أسيوط"
  },
  {
    Name: "دار السلام",
    Governorate: "سوهاج"
  },
  {
    Name: "رفح",
    Governorate: "شمال سيناء"
  },
  {
    Name: "ميت سلسيل",
    Governorate: "الدقهلية"
  },
  {
    Name: "الحسينية",
    Governorate: "الشرقية"
  },
  {
    Name: "كفر البطيخ",
    Governorate: "دمياط"
  },
  {
    Name: "كفر صقر",
    Governorate: "الشرقية"
  },
  {
    Name: "بني عبيد",
    Governorate: "الدقهلية"
  },
  {
    Name: "جريدة القنطرة",
    Governorate: "الإسماعيلية"
  },
  {
    Name: "مطوبس",
    Governorate: "كفر الشيخ"
  },
  {
    Name: "جريدة الرحمانية",
    Governorate: "البحيرة"
  },
  {
    Name: "شبراخيت",
    Governorate: "البحيرة"
  },
  {
    Name: "شرم المحمودية",
    Governorate: "البحيرة"
  },
  {
    Name: "الوقف",
    Governorate: "قنا"
  },
  {
    Name: "مدينة دمياط الجديدة",
    Governorate: "دمياط"
  },
  {
    Name: "قها",
    Governorate: "القليوبية"
  },
  {
    Name: "قطور",
    Governorate: "الغربية"
  },
  {
    Name: "ابو صوير المحطة",
    Governorate: "الإسماعيلية"
  },
  {
    Name: "كفر شكر",
    Governorate: "القليوبية"
  },
  {
    Name: "كفر سعد",
    Governorate: "دمياط"
  },
  {
    Name: "قفط",
    Governorate: "قنا"
  },
  {
    Name: "فايد",
    Governorate: "الإسماعيلية"
  },
  {
    Name: "ساقلتة",
    Governorate: "سوهاج"
  },
  {
    Name: "وادي النطرون",
    Governorate: "البحيرة"
  },
  {
    Name: "نقاده",
    Governorate: "قنا"
  },
  {
    Name: "كما هو وSarw",
    Governorate: "دمياط"
  },
  {
    Name: "اولاد صقر",
    Governorate: "الشرقية"
  },
  {
    Name: "سيدي براني",
    Governorate: "مطروح"
  },
  {
    Name: "البصالية بحري",
    Governorate: "أسوان"
  },
  {
    Name: "بدر",
    Governorate: "البحيرة"
  },
  {
    Name: "صدفا",
    Governorate: "أسيوط"
  },
  {
    Name: "القنطرة الشرقية",
    Governorate: "الإسماعيلية"
  },
  {
    Name: "سورة رودا",
    Governorate: "دمياط"
  },
  {
    Name: "موت",
    Governorate: "الوادي الجديد"
  },
  {
    Name: "الطور",
    Governorate: "جنوب سيناء"
  },
  {
    Name: "الصالحية الجديدة",
    Governorate: "الشرقية"
  },
  {
    Name: "الشيخ زويد",
    Governorate: "شمال سيناء"
  },
  {
    Name: "مدينة الرياض",
    Governorate: "كفر الشيخ"
  },
  {
    Name: "بني سويف الجديدة",
    Governorate: "بني سويف"
  },
  {
    Name: "الآغا",
    Governorate: "الدقهلية"
  },
  {
    Name: "الضبعة",
    Governorate: "مطروح"
  },
  {
    Name: "الزرقاء",
    Governorate: "دمياط"
  },
  {
    Name: "السبيعية غرب",
    Governorate: "أسوان"
  },
  {
    Name: "سيوة",
    Governorate: "مطروح"
  },
  {
    Name: "العدوة",
    Governorate: "المنيا"
  },
  {
    Name: "يوسف الصديق",
    Governorate: "الفيوم"
  },
  {
    Name: "البياضية",
    Governorate: "الأقصر"
  }
];

export default eg;
