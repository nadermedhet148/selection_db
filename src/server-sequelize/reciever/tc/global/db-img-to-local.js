module.exports = async (db, params) => {
  let fs = require("fs"),
    mkdirp = require("mkdirp"),
    getDirName = require("path").dirname,
    table = params.table,
    item = params.item;
  const isDevelopment = process.env.NODE_ENV !== "production";
  let person = await db[table.value].findOne({
      where: {
        [table.primaryKey]: item[table.primaryKey]
      },
      attributes: ["picture"]
    }),
    uniqueId = new Date().getTime(),
    filename = `${item[table.primaryKey]}-${uniqueId}.png`,
    writablePath = `${__dirname}\\${
      isDevelopment ? "..\\" : "..\\..\\"
    }printer\\cards\\${table.value}\\${filename}`,
    imageBuffer = Buffer.from(person.picture).toString("base64"),
    error = null;
  mkdirp(getDirName(writablePath));
  console.log(item[table.primaryKey]);
  if (item[table.primaryKey].includes("29205041202211")) {
    console.log("test");
    console.log(person.picture);
  }
  fs.writeFile(writablePath, imageBuffer, "base64", err => {
    error = err;
  });
  let deleteImage = await db[table.value].update(
    {
      // picture: null,
      imagePath: `${table.value}/${filename}`.replace(" ", "")
    },
    {
      where: {
        [table.primaryKey]: item[table.primaryKey]
      }
    }
  );
  return error ? error : true;
};
