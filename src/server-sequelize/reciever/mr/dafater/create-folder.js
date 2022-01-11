let fs = require("fs");
let os = require("os");
const excuteComand = require("child_process").execSync;

let path = [
  "",
  "qyada_qwat_hrs_alhdwd",
  "fra_alsjlat_qyada_qwat_hrs_alhdwd",
  "ScanTree",
  "16",
  "Film"
];

let windows = {
  root: "\\DESKTOP-V6BI5NI",
  rootIp: "\\192.9.201.30",
  joinOp: "\\",
  comandLine: "explorer "
};
let macOs = {
  root: "Volumes",
  joinOp: "/",
  comandLine: "open "
};

function isMac() {
  return os.platform() == "darwin";
}

function preparePathFor(currentOS, filmNumber, dafterIndex, ip = false) {
  let tempArr = [...path];
  tempArr.splice(5, 0, filmNumber);
  tempArr.push(dafterIndex);
  tempArr.splice(1, 0, ip ? currentOS.rootIp : currentOS.root);
  return tempArr.join(currentOS.joinOp);
}

function opernDirectory(currentOS, fullPath) {
  const output = excuteComand(currentOS.comandLine + fullPath, {
    encoding: "utf-8"
  });
  console.log(output);
}

function createFolderIfNotEsixt(filmNumber, dafterIndex) {
  let errMsg = "";
  let currentOS = isMac() ? macOs : windows;

  console.log("is mac :", isMac());
  console.log("op object : ", currentOS);
  console.log("filmNumber ", filmNumber, "dafterIndex ", dafterIndex);

  let fullPath = preparePathFor(currentOS, filmNumber, dafterIndex, false);

  console.log("fullPth : ", fullPath);

  if (fs.existsSync(fullPath)) {
    console.log("path already exists ....");
    opernDirectory(currentOS, fullPath);
  } else {
    fs.mkdir(fullPath, err => {
      if (err) {
        errMsg = err;
        console.log("createFolderIfNotEsixt err : ", errMsg);
      } else {
        opernDirectory(currentOS, fullPath);
      }
    });
    console.log("fullPath has been crated at :", fullPath);
  }
  return errMsg;
}

module.exports = async (db, params) => {
  if (params.filmNumber && params.dafterIndex) {
    let msg = createFolderIfNotEsixt(params.filmNumber, params.dafterIndex);
    let state = msg ? 404 : 101;
    return {
      state: state,
      msg: msg
    };
  }
  return {
    state: 500,
    msg: "filmNumber and dafterIndex dose not exist "
  };
};
