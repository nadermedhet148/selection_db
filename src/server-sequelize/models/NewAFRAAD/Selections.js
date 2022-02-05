const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "Selections",
    {
      IDKey: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      ID: {
        type: DataTypes.STRING(13),
        allowNull: true
      },
      Name: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      TripleNo: {
        type: DataTypes.STRING(13),
        allowNull: false,
        primaryKey: true
      },
      RecuStage: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      Rigion: {
        type: DataTypes.STRING(20),
        allowNull: true
      },
      CityID: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "City",
          key: "CityID"
        }
      },
      KnowldgeLevel: {
        type: DataTypes.STRING(12),
        allowNull: true
      },
      College: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      Degree: {
        type: DataTypes.STRING(20),
        allowNull: true
      },
      WeaponID: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      UnitID: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      Direction: {
        type: DataTypes.STRING(12),
        allowNull: true
      },
      RigionSuggestion: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      SelectionID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: "SelectionType",
          key: "SelectionID"
        }
      },
      SoldierCategory: {
        type: DataTypes.STRING(12),
        allowNull: true
      },
      GradNo: {
        type: DataTypes.STRING(12),
        allowNull: true
      },
      MehanyType: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      attendanceNo: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      InspectionDate: {
        type: DataTypes.STRING(10),
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "Selections",
      schema: "dbo",
      timestamps: false
      // indexes: [
      //   {
      //     name: "PK_Selections_1",
      //     unique: true,
      //     fields: [
      //       { name: "ID" },
      //       { name: "TripleNo" },
      //       { name: "SelectionID" },
      //     ]
      //   },
      // ]
    }
  );
};
