const { RelationshipType } = require("exceljs");
const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "Soldier",
    {
      ID: {
        type: DataTypes.STRING(13),
        allowNull: false,
        primaryKey: true,
        references: {
          model: "Soldier",
          key: "ID"
        }
      },
      Name: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      TripleNo: {
        type: DataTypes.STRING(14),
        allowNull: true
      },
      RecuRegion: {
        type: DataTypes.STRING(15),
        allowNull: true
      },
      RecuStage: {
        type: DataTypes.STRING(15),
        allowNull: true
      },
      KnowledgeLevel: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      IdentityNo: {
        type: DataTypes.STRING(14),
        allowNull: true
      },
      BirthDate: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      ArrivalDate: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      TestDate: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      Centre: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      Unit: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      Religion: {
        type: DataTypes.STRING(5),
        allowNull: true
      },
      VideoPath: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      Brigade: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      Job: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      FatherJob: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      Tele: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      BrothersCount: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      RelationshipType: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      Note: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      Apprance: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      FocusEvent: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      Mood: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      Talking: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      Drugs: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      GoHospitalBefore: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      HospitalName: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      TakeDrugsBefore: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      DrugName: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      MeetingDescions: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      MeetingMaker: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "Soldier",
      schema: "dbo",
      timestamps: false
      // indexes: [
      //   {
      //     name: "PK_Soldier",
      //     unique: true,
      //     fields: [
      //       { name: "ID" },
      //     ]
      //   },
      // ]
    }
  );
};
