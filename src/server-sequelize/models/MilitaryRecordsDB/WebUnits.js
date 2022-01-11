/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "webUnits",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "Id"
      },
      displayedText: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "DisplayedText"
      },
      shortText: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "ShortText"
      },
      webZoneId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "WebZones",
          key: "Id"
        },
        field: "WebZoneId"
      },
      isOld: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        field: "isOld"
      },
      ta3Be2A: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "Ta3be2a"
      },
      leaderId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "WebUnitLeaders",
          key: "Id"
        },
        field: "Leader_Id"
      },
      unitId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "UnitId"
      }
    },
    {
      tableName: "WebUnits",
      timestamps: false
    }
  );
};
