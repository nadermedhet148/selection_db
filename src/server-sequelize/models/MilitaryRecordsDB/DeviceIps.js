/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "deviceIps",
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
      ip: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Ip"
      }
    },
    {
      tableName: "DeviceIps",
      timestamps: false
    }
  );
};
