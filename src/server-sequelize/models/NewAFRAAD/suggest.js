const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "suggest",
    {
      UnitID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: "Unit",
          key: "UnitID"
        }
      },
      RecuStage: {
        type: DataTypes.STRING(50),
        allowNull: false,
        primaryKey: true
      },
      PayWar: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      PayPolitics: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      ExistWithoutHighPay: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      ReleasedOne: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      TotalAfterRelease: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      NWarOne: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      NPoliticsOne: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      High: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      AboveAvg: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      Avg: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      Normal: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      Total: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      AfterSupply: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      NwarTwo: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      NPoliticsTwo: {
        type: DataTypes.STRING(50),
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "suggest",
      schema: "dbo",
      timestamps: false
      // indexes: [
      //   {
      //     name: "PK_suggest",
      //     unique: true,
      //     fields: [
      //       { name: "UnitID" },
      //       { name: "RecuStage" },
      //     ]
      //   },
      // ]
    }
  );
};
