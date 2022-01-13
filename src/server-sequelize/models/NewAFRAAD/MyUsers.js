const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "MyUsers",
    {
      UserName: {
        type: DataTypes.STRING(60),
        allowNull: false
      },
      Password: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      ID: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      Role: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      Name: {
        type: DataTypes.STRING(50),
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "MyUsers",
      schema: "dbo",
      timestamps: false
      // indexes: [
      //   {
      //     name: "PK_MyUsers",
      //     unique: true,
      //     fields: [
      //       { name: "ID" },
      //     ]
      //   },
      // ]
    }
  );
};
