/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "result",
    {
      f1: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "F1",
        primaryKey: true
      }
    },
    {
      tableName: "result$",
      timestamps: false
    }
  );
};
