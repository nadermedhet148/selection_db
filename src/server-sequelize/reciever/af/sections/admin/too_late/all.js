module.exports = async (db, params) => {
  if (params.conscriptionDateFrom) {
    let cdf = new Date(params.conscriptionDateFrom);
    params.conscriptionDateFrom = new Date(cdf.setDate(cdf.getDate() - 5));
  }
  if (params.conscriptionDateTo) {
    let cdt = new Date(params.conscriptionDateTo);
    params.conscriptionDateTo = new Date(cdt.setDate(cdt.getDate() + 5));
  }
  if (params.demobilizationDateFrom) {
    let ddf = new Date(params.demobilizationDateFrom);
    params.demobilizationDateFrom = new Date(ddf.setDate(ddf.getDate() - 5));
  }
  if (params.demobilizationDateTo) {
    let ddt = new Date(params.demobilizationDateTo);
    params.demobilizationDateTo = new Date(ddt.setDate(ddt.getDate() + 5));
  }
  let courts = await require("./courts.js")(db, params),
    ignorants = await require("./ignorants.js")(db, params),
    demobilizationNotes = await require("./demobilizationNotes.js")(db, params),
    injuries = await require("./injuries.js")(db, params),
    fugitives = await require("./fugitives.js")(db, params),
    medicalCommittees = await require("./medicalCommittees.js")(db, params),
    fixedItems = [
      ...courts,
      ...injuries,
      ...medicalCommittees,
      ...fugitives,
      ...demobilizationNotes,
      ...ignorants
    ],
    uniqueItems = [];
  fixedItems.forEach(item => {
    if (uniqueItems.map(u => u.militaryId).includes(item.militaryId)) {
      let procs = item.missedProcedures,
        oldProcsIndex = uniqueItems.findIndex(
          u => u.militaryId == item.militaryId
        ),
        oldProcs = uniqueItems[oldProcsIndex].missedProcedures,
        newProcs = [...oldProcs, ...procs];
      uniqueItems[oldProcsIndex].missedProcedures = newProcs;
    } else {
      uniqueItems.push(item);
    }
  });
  return uniqueItems;
};
