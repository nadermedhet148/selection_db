const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "Neshan",
    {
      ID: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      SoilderID: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      Noot: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      Ression: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      Orderid: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      Date: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      Notes: {
        type: DataTypes.STRING(50),
        allowNull: false
      }
    },
    {
      sequelize,
      tableName: "Neshan",
      schema: "dbo",
      timestamps: true
      // indexes: [
      //   {
      //     name: "PK_Neshan",
      //     unique: true,
      //     fields: [
      //       { name: "ID" },
      //     ]
      //   },
      // ]
    }
  );
};
