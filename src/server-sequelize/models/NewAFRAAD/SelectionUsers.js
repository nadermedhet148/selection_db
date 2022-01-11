const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "SelectionUsers",
    {
      UserID: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      UserName: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      UserPassword: {
        type: DataTypes.STRING(50),
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "SelectionUsers",
      schema: "dbo",
      timestamps: true
      // indexes: [
      //   {
      //     name: "PK_SelectionUsers",
      //     unique: true,
      //     fields: [
      //       { name: "UserID" },
      //     ]
      //   },
      // ]
    }
  );
};
