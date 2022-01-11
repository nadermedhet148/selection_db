/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "selections",
    {
      idKey: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "IDKey"
      },
      id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        field: "ID"
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Name"
      },
      tripleNo: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "TripleNo"
      },
      recuStage: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "RecuStage"
      },
      rigion: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Rigion"
      },
      cityId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "CityID"
      },
      knowldgeLevel: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "KnowldgeLevel"
      },
      college: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "College"
      },
      degree: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Degree"
      },
      weaponId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "WeaponID"
      },
      unitId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "UnitID"
      },
      direction: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Direction"
      },
      rigionSuggestion: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "RigionSuggestion"
      },
      selectionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "SelectionType",
          key: "SelectionID"
        },
        field: "SelectionID"
      },
      soldierCategory: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "SoldierCategory"
      },
      gradNo: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "GradNo"
      },
      mehanyType: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "MehanyType"
      },
      attendanceNo: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "attendanceNo"
      },
      inspectionDate: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "InspectionDate"
      }
    },
    {
      tableName: "Selections",
      timestamps: false
    }
  );
};
