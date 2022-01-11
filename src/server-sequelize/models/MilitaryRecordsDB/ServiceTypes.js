/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "serviceTypes",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "id"
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "name"
      }
    },
    {
      tableName: "ServiceTypes",
      timestamps: false
    }
  );
};
