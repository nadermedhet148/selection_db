/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "permissions",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "ID"
      },
      permText: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "PermText"
      },
      permController: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "PermController"
      }
    },
    {
      tableName: "Permissions",
      timestamps: false
    }
  );
};
