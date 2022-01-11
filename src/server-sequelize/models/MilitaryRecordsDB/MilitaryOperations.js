/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "militaryOperations",
    {
      militaryOperationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        field: "MilitaryOperationId"
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "name"
      }
    },
    {
      tableName: "MilitaryOperations",
      timestamps: false
    }
  );
};
