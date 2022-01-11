module.exports = async (db, params) => {
  let { promises: fs } = require("fs"),
    root_path = `//192.9.201.222/f1/افلام/`,
    deep = 3,
    paths = [[root_path]],
    items = [];
  for (let i = 0; i < deep; i++) {
    if (paths && paths[i] && paths[i].length > 0) {
      let new_paths = paths[i];
      new_paths.forEach(async path => {
        let entries = await fs.readdir(path, {
            withFileTypes: true
          }),
          folders = entries.filter(folder => folder.isDirectory()),
          imgs = entries.filter(
            file => !file.isDirectory() && file.name.includes(params.militaryId)
          );
        items.push({
          path,
          imgs
        });
        if (folders.length > 0) {
          paths[i + 1] = [];
          folders.forEach(folder => {
            paths[i + 1].push(`${path}/${folder.name}`);
          });
        }
      });
    }
  }
  return { items, paths };
};
