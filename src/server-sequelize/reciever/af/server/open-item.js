module.exports = async (db, params) => {
  const { shell } = require("electron");
  if (params.path) {
    shell.openPath(params.path);
    return;
  } else {
    return;
  }
};
