/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "deviceSessionFiles",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "Id"
      },
      sessionId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "DeviceSessions",
          key: "Id"
        },
        field: "SessionId"
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Name"
      },
      path: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Path"
      },
      fromDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "FromDate"
      },
      toDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "ToDate"
      }
    },
    {
      tableName: "DeviceSessionFiles",
      timestamps: false
    }
  );
};
