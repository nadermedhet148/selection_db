module.exports = async (db, params) => {
  let { promises: fs } = require("fs"),
    root_path = `//192.9.201.222/f1/افلام/`;
  let entries = await fs.readdir(`${root_path}/${params.path}`, {
      withFileTypes: true
    }),
    counter = params.counter ? Number(params.counter) : 1,
    folders = entries.filter(folder => folder.isDirectory()),
    imgs = entries.filter(
      file =>
        !file.isDirectory() &&
        (file.name.includes(".jpg") ||
          file.name.includes(".JPG") ||
          file.name.includes(".JPEG") ||
          file.name.includes(".jpeg") ||
          file.name.includes(".png") ||
          file.name.includes(".PNG"))
    );
  folders.forEach((folder, i) => {
    folders[i].children = [];
    folders[i].id = counter;
    folders[i].path = `${params.path}/${folder.name}`;
    counter++;
  });
  if (imgs.length > 0) {
    folders.push({
      id: counter,
      name: `${imgs.length} صورة`,
      path: `${params.path}`
    });
  }
  // files.forEach((file, i) => {
  //   files[i].id = counter;
  //   files[i].path = `${root_path}/${params.path}/${file.name}`;
  //   counter++;
  // });
  return folders;
};
