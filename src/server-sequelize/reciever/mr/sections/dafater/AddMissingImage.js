const sharp = require("sharp");
const fs = require("fs");
module.exports = async (db, params) => {
  let { newImagePath, dir, currentImagepath } = params;
  newImagePath = newImagePath.replaceAll("/", "\\");
  dir = dir.replaceAll("/", "\\");
  //finalImageName = params.finalImageName.replaceAll('/', '\\')

  currentImageName = currentImagepath.split("//").pop();
  currentImageNameArr = currentImageName.split(".");
  nextImageName =
    currentImageNameArr.length <= 2
      ? currentImageNameArr[0] + ".1.jpg"
      : currentImageNameArr[0] +
        "." +
        (parseInt(currentImageNameArr[1]) + 1).toString() +
        ".jpg";

  try {
    await sharp(fs.readFileSync(newImagePath))
      .jpeg({ quality: 60 })
      .toFile(dir + nextImageName);
    return {
      newImagePath: newImagePath,
      dir: dir,
      //finalImageName: finalImageName,
      nextImageName: nextImageName
    };
  } catch (error) {
    return { error: error };
  }
};
