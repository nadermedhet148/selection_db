module.exports = async (db, params) => {
  let fs = require("fs"),
    img = fs.readFileSync(params.path, "base64"),
    finalImg = `data:image/jpeg;base64,${img}`;
  return finalImg;
};
