/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "webUnitsPasswords",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "Id"
      },
      unitText: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "UnitText"
      },
      username: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Username"
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Password"
      },
      unitId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Units",
          key: "UnitId"
        },
        field: "UnitId"
      },
      isOurUsername: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        default: "0",
        field: "IsOurUsername"
      }
    },
    {
      tableName: "WebUnitsPasswords",
      timestamps: false
    }
  );
};
