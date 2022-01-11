module.exports = async (db, deviceSessionId) => {
  "use strict";
  let os = require("os");
  let saveSession = await db.deviceSessions.update(
    {
      toDate: new Date()
    },
    {
      where: {
        id: deviceSessionId
      }
    }
  );
  return true;
};
