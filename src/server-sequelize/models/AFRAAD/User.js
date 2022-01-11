/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "user",
    {
      userId: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        field: "UserID"
      },
      username: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Username"
      },
      userPassword: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "UserPassword"
      },
      privlage: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Privlage"
      }
    },
    {
      tableName: "User",
      timestamps: false
    }
  );
};
