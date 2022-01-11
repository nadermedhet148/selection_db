/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "removalAndNotes",
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
      demobilizationGroupId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "DemobilizationGroups",
          key: "Id"
        },
        field: "DemobilizationGroupId"
      },
      reason: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Reason"
      },
      notes: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Notes"
      },
      type: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "Type"
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "Date"
      }
    },
    {
      tableName: "RemovalAndNotes",
      timestamps: false
    }
  );
};
