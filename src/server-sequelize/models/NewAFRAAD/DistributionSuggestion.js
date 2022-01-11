const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "DistributionSuggestion",
    {
      UnitID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Unit",
          key: "UnitID"
        }
      },
      RecuStage: {
        type: DataTypes.STRING(50),
        allowNull: false
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
      NWarTwo: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      NPoliticsTwo: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      PlanName: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      isDeleted: {
        type: DataTypes.STRING(50),
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "DistributionSuggestion",
      schema: "dbo",
      timestamps: true
      // indexes: [
      //   {
      //     name: "IX_DistributionSuggestion",
      //     fields: [
      //       { name: "UnitID" },
      //     ]
      //   },
      // ]
    }
  );
};
