module.exports = async (db, params) => {
  if (params.path) {
    let path = params.path;
    const fs = require("fs");
    let files = fs.readdirSync(path);
    return files;
  }
  return;
};
