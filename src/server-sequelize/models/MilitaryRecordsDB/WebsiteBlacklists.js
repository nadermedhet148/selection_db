/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "websiteBlacklists",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "Id"
      },
      title: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Title"
      },
      url: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Url"
      },
      isExcludedForOurUsername: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        default: "0",
        field: "IsExcludedForOurUsername"
      },
      excludedUsers: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "ExcludedUsers"
      },
      msg: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Msg"
      },
      isDisabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        default: "0",
        field: "IsDisabled"
      }
    },
    {
      tableName: "WebsiteBlacklists",
      timestamps: false
    }
  );
};
