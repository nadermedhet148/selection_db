/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "view1",
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
      expr1: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "Expr1"
      },
      expr2: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Expr2"
      }
    },
    {
      tableName: "View_1",
      timestamps: false
    }
  );
};
