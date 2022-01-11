/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "oldUnits",
    {
      unitId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        field: "UnitId"
      },
      unitText: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "UnitText"
      },
      unitType: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "UnitType"
      },
      order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "Order"
      },
      aliasText: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "AliasText"
      },
      isOld: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        field: "isOld"
      },
      ta3Be2A: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: "((0))",
        field: "Ta3be2a"
      }
    },
    {
      tableName: "OldUnits",
      timestamps: false
    }
  );
};
