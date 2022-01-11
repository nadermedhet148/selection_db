module.exports = async (db, params) => {
  "use strict";
  const { dialog, BrowserWindow } = require("electron");
  let window = new BrowserWindow({
    show: false,
    alwaysOnTop: true
  });
  await dialog.showMessageBox(window, {
    type: params.type ? params.type : "info",
    buttons: params.buttons ? params.buttons : [],
    title: params.title ? params.title : "تنبيه",
    message: params.msg ? params.msg : ""
  });
  window = null;
  return true;
};
