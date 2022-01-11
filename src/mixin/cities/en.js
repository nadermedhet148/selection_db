"use strict";
let eg = [
  {
    Name: "Cairo",
    Governorate: "Cairo"
  },
  {
    Name: "Alexandria",
    Governorate: "Alexandria"
  },
  {
    Name: "Giza",
    Governorate: "Giza"
  },
  {
    Name: "Shubra el-Khema",
    Governorate: "Qalyubia"
  },
  {
    Name: "Port Said",
    Governorate: "Port Said"
  },
  {
    Name: "Suez",
    Governorate: "Suez"
  },
  {
    Name: "El Mahalla el Kubra",
    Governorate: "Gharbia"
  },
  {
    Name: "El Mansoura",
    Governorate: "Dakahlia"
  },
  {
    Name: "Tanta",
    Governorate: "Gharbia"
  },
  {
    Name: "Asyut",
    Governorate: "Asyut"
  },
  {
    Name: "Fayoum",
    Governorate: "Fayoum"
  },
  {
    Name: "Zagazig",
    Governorate: "Sharqia"
  },
  {
    Name: "Ismailia",
    Governorate: "Ismailia"
  },
  {
    Name: "Khusus",
    Governorate: "Qalyubia"
  },
  {
    Name: "Aswan",
    Governorate: "Aswan"
  },
  {
    Name: "Damanhur",
    Governorate: "Beheira"
  },
  {
    Name: "El-Minya",
    Governorate: "Minya"
  },
  {
    Name: "Damietta",
    Governorate: "Damietta"
  },
  {
    Name: "Luxor",
    Governorate: "Luxor"
  },
  {
    Name: "Qena",
    Governorate: "Qena"
  },
  {
    Name: "Beni Suef",
    Governorate: "Beni Suef"
  },
  {
    Name: "Sohag",
    Governorate: "Sohag"
  },
  {
    Name: "Shibin el-Kom",
    Governorate: "Monufia"
  },
  {
    Name: "Hurghada",
    Governorate: "Red Sea"
  },
  {
    Name: "Banha",
    Governorate: "Qalyubia"
  },
  {
    Name: "Kafr al-Sheikh",
    Governorate: "Kafr el-Sheikh"
  },
  {
    Name: "Mallawi",
    Governorate: "Minya"
  },
  {
    Name: "El Arish",
    Governorate: "North Sinai"
  },
  {
    Name: "Belbeis",
    Governorate: "Sharqia"
  },
  {
    Name: "10th of Ramadan City",
    Governorate: "Sharqia"
  },
  {
    Name: "Marsa Matruh",
    Governorate: "Matruh"
  },
  {
    Name: "Mit Ghamr",
    Governorate: "Dakahlia"
  },
  {
    Name: "Kafr el-Dawwar",
    Governorate: "Beheira"
  },
  {
    Name: "Qalyub",
    Governorate: "Qalyubia"
  },
  {
    Name: "Desouk",
    Governorate: "Kafr el-Sheikh"
  },
  {
    Name: "Abu Kabir",
    Governorate: "Sharqia"
  },
  {
    Name: "Girga",
    Governorate: "Sohag"
  },
  {
    Name: "Akhmim",
    Governorate: "Sohag"
  },
  {
    Name: "El-Matareya",
    Governorate: "Dakahlia"
  },
  {
    Name: "Edko",
    Governorate: "Beheira"
  },
  {
    Name: "Bilqas",
    Governorate: "Dakahlia"
  },
  {
    Name: "Zifta",
    Governorate: "Gharbia"
  },
  {
    Name: "Samalut",
    Governorate: "Minya"
  },
  {
    Name: "Menouf",
    Governorate: "Monufia"
  },
  {
    Name: "Senbellawein",
    Governorate: "Dakahlia"
  },
  {
    Name: "Tahta",
    Governorate: "Sohag"
  },
  {
    Name: "Bush",
    Governorate: "Beni Suef"
  },
  {
    Name: "Ashmoun",
    Governorate: "Monufia"
  },
  {
    Name: "Manfalut",
    Governorate: "Asyut"
  },
  {
    Name: "Senuris",
    Governorate: "Fayoum"
  },
  {
    Name: "Beni Mazar",
    Governorate: "Minya"
  },
  {
    Name: "Faqous",
    Governorate: "Sharqia"
  },
  {
    Name: "Talkha",
    Governorate: "Dakahlia"
  },
  {
    Name: "Armant",
    Governorate: "Qena"
  },
  {
    Name: "Maghagha",
    Governorate: "Minya"
  },
  {
    Name: "Manzala",
    Governorate: "Dakahlia"
  },
  {
    Name: "Dairut",
    Governorate: "Asyut"
  },
  {
    Name: "Kom Ombo",
    Governorate: "Aswan"
  },
  {
    Name: "Kafr al-Zayat",
    Governorate: "Gharbia"
  },
  {
    Name: "Abu Tig",
    Governorate: "Asyut"
  },
  {
    Name: "Qis",
    Governorate: "Asyut"
  },
  {
    Name: "Edfu",
    Governorate: "Aswan"
  },
  {
    Name: "Rosetta",
    Governorate: "Beheira"
  },
  {
    Name: "Esna",
    Governorate: "Qena"
  },
  {
    Name: "Dikirnis",
    Governorate: "Dakahlia"
  },
  {
    Name: "Abnub",
    Governorate: "Asyut"
  },
  {
    Name: "Tima",
    Governorate: "Sohag"
  },
  {
    Name: "Beila",
    Governorate: "Kafr el-Sheikh"
  },
  {
    Name: "El-Kanater al-Khiria",
    Governorate: "Qalyubia"
  },
  {
    Name: "Al-Fashn",
    Governorate: "Beni Suef"
  },
  {
    Name: "Al-Mansha",
    Governorate: "Sohag"
  },
  {
    Name: "Al-Kareen",
    Governorate: "Sharqia"
  },
  {
    Name: "El-Gamalia",
    Governorate: "Dakahlia"
  },
  {
    Name: "Fuwa",
    Governorate: "Kafr el-Sheikh"
  },
  {
    Name: "Minya al-Qamh",
    Governorate: "Sharqia"
  },
  {
    Name: "Kharga",
    Governorate: "New Valley"
  },
  {
    Name: "Qus",
    Governorate: "Qena"
  },
  {
    Name: "Khanka",
    Governorate: "Qalyubia"
  },
  {
    Name: "Abu Qirqas",
    Governorate: "Minya"
  },
  {
    Name: "Biba",
    Governorate: "Beni Suef"
  },
  {
    Name: "Samannoud",
    Governorate: "Gharbia"
  },
  {
    Name: "Minyet al-Nasr",
    Governorate: "Dakahlia"
  },
  {
    Name: "Shibin al-Qanater",
    Governorate: "Qalyubia"
  },
  {
    Name: "Ibshawai",
    Governorate: "Fayoum"
  },
  {
    Name: "Sherbin",
    Governorate: "Dakahlia"
  },
  {
    Name: "Drib Nigm",
    Governorate: "Sharqia"
  },
  {
    Name: "Basyoun",
    Governorate: "Gharbia"
  },
  {
    Name: "Sers el-Lyan",
    Governorate: "Monufia"
  },
  {
    Name: "Dishna",
    Governorate: "Qena"
  },
  {
    Name: "Al-Hamool",
    Governorate: "Kafr el-Sheikh"
  },
  {
    Name: "Farshut",
    Governorate: "Qena"
  },
  {
    Name: "Tala",
    Governorate: "Monufia"
  },
  {
    Name: "Ash-Shuhada",
    Governorate: "Monufia"
  },
  {
    Name: "Tamiya",
    Governorate: "Fayoum"
  },
  {
    Name: "Mashtul el-Sook",
    Governorate: "Sharqia"
  },
  {
    Name: "Sadat City",
    Governorate: "Monufia"
  },
  {
    Name: "El-Ghanayem",
    Governorate: "Asyut"
  },
  {
    Name: "Itsa",
    Governorate: "Fayoum"
  },
  {
    Name: "Al-Baliyana",
    Governorate: "Sohag"
  },
  {
    Name: "Hosh Issa",
    Governorate: "Beheira"
  },
  {
    Name: "Matai",
    Governorate: "Minya"
  },
  {
    Name: "Juhayna",
    Governorate: "Sohag"
  },
  {
    Name: "Sidi Salem",
    Governorate: "Kafr el-Sheikh"
  },
  {
    Name: "Naj Hammadi",
    Governorate: "Qena"
  },
  {
    Name: "Quesna",
    Governorate: "Monufia"
  },
  {
    Name: "Hehya",
    Governorate: "Sharqia"
  },
  {
    Name: "Abul Matamir",
    Governorate: "Beheira"
  },
  {
    Name: "El Ubour",
    Governorate: "Qalyubia"
  },
  {
    Name: "El-Badari",
    Governorate: "Asyut"
  },
  {
    Name: "Al-Kanayat",
    Governorate: "Sharqia"
  },
  {
    Name: "At-Tall al-Kabir",
    Governorate: "Ismailia"
  },
  {
    Name: "El-Delengat",
    Governorate: "Beheira"
  },
  {
    Name: "Al-Hammam",
    Governorate: "Matruh"
  },
  {
    Name: "Tukh",
    Governorate: "Qalyubia"
  },
  {
    Name: "Bagour",
    Governorate: "Monufia"
  },
  {
    Name: "Etay el-Barud",
    Governorate: "Beheira"
  },
  {
    Name: "Deir Mawas",
    Governorate: "Minya"
  },
  {
    Name: "Baltim",
    Governorate: "Kafr el-Sheikh"
  },
  {
    Name: "Abu Hammad",
    Governorate: "Sharqia"
  },
  {
    Name: "Abu Hummus",
    Governorate: "Beheira"
  },
  {
    Name: "Nabaroh",
    Governorate: "Dakahlia"
  },
  {
    Name: "Sharm el-Sheikh",
    Governorate: "South Sinai"
  },
  {
    Name: "Daraw",
    Governorate: "Aswan"
  },
  {
    Name: "Al-Maragha",
    Governorate: "Sohag"
  },
  {
    Name: "Sumusta al-Waqf",
    Governorate: "Beni Suef"
  },
  {
    Name: "Al-Wasta",
    Governorate: "Beni Suef"
  },
  {
    Name: "Ihnasiya",
    Governorate: "Beni Suef"
  },
  {
    Name: "Kom Hamadah",
    Governorate: "Beheira"
  },
  {
    Name: "Al-Quseir",
    Governorate: "Red Sea"
  },
  {
    Name: "Qallin",
    Governorate: "Kafr el-Sheikh"
  },
  {
    Name: "Birkat al-Sab",
    Governorate: "Monufia"
  },
  {
    Name: "Safaga",
    Governorate: "Red Sea"
  },
  {
    Name: "Ezbet el-Borg",
    Governorate: "Damietta"
  },
  {
    Name: "Faraskur",
    Governorate: "Damietta"
  },
  {
    Name: "Al-Ibrahimiya",
    Governorate: "Sharqia"
  },
  {
    Name: "El-Santa",
    Governorate: "Gharbia"
  },
  {
    Name: "Ras Gharib",
    Governorate: "Red Sea"
  },
  {
    Name: "Sahel Selim",
    Governorate: "Asyut"
  },
  {
    Name: "Dar as-Salam",
    Governorate: "Sohag"
  },
  {
    Name: "Rafah",
    Governorate: "North Sinai"
  },
  {
    Name: "Mit Salsil",
    Governorate: "Dakahlia"
  },
  {
    Name: "Al-Husseinieh",
    Governorate: "Sharqia"
  },
  {
    Name: "Kafr el-Batikh",
    Governorate: "Damietta"
  },
  {
    Name: "Kafr Saqr",
    Governorate: "Sharqia"
  },
  {
    Name: "Bani Ubayd",
    Governorate: "Dakahlia"
  },
  {
    Name: "El-Qantara",
    Governorate: "Ismailia"
  },
  {
    Name: "Metoubes",
    Governorate: "Kafr el-Sheikh"
  },
  {
    Name: "El-Rahmaniyah",
    Governorate: "Beheira"
  },
  {
    Name: "Shubrakhit",
    Governorate: "Beheira"
  },
  {
    Name: "El-Mahmoudiyah",
    Governorate: "Beheira"
  },
  {
    Name: "Al-Waqf",
    Governorate: "Qena"
  },
  {
    Name: "New Damietta City",
    Governorate: "Damietta"
  },
  {
    Name: "Qaha",
    Governorate: "Qalyubia"
  },
  {
    Name: "Kotoor",
    Governorate: "Gharbia"
  },
  {
    Name: "Abu Suweir-el-Mahatta",
    Governorate: "Ismailia"
  },
  {
    Name: "Kafr Shukr",
    Governorate: "Qalyubia"
  },
  {
    Name: "Kafr Saad",
    Governorate: "Damietta"
  },
  {
    Name: "Qift",
    Governorate: "Qena"
  },
  {
    Name: "Fayed",
    Governorate: "Ismailia"
  },
  {
    Name: "Saqultah",
    Governorate: "Sohag"
  },
  {
    Name: "Wadi al-Natrun",
    Governorate: "Beheira"
  },
  {
    Name: "Naqadah",
    Governorate: "Qena"
  },
  {
    Name: "As-Sarw",
    Governorate: "Damietta"
  },
  {
    Name: "Awlad Saqr",
    Governorate: "Sharqia"
  },
  {
    Name: "Sidi Barrani",
    Governorate: "Matruh"
  },
  {
    Name: "Al-Basaliyah Bahri",
    Governorate: "Aswan"
  },
  {
    Name: "Badr",
    Governorate: "Beheira"
  },
  {
    Name: "Sedfa",
    Governorate: "Asyut"
  },
  {
    Name: "El-Qantara ash-Sharqiya",
    Governorate: "Ismailia"
  },
  {
    Name: "Ar-Ruda",
    Governorate: "Damietta"
  },
  {
    Name: "Mut",
    Governorate: "New Valley"
  },
  {
    Name: "Al-Tur",
    Governorate: "South Sinai"
  },
  {
    Name: "New Salhia",
    Governorate: "Sharqia"
  },
  {
    Name: "Ash-Shaykh Zawid",
    Governorate: "North Sinai"
  },
  {
    Name: "Riyadh",
    Governorate: "Kafr el-Sheikh"
  },
  {
    Name: "New Beni Suef",
    Governorate: "Beni Suef"
  },
  {
    Name: "Aga",
    Governorate: "Dakahlia"
  },
  {
    Name: "Ad-Dabah",
    Governorate: "Matruh"
  },
  {
    Name: "Al-Zarqa",
    Governorate: "Damietta"
  },
  {
    Name: "As-Sibaiyah Gharb",
    Governorate: "Aswan"
  },
  {
    Name: "Siwa",
    Governorate: "Matruh"
  },
  {
    Name: "El-Idwa",
    Governorate: "Minya"
  },
  {
    Name: "Yusuf as-Siddiq",
    Governorate: "Fayoum"
  },
  {
    Name: "Al-Bayadiyah",
    Governorate: "Luxor"
  }
];

export default eg;
