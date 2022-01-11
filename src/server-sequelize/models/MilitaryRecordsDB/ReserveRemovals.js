/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "reserveRemovals",
    {
      militaryId: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        references: {
          model: "RecordsPrintVerifies",
          key: "MilitaryId"
        },
        field: "MilitaryId"
      },
      backerSubmissionDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "BackerSubmissionDate"
      },
      removalExecutionState: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        field: "RemovalExecutionState"
      },
      notes: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Notes"
      },
      demobilizationGroupId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "DemobilizationGroups",
          key: "Id"
        },
        field: "DemobilizationGroupId"
      }
    },
    {
      tableName: "ReserveRemovals",
      timestamps: false
    }
  );
};
