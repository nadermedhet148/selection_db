/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "webOperationHistories",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "Id"
      },
      startAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "StartAt"
      },
      stopAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "StopAt"
      },
      endAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "EndAt"
      },
      stopIn: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "StopIn"
      },
      stopPercent: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "StopPercent"
      },
      webOperationId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "WebOperations",
          key: "Id"
        },
        field: "WebOperationId"
      },
      rangeStart: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "RangeStart"
      },
      rangeEnd: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "RangeEnd"
      },
      unitId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Units",
          key: "UnitId"
        },
        field: "UnitId"
      }
    },
    {
      tableName: "WebOperationHistories",
      timestamps: false
    }
  );
};
