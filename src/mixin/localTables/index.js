let localTables = [
    "specializations",
    "ignorantSupporters",
    "checkup40",
    "religions",
    "governorates",
    "bloodTypes",
    "parents",
    "qualifications_nonCom",
    "endingDutyStudies",
    "contDuties",
    "demobilizationStudies",
    "medicalSituations",
    "courtConfermations",
    "priorities",
    "endTermReasons",
    "sections"
  ],
  startsFromZero = ["priorities", "endTermReasons"],
  objs = {};
localTables.forEach(table => {
  let data = require(`./${table}`),
    arr = [];
  console.log(data);
  console.log(typeof data[0]);
  if (typeof data[0] == "string") {
    data.forEach((el, i) => {
      if (el && el.length > 0) {
        arr.push({
          id: i + (startsFromZero.includes(table) ? 0 : 1),
          displayedText: el
        });
      }
    });
    objs[table] = arr;
    //console.log(objs);
  } else {
    objs[table] = data;
  }
});

export { objs };
