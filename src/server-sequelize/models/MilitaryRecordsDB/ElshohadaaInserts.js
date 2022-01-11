/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "elshohadaaInserts",
    {
      militaryId: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        field: "MilitaryId"
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "name"
      },
      unitId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Units",
          key: "UnitId"
        },
        field: "UnitId"
      },
      deiedDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "DeiedDate"
      },
      aceDetile: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "AceDetile"
      },
      telNum: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "TelNum"
      },
      ldwSegelat: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "LDWSegelat"
      },
      not: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Not"
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Address"
      },
      adDaiAndLost: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "AdDaiAndLost"
      },
      adrMakaber: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "AdrMakaber"
      },
      movedUnit: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "MovedUnit"
      },
      dElEatebarShahid: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "DElEatebarShahid"
      },
      dutyTypeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "DutyTypes",
          key: "DutyTypeID"
        },
        field: "DutyTypeID"
      },
      halaId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "ElHalaas",
          key: "HalaId"
        },
        field: "HalaId"
      },
      degreeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Degrees",
          key: "DegreeId"
        },
        field: "DegreeId"
      },
      desElEtebarShahid: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "DesElEtebarShahid"
      },
      elHarbId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "ElHarbs",
          key: "ElHarbId"
        },
        field: "ElHarbId"
      },
      eldaraga: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "Eldaraga"
      },
      cardDateA: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "CardDateA"
      },
      cardNumA: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "CardNumA"
      },
      newDateA: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "NewDateA"
      },
      cardDateB: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "CardDateB"
      },
      cardNumB: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "CardNumB"
      },
      newDateB: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "NewDateB"
      },
      modifiedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Users",
          key: "UserId"
        },
        field: "ModifiedBy"
      },
      gotTheCard: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        field: "GotTheCard"
      },
      gotTheCard2: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        field: "GotTheCard2"
      }
    },
    {
      tableName: "ElshohadaaInserts",
      timestamps: false
    }
  );
};
