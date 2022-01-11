module.exports = async (db, params) => {
  let { promises: fs } = require("fs");
  let mainPath = `${params.rootDir}/${params.path}`;
  let entries = await fs.readdir(mainPath, {
      withFileTypes: true
    }),
    counter = params.counter ? Number(params.counter) : 1,
    folders = entries.filter(
      folder =>
        folder.isDirectory() &&
        folder.name != "A_Start" &&
        folder.name != "Z_End"
    );
  imgs = entries
    .filter(
      file =>
        !file.isDirectory() &&
        (file.name.endsWith(".jpg") ||
          file.name.endsWith(".JPG") ||
          file.name.endsWith(".JPEG") ||
          file.name.endsWith(".jpeg") ||
          file.name.endsWith(".png") ||
          file.name.endsWith(".PNG"))
    )
    .sort((a, b) => {
      return (
        Number(
          a.name
            .toLowerCase()
            .split(mainPath)[0] //getting the file name.extention
            .split(".jpg")[0] //isolating the name from the extention
        ) -
        Number(
          b.name
            .toLowerCase()
            .split(mainPath)[0]
            .split(".jpg")[0]
        )
      );
    });
  folders.forEach((folder, i) => {
    folders[i].children = [];
    folders[i].id = counter;
    folders[i].path = `${params.path}/${folder.name}`;
    folder.name = folder.name == "Film" ? "الدفاتر" : folder.name;
    counter++;
  });
  if (imgs.length > 0) {
    folders.push({
      id: counter,
      name: params.isDafter ? "" : `${imgs.length - 1} صورة`,
      path: `${params.path}`,
      images: params.isDafter ? [] : imgs
    });
  }
  // files.forEach((file, i) => {
  //   files[i].id = counter;
  //   files[i].path = `${root_path}/${params.path}/${file.name}`;
  //   counter++;
  // });
  return {
    folders: folders.sort((a, b) => a.name - b.name)
  };
};
