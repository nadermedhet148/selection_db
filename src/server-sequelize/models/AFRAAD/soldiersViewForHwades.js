/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "soldiersViewForHwades",
    {
      id: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "ID",
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Name"
      },
      soldierLevel: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "SoldierLevel"
      }
    },
    {
      tableName: "soldiersViewForHwades",
      timestamps: false
    }
  );
};
