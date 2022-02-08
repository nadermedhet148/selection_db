export default {
  SoldierCategoryMap: [
    { text: "صف", mappedValue: "officer" },
    { text: "كاتب", mappedValue: "writer" },
    { text: "مهني", mappedValue: "professional" },
    { text: "حرفي", mappedValue: "literal" },
    { text: "سائق عجل", mappedValue: "driver" }
  ],
  SoliderLevelsMap: [
    { soldierLevel: "جندي", mappedValue: "Solider", isSolider: true },
    { soldierLevel: "عريف", mappedValue: "SoliderArraf", isSolider: true },
    {
      soldierLevel: "عريف",
      mappedValue: "Arraf",
      optionsQuery: `in (N'عريف' ,N'صـانع عسكرى')`
    },
    {
      soldierLevel: "رقيب",
      mappedValue: "Rkaab",
      optionsQuery: `in (N'رقيب',N'صانع ماهر')`
    },
    {
      soldierLevel: "رقيب أ",
      mappedValue: "RkaabA",
      optionsQuery: `in (N'رقيب أ' , N'صانع دقيق',N'رقيب اول')`
    },
    {
      soldierLevel: "مساعد",
      mappedValue: "Mosaad",
      optionsQuery: `like '%مساعد%' or RatebLevel in ( N'ملاحظ فنى عسكرى' , N'صانع  ممتاز')`
    }
  ],
  displayTypes: {
    headquerts: 0,
    intelligence: 1,
    unites: 3,
    directions: 4,
    headquertsWithUnits: 5
  },
  harsHododId: 52,
  serviceTypes: [
    { text: "راتب عالى", mappedValue: "ratab" },
    { text: "مجند", mappedValue: "soliders" },
    { text: "رع/مجند", mappedValue: "ratebOversolider" }
  ]
};
