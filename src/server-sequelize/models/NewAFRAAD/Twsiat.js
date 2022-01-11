const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "Twsiat",
    {
      Code: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true
      },
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
      KnowledgeLevel: {
        type: DataTypes.STRING(15),
        allowNull: true
      },
      College: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      City: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      Unit: {
        type: DataTypes.STRING(100),
        allowNull: false,
        primaryKey: true
      },
      RecuRegion: {
        type: DataTypes.STRING(15),
        allowNull: true
      },
      Direction: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      Recommender: {
        type: DataTypes.STRING(100),
        allowNull: false,
        primaryKey: true
      },
      Certificator: {
        type: DataTypes.STRING(100),
        allowNull: false,
        primaryKey: true
      },
      Notes: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      TripleNo1: {
        type: DataTypes.STRING(4),
        allowNull: true
      },
      TripleNo2: {
        type: DataTypes.STRING(3),
        allowNull: true
      },
      TripleNo3: {
        type: DataTypes.STRING(4),
        allowNull: true
      },
      Certification: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      Matching: {
        type: DataTypes.STRING(50),
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "Twsiat",
      schema: "dbo",
      timestamps: true
      // indexes: [
      //   {
      //     name: "PK_Twsiat_1",
      //     unique: true,
      //     fields: [
      //       { name: "ID" },
      //       { name: "Unit" },
      //       { name: "Recommender" },
      //       { name: "Certificator" },
      //     ]
      //   },
      // ]
    }
  );
};
