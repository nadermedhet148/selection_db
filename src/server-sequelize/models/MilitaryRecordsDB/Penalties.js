/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "penalties",
    {
      injuryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "InjuryId"
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
      crimeStartDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "crimeStartDate"
      },
      crimeEndDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "crimeEndDate"
      },
      penaltyTypeId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "PenaltyTypes",
          key: "id"
        },
        field: "PenaltyTypeId"
      },
      penaltyText: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "penaltyText"
      },
      penaltyStartDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "penaltyStartDate"
      },
      penaltyEndDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "penaltyEndDate"
      },
      penaltyTotalTime: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "penaltyTotalTime"
      }
    },
    {
      tableName: "Penalties",
      timestamps: false
    }
  );
};
