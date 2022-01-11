module.exports = (db, params) => {
  "use strict";
  let os = require("os"),
    uptime = os.uptime(),
    ifaces = os.networkInterfaces(),
    ipv4 = [];
  Object.keys(ifaces).forEach(ifname => {
    ifaces[ifname].forEach(iface => {
      if (iface.family !== "IPv4" || iface.internal !== false) {
        return;
      }
      ipv4.push(iface);
    });
  });
  return {
    ifaces,
    ipv4,
    uptime
  };
};
