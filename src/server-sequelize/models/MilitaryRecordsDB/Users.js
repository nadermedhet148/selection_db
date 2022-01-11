/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "users",
    {
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
      role: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "Role"
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "UserId"
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
      section: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: "((0))",
        field: "section"
      },
      dateAdded: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "DateAdded"
      },
      isVisible: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: "0",
        field: "isVisible"
      },
      canUnfollow: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: "0",
        field: "CanUnfollow"
      },
      canAddFollowup: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: "0",
        field: "CanAddFollowup"
      }
    },
    {
      tableName: "Users",
      timestamps: false
    }
  );
};
