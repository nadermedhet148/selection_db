module.exports = async (db, params) => {
  let fs = require("fs"),
    path = require("path");
  let root_path = `//192.9.201.222/f1/افلام/`,
    items = [],
    filenames = [],
    unique_filenames = [],
    militaryIds = [],
    deep = 5,
    counter = 1,
    setFilename = function(dir, root) {
      let militaryId =
          dir && dir.split("_") && dir.split("_").length > 0
            ? dir.split("_")[0]
            : "",
        obj = {
          filename: dir,
          path: `${root}/${dir}`
        };
      if (militaryId) {
        obj.militaryId = militaryId;
        if (!militaryIds.includes(militaryId)) {
          militaryIds.push(militaryId);
        }
      }
      filenames.push(obj);
    },
    setItem = function(name, children) {
      counter++;
      let obj = {
        id: counter,
        name: "",
        children: []
      };
      items.push(obj);
    };
  // loopCicle = function(line) {
  //   let dirs = fs.readdirSync(line);
  //   dirs.forEach(dir => {
  //     let state = fs.lstatSync(`${line}/${dir}`);
  //     if (state.isDirectory()) {
  //       // Go Ahead
  //       // loopCicle();
  //     } else {
  //       // File
  //       filenames = [...filenames, dir];
  //     }
  //   });
  // };
  if (fs.existsSync(root_path)) {
    let dirs = fs.readdirSync(root_path);
    if (dirs && dirs.length > 0) {
      // LEVEL 1
      dirs.forEach(dir => {
        let state = fs.lstatSync(`${root_path}/${dir}`);
        if (state.isDirectory()) {
          let obj = {
            id: counter,
            name: dir,
            children: []
          };
          counter++;
          let dirs_2 = fs.readdirSync(`${root_path}/${dir}`);
          if (dirs_2 && dirs_2.length > 0) {
            // LEVEL 2
            dirs_2.forEach(dir_2 => {
              let state_2 = fs.lstatSync(`${root_path}/${dir}/${dir_2}`);
              if (state_2.isDirectory()) {
                let obj_2 = {
                  id: counter,
                  name: dir_2,
                  children: []
                };
                counter++;
                let dirs_3 = fs.readdirSync(`${root_path}/${dir}/${dir_2}`);
                if (dirs_3 && dirs_3.length > 0) {
                  // LEVEL 3
                  dirs_3.forEach(dir_3 => {
                    let state_3 = fs.lstatSync(
                      `${root_path}/${dir}/${dir_2}/${dir_3}`
                    );
                    if (state_3.isDirectory()) {
                      let obj_3 = {
                        id: counter,
                        name: dir_3,
                        children: []
                      };
                      counter++;
                      let dirs_4 = fs.readdirSync(
                        `${root_path}/${dir}/${dir_2}/${dir_3}`
                      );
                      if (dirs_4 && dirs_4.length > 0) {
                        // LEVEL 4
                        dirs_4.forEach(dir_4 => {
                          let state_4 = fs.lstatSync(
                            `${root_path}/${dir}/${dir_2}/${dir_3}/${dir_4}`
                          );
                          if (state_4.isDirectory()) {
                            let obj_4 = {
                              id: counter,
                              name: dir_4,
                              children: []
                            };
                            counter++;
                            let dirs_5 = fs.readdirSync(
                              `${root_path}/${dir}/${dir_2}/${dir_3}/${dir_4}`
                            );
                            if (dirs_5 && dirs_5.length > 0) {
                              // LEVEL 5
                              // dirs_5.forEach(dir_5 => {
                              //   let state_5 = fs.lstatSync(
                              //     `${root_path}/${dir}/${dir_2}/${dir_3}/${dir_4}/${dir_5}`
                              //   );
                              //   if (state_5.isDirectory()) {
                              //     let obj_5 = {
                              //       id: counter,
                              //       name: dir_5,
                              //       children: []
                              //     };
                              //     counter++;
                              //     let dirs_6 = fs.readdirSync(
                              //       `${root_path}/${dir}/${dir_2}/${dir_3}/${dir_4}/${dir_5}`
                              //     );
                              //     if (dirs_6 && dirs_6.length > 0) {
                              //       // LEVEL 6
                              //     }
                              //     obj.children.push(obj_5);
                              //   } else {
                              //     setFilename(
                              //       dir_5,
                              //       `${root_path}/${dir}/${dir_2}/${dir_3}/${dir_4}`
                              //     );
                              //   }
                              // });
                              // End LEVEL 5
                            }
                            obj_3.children.push(obj_4);
                          } else {
                            // setFilename(
                            //   dir_4,
                            //   `${root_path}/${dir}/${dir_2}/${dir_3}`
                            // );
                          }
                        });
                        // End LEVEL 4
                      }
                      obj_2.children.push(obj_3);
                    } else {
                      // setFilename(dir_3, `${root_path}/${dir}/${dir_2}`);
                    }
                  });
                }
                obj.children.push(obj_2);
              } else {
                // setFilename(dir_2, `${root_path}/${dir}`);
              }
            });
          }
          items.push(obj);
        } else {
          // setFilename(dir, root_path);
        }
      });
    }
    return {
      items
      // filenames,
      // militaryIds
    };
  } else {
    return null;
  }
};
