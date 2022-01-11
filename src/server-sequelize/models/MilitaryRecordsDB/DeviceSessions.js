/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "deviceSessions",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "Id"
      },
      deviceId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Devices",
          key: "Id"
        },
        field: "DeviceId"
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
      tableName: "DeviceSessions",
      timestamps: false
    }
  );
};
