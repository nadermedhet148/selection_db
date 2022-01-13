const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "SelectionSoldier",
    {
      SerialNo: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      RecommenderA: {
        type: DataTypes.STRING(250),
        allowNull: true
      },
      RecommenderB: {
        type: DataTypes.STRING(250),
        allowNull: true
      },
      RecommenderC: {
        type: DataTypes.STRING(250),
        allowNull: true
      },
      Certificator: {
        type: DataTypes.STRING(250),
        allowNull: true
      },
      RecoDegree: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      RecoAWeaponID: {
        type: DataTypes.STRING(250),
        allowNull: true
      },
      RecoBWeaponID: {
        type: DataTypes.STRING(250),
        allowNull: true
      },
      RecommdationText: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      RecommenderUnit: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      FinalDegree: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      FinalWeaponID: {
        type: DataTypes.STRING(250),
        allowNull: true
      },
      Matching: {
        type: DataTypes.STRING(5),
        allowNull: true
      },
      IDKey: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      Notes: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      SelectionID: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      FinalResult: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      SendingDate: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      Acceptance: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      SoldierRecuStage: {
        type: DataTypes.STRING(12),
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "SelectionSoldier",
      schema: "dbo",
      timestamps: false
      // indexes: [
      //   {
      //     name: "PK_SoldierSelections",
      //     unique: true,
      //     fields: [
      //       { name: "SerialNo" },
      //     ]
      //   },
      // ]
    }
  );
};
