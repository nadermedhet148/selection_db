/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "recordsPrintReceptions",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "Id"
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
      demobilizationGroupId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "DemobilizationGroups",
          key: "Id"
        },
        field: "DemobilizationGroupId"
      },
      unitReceptionDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "UnitReceptionDate"
      },
      unitReceptionDelegate: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "UnitReceptionDelegate"
      },
      branchReceptionDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "BranchReceptionDate"
      },
      branchReceptionDelegate: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "BranchReceptionDelegate"
      },
      count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "Count"
      }
    },
    {
      tableName: "RecordsPrintReceptions",
      timestamps: false
    }
  );
};
