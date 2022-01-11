/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "webOperations",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "Id"
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Name"
      },
      stopType: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "StopType"
      },
      method: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Method"
      }
    },
    {
      tableName: "WebOperations",
      timestamps: false
    }
  );
};
