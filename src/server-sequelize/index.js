"use strict";

const { Sequelize, DataTypes, Op } = require("sequelize");
// Fix date issues
Sequelize.DATE.prototype._stringify = function _stringify(date, options) {
  options.timezone = "+00:00";
  // return this._applyTimezone(date, options).format("YYYY-MM-DD HH:mm:ss.SSS");
  return this._applyTimezone(date, options).format("YYYY-MM-DD HH:mm:ss.SSS");
};

// This is a string prop holding the current server
const config = require("./config/__config.json")["Mandour"];
// This prop has your current server configs username,password,server etc ...
const databases = require("./dbs.js")();
// This prop holds an object containing several databases
// later you will use it to select one of your databases to work with
let dbs = {};
const customIncludes = (name, ...args) => {
  let state = false;
  args.forEach(item => {
    if (!state) state = name.includes(item);
  });
  return state;
};
Object.keys(databases).forEach(dbKey => {
  let dbName = databases[dbKey];
  let db = {};
  let files = require("./__models__.js")(dbName);
  // This is an array of strings holding the database tables models.
  let relationships = require("./relationships")(dbName);
  // This is a two dim-array of strings holding the database relations.
  let sequelize = new Sequelize(dbName, config.username, config.password, {
    ...config,
    logging: config.logging ? console.log : false, // [false] or [console.log]
    operatorsAliases: {
      $gt: Op.gt, // Greater Than
      $gte: Op.gte, // Greater Than or Equal
      $lt: Op.lt, // Less Than
      $lte: Op.lte, // Less Than or Equal
      $between: Op.between, // Between
      $not: Op.not,
      $is: Op.is,
      $or: Op.or,
      $and: Op.and,
      $ne: Op.ne,
      $eq: Op.eq,
      $col: Op.col,
      $notBetween: Op.notBetween,
      $all: Op.all,
      $in: Op.in,
      $notIn: Op.notIn,
      $like: Op.like,
      $iLike: Op.iLike, // Not Working With SqlServer Database
      $notLike: Op.notLike,
      $notILike: Op.notILike, // Not Working With SqlServer Database
      $startsWith: Op.startsWith,
      $endsWith: Op.endsWith,
      $includes: Op.substring,
      $substring: Op.substring,
      $regexp: Op.regexp, // Not Working With SqlServer Database
      $notRegexp: Op.notRegexp, // Not Working With SqlServer Database
      $iRegexp: Op.iRegexp, // Not Working With SqlServer Database
      $notIRegexp: Op.notIRegexp, // Not Working With SqlServer Database
      $any: Op.any
    }
  });

  files.forEach((file, i) => {
    const model = require(`./models/${dbName}/${file}`)(sequelize, DataTypes);
    /*if (customIncludes(model.name, "dafater", "Services")) {
      model.sync({ alter: true });
    }*/
    db[model.name] = model;
    // if (model.name == "cardsCertificants" || model.name == "cardsTracking") {
    //   model.sync({ alter: true }).catch(err => {
    //     console.log(err);
    //   });
    // }
  });
  Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });
  db.sequelize = sequelize;
  db.Sequelize = Sequelize;
  db.current_server = config.title;
  db.Op = Op;

  /*
    Start Relationships
  */
  relationships.forEach(r => {
    /*let foreignKeyObject = {
      foreignKey: r[3]
    };*/
    //db[r[0]][r[2]](db[r[1]], r[3] && r[3].length > 0 ? foreignKeyObject : {});

    let extraOptions = {};
    if (r[3] && r[3].length > 0) {
      extraOptions["foreignKey"] = r[3];
    }
    if (r[4] && r[4].length > 0) {
      extraOptions["onUpdate"] = r[4];
      extraOptions["onDelete"] = r[4];
      extraOptions["hooks"] = true;
    }
    db[r[0]][r[2]](db[r[1]], extraOptions);
    /*if(r[0] == "cards" && r[1] == "cardsTracking"){
      console.log(extraOptions);
    }*/

    /*if(r[2] == "cardsFamilyMembers" && r[0] == "cards"){
      console.log(r[0]);
      db[r[0]].sync({alter: true});
    }*/
  });
  /*
    ../End Relationships
  */

  dbs[dbKey] = db;
});
const newAffradDbInitlizer = require("./models/NewAFRAAD/init-models");

let sequelize = new Sequelize("SelectionDb", config.username, config.password, {
  ...config,
  logging: config.logging ? console.log : false, // [false] or [console.log]
  operatorsAliases: {
    $gt: Op.gt, // Greater Than
    $gte: Op.gte, // Greater Than or Equal
    $lt: Op.lt, // Less Than
    $lte: Op.lte, // Less Than or Equal
    $between: Op.between, // Between
    $not: Op.not,
    $is: Op.is,
    $or: Op.or,
    $and: Op.and,
    $ne: Op.ne,
    $eq: Op.eq,
    $col: Op.col,
    $notBetween: Op.notBetween,
    $all: Op.all,
    $in: Op.in,
    $notIn: Op.notIn,
    $like: Op.like,
    $iLike: Op.iLike, // Not Working With SqlServer Database
    $notLike: Op.notLike,
    $notILike: Op.notILike, // Not Working With SqlServer Database
    $startsWith: Op.startsWith,
    $endsWith: Op.endsWith,
    $includes: Op.substring,
    $substring: Op.substring,
    $regexp: Op.regexp, // Not Working With SqlServer Database
    $notRegexp: Op.notRegexp, // Not Working With SqlServer Database
    $iRegexp: Op.iRegexp, // Not Working With SqlServer Database
    $notIRegexp: Op.notIRegexp, // Not Working With SqlServer Database
    $any: Op.any
  }
});

dbs["af"] = newAffradDbInitlizer(sequelize);
dbs["af"].sequelize = sequelize;
dbs["af"].Sequelize = Sequelize;
dbs["af"].current_server = config.title;
dbs["af"].Op = Op;

module.exports = dbs;
