/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "myUsers",
    {
      userName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "UserName"
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Password"
      },
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "ID"
      },
      role: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "Role"
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Name"
      }
    },
    {
      tableName: "MyUsers",
      timestamps: false
    }
  );
};
