/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "unit",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "Id"
      },
      unitText: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "UnitText"
      }
    },
    {
      tableName: "Unit",
      timestamps: false
    }
  );
};
