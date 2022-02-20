var DataTypes = require("sequelize").DataTypes;
var _Centre = require("./Centre");
var _City = require("./City");
var _Soldier = require("./Soldier");
var _Users = require("./Users");
var _Notes = require("./Notes");

function initModels(sequelize) {
  var City = _City(sequelize, DataTypes);
  var Users = _Users(sequelize, DataTypes);
  var Centre = _Centre(sequelize, DataTypes);
  var Soldier = _Soldier(sequelize, DataTypes);
  var Notes = _Notes(sequelize, DataTypes);

  Soldier.hasMany(Notes, { foreignKey: "ID" });
  Notes.belongsTo(Soldier, { foreignKey: "ID" });

  return {
    City,
    Users,
    Centre,
    Soldier,
    Notes
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
