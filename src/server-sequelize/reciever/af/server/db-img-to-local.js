module.exports = async (db, params) => {
  let fs = require("fs");
  const isDevelopment = process.env.NODE_ENV !== "production";
  let conscripte = await db.conscriptes.findOne({
      where: {
        militaryId: params.militaryId
      },
      attributes: ["image"]
    }),
    uniqueId = new Date().getTime(),
    filename = `${params.militaryId}-${uniqueId}.jpg`,
    writablePath = `${__dirname}\\${
      isDevelopment ? "..\\" : "..\\..\\"
    }printer\\extracted-images\\${filename}`,
    imageBuffer = Buffer.from(conscripte.image, "base64"),
    error = null;
  fs.writeFile(writablePath, imageBuffer, "base64", err => {
    error = err;
  });
  let deleteImage = await db.conscriptes.update(
    {
      image: null,
      imagePath: filename
    },
    {
      where: {
        militaryId: params.militaryId
      }
    }
  );
  return error ? error : true;
};
