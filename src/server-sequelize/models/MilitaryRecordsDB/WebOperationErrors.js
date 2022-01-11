/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "webOperationErrors",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "Id"
      },
      recordedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "RecordedAt"
      },
      identifier: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Identifier"
      },
      describer: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Describer"
      },
      errors: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Errors"
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
      webOperationHistoryId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "WebOperationHistories",
          key: "Id"
        },
        field: "WebOperationHistoryId"
      }
    },
    {
      tableName: "WebOperationErrors",
      timestamps: false
    }
  );
};
