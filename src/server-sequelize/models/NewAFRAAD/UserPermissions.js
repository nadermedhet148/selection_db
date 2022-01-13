const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "UserPermissions",
    {
      ID: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "MyUsers",
          key: "ID"
        },
        unique: "unq_t"
      },
      PermId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Permissions",
          key: "ID"
        },
        unique: "unq_t"
      }
    },
    {
      sequelize,
      tableName: "UserPermissions",
      schema: "dbo",
      timestamps: false
      // indexes: [
      //   {
      //     name: "PK_UserPermissions",
      //     unique: true,
      //     fields: [
      //       { name: "ID" },
      //     ]
      //   },
      //   {
      //     name: "unq_t",
      //     unique: true,
      //     fields: [
      //       { name: "UserId" },
      //       { name: "PermId" },
      //     ]
      //   },
      // ]
    }
  );
};
