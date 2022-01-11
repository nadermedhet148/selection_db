module.exports = async (db, params, win, dbs, webwin) => {
  if (webwin) {
    await webwin.destory();
  }
  return true;
};
