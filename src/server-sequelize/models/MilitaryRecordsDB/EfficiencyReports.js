/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "efficiencyReports",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "Id"
      },
      dateFrom: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "DateFrom"
      },
      dateTo: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "DateTo"
      },
      score: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Score"
      },
      degree: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Degree"
      },
      confirmation: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Confirmation"
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
      unitId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Units",
          key: "UnitId"
        },
        field: "UnitId"
      },
      afradId: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "AfradId"
      }
    },
    {
      tableName: "EfficiencyReports",
      timestamps: false
    }
  );
};
