const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "Tankolat",
    {
      TblID: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      ID: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      Daraga: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      Name: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      Category: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      FromUnit: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      ToUnit: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      Ketaa: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      LeaveDate: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      Note: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      UnitID: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      KetaaID: {
        type: DataTypes.INTEGER,
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "Tankolat",
      schema: "dbo",
      timestamps: true
      // indexes: [
      //   {
      //     name: "PK_Tankolat",
      //     unique: true,
      //     fields: [
      //       { name: "TblID" },
      //     ]
      //   },
      // ]
    }
  );
};
