/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "selectMonths",
    {
      movingMonth: {
        type: DataTypes.DATE,
        allowNull: false,
        primaryKey: true,
        field: "MovingMonth"
      }
    },
    {
      tableName: "SelectMonths",
      timestamps: false
    }
  );
};
