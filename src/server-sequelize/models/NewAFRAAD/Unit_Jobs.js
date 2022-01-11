const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "Unit_Jobs",
    {
      Unit_ID: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      UNIT_NAME: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      Gehat_Emdad: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      Khedma_Type: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      Feaa_Code: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      Geha_Name: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      Geha_ID: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      Job: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      Darga: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      Khedma_Darga_Type: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      ID: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      }
    },
    {
      sequelize,
      tableName: "Unit_Jobs",
      schema: "dbo",
      timestamps: true
      // indexes: [
      //   {
      //     name: "PK_Unit_Jobs",
      //     unique: true,
      //     fields: [
      //       { name: "ID" },
      //     ]
      //   },
      // ]
    }
  );
};
