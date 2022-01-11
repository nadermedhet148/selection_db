/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "view1",
    {
      expr1: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "Expr1"
      },
      unitText: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "UnitText"
      }
    },
    {
      tableName: "View_1",
      timestamps: false
    }
  );
};
