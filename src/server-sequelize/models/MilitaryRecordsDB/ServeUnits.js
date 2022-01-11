/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "serveUnits",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "Id"
      },
      count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "Count"
      },
      unitId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Units",
          key: "UnitId"
        },
        field: "UnitId"
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
      joiningDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "JoiningDate"
      },
      endingDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "EndingDate"
      }
    },
    {
      tableName: "ServeUnits",
      timestamps: false
    }
  );
};
