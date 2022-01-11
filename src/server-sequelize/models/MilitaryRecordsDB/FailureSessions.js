/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "failureSessions",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "Id"
      },
      sort: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "Sort"
      },
      from: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "From"
      },
      to: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "To"
      },
      supporterId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "SupporterId"
      },
      milId: {
        type: DataTypes.STRING,
        allowNull: true,
        references: {
          model: "Conscriptes",
          key: "MilitaryId"
        },
        field: "MilId"
      }
    },
    {
      tableName: "FailureSessions",
      timestamps: false
    }
  );
};
