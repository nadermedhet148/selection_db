module.exports = async (db, params) => {
  let today = new Date().toISOString().substring(0, 10),
    time = new Date().getTime(),
    record = await db.sequelize.query(
      `
    BACKUP DATABASE [${params.dbname}] TO DISK = N'${params.path}\\${params.dbname}-${today}-${time}.bak' 
    WITH NOFORMAT, NOINIT, NAME = N'Full Database Backup', SKIP, NOREWIND, NOUNLOAD,
    STATS = 10
    `
    );
  return record;
};
