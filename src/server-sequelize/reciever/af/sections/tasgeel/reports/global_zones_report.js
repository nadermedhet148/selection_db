module.exports = async (db, params) => {
  let unparsed = await db.zones.findAll({
      include: [
        {
          model: db.conscriptes,
          where: {
            stateId: 101,
            typeId: 1
          },
          attributes: ["typeId", "stateId", "groupId", "sourceId", "forceId"],
          required: false
        }
      ]
    }),
    zones = JSON.parse(JSON.stringify(unparsed)),
    objX = {
      zoneId: "x",
      zoneText: "المجموع",
      writers: 0,
      drivers: 0,
      guards: 0,
      walkers: 0,
      musicians: 0,
      programers: 0,
      sumAllSaf: 0,
      sumAll: 0
    };
  zones.forEach((zone, i) => {
    zones[i].writers = zones[i].conscriptes.filter(c => c.groupId == 3).length;
    objX.writers += zones[i].writers;
    zones[i].drivers = zones[i].conscriptes.filter(c => c.groupId == 2).length;
    objX.drivers += zones[i].drivers;
    zones[i].guards = zones[i].conscriptes.filter(c => c.forceId == 52).length;
    objX.guards += zones[i].guards;
    zones[i].walkers = zones[i].conscriptes.filter(c => c.sourceId == 1).length;
    objX.walkers += zones[i].walkers;
    zones[i].musicians = zones[i].conscriptes.filter(
      c => c.sourceId == 3
    ).length;
    objX.musicians += zones[i].musicians;
    zones[i].programers = zones[i].conscriptes.filter(
      c => c.sourceId == 2
    ).length;
    objX.programers += zones[i].programers;
    zones[i].sumAllSaf =
      zones[i].guards +
      zones[i].walkers +
      zones[i].programers +
      zones[i].musicians;
    objX.sumAllSaf += zones[i].sumAllSaf;
    zones[i].sumAll =
      zones[i].writers +
      zones[i].drivers +
      zones[i].guards +
      zones[i].walkers +
      zones[i].musicians +
      zones[i].programers;
    objX.sumAll += zones[i].sumAll;
    delete zones[i].conscriptes;
  });
  return [...zones, objX];
};
