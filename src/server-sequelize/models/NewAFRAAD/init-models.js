var DataTypes = require("sequelize").DataTypes;
var _Centre = require("./Centre");
var _City = require("./City");
var _Soldier = require("./Soldier");
var _Users = require("./Users");
var _Notes = require("./Notes");
var _Unit = require("./Unit");
var _Action = require("./Action");
var _Cases = require("./Cases");
var _References = require("./References");
var _Config = require("./Config");

function initModels(sequelize) {
  var City = _City(sequelize, DataTypes);
  var Users = _Users(sequelize, DataTypes);
  var Centre = _Centre(sequelize, DataTypes);
  var Soldier = _Soldier(sequelize, DataTypes);
  var Notes = _Notes(sequelize, DataTypes);
  var Unit = _Unit(sequelize, DataTypes);
  var Action = _Action(sequelize, DataTypes);
  var Cases = _Cases(sequelize, DataTypes);
  var References = _References(sequelize, DataTypes);
  var Config = _Config(sequelize, DataTypes);

  Soldier.hasMany(Notes, { foreignKey: "ID" });
  Notes.belongsTo(Soldier, { foreignKey: "ID" });

  Notes.hasMany(Action, { foreignKey: "noteId" });
  Action.belongsTo(Notes, { foreignKey: "noteId" });

  Soldier.hasMany(Cases, { foreignKey: "ID" });
  Cases.belongsTo(Soldier, { foreignKey: "ID" });

  return {
    City,
    Users,
    Centre,
    Soldier,
    Notes,
    Unit,
    Action,
    Cases,
    References,
    Config
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
