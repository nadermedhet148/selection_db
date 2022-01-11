module.exports = async (db, params) => {
  let cmd = require("child_process");
  let changeLocale = function(locale, format, num) {
    let localName = `reg add "HKCU\\Control Panel\\International" /t REG_SZ /v LocaleName /d ${locale} /f`,
      formatDate = `reg add "HKCU\\Control Panel\\International" /t REG_SZ /v sShortDate /d ${format} /f`,
      numShape = `reg add "HKCU\\Control Panel\\International" /t REG_SZ /v NumShape /d ${num} /f`;
    cmd.exec(localName);
    cmd.exec(formatDate);
    cmd.exec(numShape);
  };
  changeLocale("ar-EG", "dd-MM-yyyy", "2");
  return true;
};
