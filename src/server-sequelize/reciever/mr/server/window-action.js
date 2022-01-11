module.exports = async (db, params, win, dbs, webwin) => {
  let methods = {
    minimize() {
      if (webwin.isMinimized()) {
        webwin.restore();
      } else {
        webwin.minimize();
      }
    },
    maximize() {
      if (webwin.isMaximized()) {
        webwin.restore();
      } else {
        webwin.maximize();
      }
    },
    async destroy() {
      await webwin.destroy();
    }
  };
  await methods[params.action]();
  return true;
};
