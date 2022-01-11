const fs = require("fs");
module.exports = async (db, params) => {
  let currentImage = params.currentImagePath.replaceAll("/", "\\");
  try {
    fs.unlinkSync(currentImage);
    return {
      currentImagePath: currentImage
    };
  } catch (error) {
    return { error: error };
  }
};
