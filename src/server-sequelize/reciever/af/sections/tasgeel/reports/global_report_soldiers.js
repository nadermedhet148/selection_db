module.exports = async (db, params) => {
  let writers = await db.conscriptes.count({
      where: {
        typeId: 1,
        stateId: 101,
        groupId: 3
      }
    }),
    drivers = await db.conscriptes.count({
      where: {
        typeId: 1,
        stateId: 101,
        groupId: 2
      }
    }),
    guards = await db.conscriptes.count({
      where: {
        typeId: 1,
        stateId: 101,
        forceId: 52
      }
    }),
    walkers = await db.conscriptes.count({
      where: {
        typeId: 1,
        stateId: 101,
        sourceId: 1
      }
    }),
    musicians = await db.conscriptes.count({
      where: {
        typeId: 1,
        stateId: 101,
        sourceId: 3
      }
    }),
    programers = await db.conscriptes.count({
      where: {
        typeId: 1,
        stateId: 101,
        sourceId: 2
      }
    }),
    obj = {
      writers, // كاتب عسكري
      drivers, // سائق
      guards, // حدود
      walkers, // مشاة
      musicians, // موسيقى
      programers, // نظم
      sumAllSaf: guards + walkers + programers + musicians,
      sumAll: writers + drivers + guards + walkers + musicians + programers
    };
  return [obj];
};
