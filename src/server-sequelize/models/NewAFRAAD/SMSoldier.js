const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "SMSoldier",
    {
      ID: {
        type: DataTypes.STRING(100),
        allowNull: false,
        primaryKey: true
      },
      Name: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      IndexNo: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      TripleNo: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      WeaponID: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Weapon",
          key: "WeaponID"
        }
      },
      UnitID: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Unit",
          key: "UnitID"
        }
      },
      Duty: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      SoldierCategory: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      SoldierLevel: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      RecuRegion: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      KnowLedgeLevel: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      RecuStartDate: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      RecuStage: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      RecuTreat: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      RecuEndDate: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      SoldierStatus: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      EndingCause: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      image: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      Address: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      IdentityNo: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      BirthDate: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      College: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      Specialization: {
        type: DataTypes.STRING(50),
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
      CentreID: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Centre",
          key: "CentreID"
        }
      },
      SoldierTELE: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      RelecantTELE: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      Job: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      Religion: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      BloodType: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      Direction: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      Directionforunit: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      ArrivalDate: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      Notes: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      TahtEltawze3: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      ServiceType: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      GHA: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      DriverLevel: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      Treatment: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      Revision: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      BrotherID: {
        type: DataTypes.STRING(20),
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "SMSoldier",
      schema: "dbo",
      timestamps: true
      // indexes: [
      //   {
      //     name: "PK_SMSoldier",
      //     unique: true,
      //     fields: [
      //       { name: "ID" },
      //     ]
      //   },
      // ]
    }
  );
};
