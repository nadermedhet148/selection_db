/*
  Building relationships in 1 format
  ----------------------------------

  db.$0.$2(db.$1, {
    foreignKey: $3
  });

  where: {
    $0: "First parameter in the array, which is the source model",
    $1: "Second parameter in the array, which is the distination model",
    $2: "Third parameter in the array, which is the type of relationship",
    $3: "Fourth parameter in the array, which is the foreignkey"
  }

  NOTE::
  ------
  If you wish to create a relationships in other formats,
  you can create them inside the file index.js in server-sequelize folder
  under " Start Relationships " section.
*/

// const databases = require("./../dbs.js")();
// let dbs = {};

// Object.values(databases).forEach(database => {
//   let relationships = require(`./${database}.js`)();
//   dbs[database] = relationships;
// });

module.exports = db => {
  return require(`./${db}.js`)();
};
