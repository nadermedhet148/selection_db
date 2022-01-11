/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "mobilizationAreas",
    {
      areaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        field: "AreaId"
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Name"
      },
      afradId: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "AfradId"
      }
    },
    {
      tableName: "MobilizationAreas",
      timestamps: false
    }
  );
};
