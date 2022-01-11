module.exports = async (db, params) => {
  if (params.path) {
    let path = params.path;
    const fs = require("fs");
    let file = fs.readFileSync(path);
    return file;
  }
  return;
};
