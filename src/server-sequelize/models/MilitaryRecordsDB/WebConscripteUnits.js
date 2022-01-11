/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "webConscripteUnits",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "Id"
      },
      militaryId: {
        type: DataTypes.STRING,
        allowNull: true,
        references: {
          model: "Conscriptes",
          key: "MilitaryId"
        },
        field: "MilitaryId"
      },
      webUnitId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "WebUnits",
          key: "Id"
        },
        field: "WebUnitId"
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "CreatedAt"
      }
    },
    {
      tableName: "WebConscripteUnits",
      timestamps: false
    }
  );
};
