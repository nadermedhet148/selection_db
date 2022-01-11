/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "zones",
    {
      zoneId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        field: "ZoneId"
      },
      zoneText: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "ZoneText"
      },
      order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: "((0))",
        field: "Order"
      },
      zonePrintText: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "ZonePrintText"
      },
      afradId: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "AfradId"
      }
    },
    {
      tableName: "Zones",
      timestamps: false
    }
  );
};
