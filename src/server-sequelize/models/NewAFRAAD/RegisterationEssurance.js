const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "RegisterationEssurance",
    {
      Dist: {
        type: DataTypes.STRING(50),
        allowNull: false,
        primaryKey: true
      },
      High: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        primaryKey: true
      },
      AboveAvg: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        primaryKey: true
      },
      Avg: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        primaryKey: true
      },
      Normal: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        primaryKey: true
      },
      Sum: {
        type: DataTypes.STRING(50),
        allowNull: false,
        primaryKey: true
      },
      ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true
      },
      Notes: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      Stage: {
        type: DataTypes.STRING(50),
        allowNull: false,
        primaryKey: true
      }
    },
    {
      sequelize,
      tableName: "RegisterationEssurance",
      schema: "dbo",
      timestamps: true
      // indexes: [
      //   {
      //     name: "PK_RegisterationEssurance_1",
      //     unique: true,
      //     fields: [
      //       { name: "Dist" },
      //       { name: "High" },
      //       { name: "AboveAvg" },
      //       { name: "Avg" },
      //       { name: "Normal" },
      //       { name: "Sum" },
      //       { name: "Stage" },
      //     ]
      //   },
      // ]
    }
  );
};
