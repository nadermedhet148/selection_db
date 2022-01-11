/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "users",
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "UserId"
      },
      username: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "username"
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "password"
      },
      realName: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "RealName"
      },
      degree: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Degree"
      },
      role: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "Role"
      },
      section: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "section"
      },
      dateAdded: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "DateAdded"
      }
    },
    {
      tableName: "Users",
      timestamps: false
    }
  );
};
