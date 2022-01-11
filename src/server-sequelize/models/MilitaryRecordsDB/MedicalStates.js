/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "medicalStates",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "Id"
      },
      index: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "Index"
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "Date"
      },
      situation: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Situation"
      },
      verifiedBy: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "VerifiedBy"
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
      tableName: "MedicalStates",
      timestamps: false
    }
  );
};
