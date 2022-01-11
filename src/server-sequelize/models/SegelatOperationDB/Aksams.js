/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "aksams",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "ID"
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Name"
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Password"
      }
    },
    {
      tableName: "Aksams",
      timestamps: false
    }
  );
};
