module.exports = async (db, params) => {
  const isDevelopment = process.env.NODE_ENV !== "production";
  let child = require("child_process").execFile;
  let executablePath = isDevelopment
    ? __dirname + "\\..\\quit-er\\app.exe"
    : __dirname + "\\..\\..\\quit-er\\app.exe";
  child(executablePath);
  return;
};
