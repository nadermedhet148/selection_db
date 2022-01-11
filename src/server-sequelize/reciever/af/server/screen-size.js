module.exports = (db, params) => {
  "use strict";
  let { screen } = require("electron");
  let { width, height } = screen.getPrimaryDisplay().workAreaSize;
  return {
    width,
    height
  };
};
