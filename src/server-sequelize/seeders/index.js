let tables = ["Nationalities"],
  seeders = [];

tables.forEach(table => {
  seeders.push({
    table: table,
    rows: require(`./${table}.js`)
  });
});

let findOrCreate = async (db, table, rows) => {
  return new Promise((success, failure) => {
    (async function loop() {
      for (let i = 0; i < rows.length; i++) {
        let row = rows[i];
        await db[table].findOrCreate({
          where: row
        });
        if (i == rows.length - 1) {
          success(true);
        }
      }
    })();
  });
};

module.exports = async db => {
  return new Promise((success, failure) => {
    (async function loop() {
      for (let i = 0; i < seeders.length; i++) {
        let { table, rows } = seeders[i];
        await findOrCreate(db, table, rows);
        if (i == seeders.length - 1) {
          success(true);
        }
      }
    })();
  });
};
