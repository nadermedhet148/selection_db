const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "chat",
    {
      ID: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      Sender: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      Message: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      DateOfMessage: {
        type: DataTypes.DATE,
        allowNull: false
      }
    },
    {
      sequelize,
      tableName: "chat",
      schema: "dbo",
      timestamps: false
      // indexes: [
      //   {
      //     name: "PK_chat",
      //     unique: true,
      //     fields: [
      //       { name: "ID" },
      //     ]
      //   },
      // ]
    }
  );
};
