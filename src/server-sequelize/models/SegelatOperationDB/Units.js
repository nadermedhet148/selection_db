/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "units",
    {
      unitId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "UnitID"
      },
      unitText: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "UnitText"
      },
      unitAliasText: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "UnitAliasText"
      }
    },
    {
      tableName: "Units",
      timestamps: false
    }
  );
};
