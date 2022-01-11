module.exports = async (db, params) => {
  const isDevelopment = process.env.NODE_ENV !== "production";
  var child = require("child_process").execFile;
  var executablePath = isDevelopment
    ? __dirname + "\\..\\booster\\MilitaryRecords.exe"
    : __dirname + "\\..\\..\\booster\\MilitaryRecords.exe";
  var error = "";
  // child(executablePath, function(err, data) {
  //   if (err) {
  //     // console.error(err);
  //     error = err;
  //     return;
  //   }
  //   // console.log(data.toString());
  // });
  return {
    executablePath,
    error
  };
};
