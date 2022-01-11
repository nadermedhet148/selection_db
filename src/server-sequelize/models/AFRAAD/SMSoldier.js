/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "smSoldier",
    {
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
      indexNo: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "IndexNo"
      },
      tripleNo: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "TripleNo"
      },
      weaponId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Weapon",
          key: "WeaponID"
        },
        field: "WeaponID"
      },
      unitId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Unit",
          key: "UnitID"
        },
        field: "UnitID"
      },
      duty: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Duty"
      },
      soldierCategory: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "SoldierCategory"
      },
      soldierLevel: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "SoldierLevel"
      },
      recuRegion: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "RecuRegion"
      },
      knowLedgeLevel: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "KnowLedgeLevel"
      },
      recuStartDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: "RecuStartDate"
      },
      recuStage: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "RecuStage"
      },
      recuTreat: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "RecuTreat"
      },
      recuEndDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: "RecuEndDate"
      },
      soldierStatus: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "SoldierStatus"
      },
      endingCause: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "EndingCause"
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "image"
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Address"
      },
      identityNo: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "IdentityNo"
      },
      birthDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: "BirthDate"
      },
      college: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "College"
      },
      specialization: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Specialization"
      },
      cityId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "City",
          key: "CityID"
        },
        field: "CityID"
      },
      centreId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Centre",
          key: "CentreID"
        },
        field: "CentreID"
      },
      soldierTele: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "SoldierTELE"
      },
      relecantTele: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "RelecantTELE"
      },
      job: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Job"
      },
      religion: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Religion"
      },
      bloodType: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "BloodType"
      },
      direction: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Direction"
      },
      directionforunit: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Directionforunit"
      },
      arrivalDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: "ArrivalDate"
      },
      notes: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Notes"
      },
      tahtEltawze3: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "TahtEltawze3"
      },
      serviceType: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "ServiceType"
      },
      gha: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "GHA"
      },
      driverLevel: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "DriverLevel"
      },
      treatment: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Treatment"
      },
      revision: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        field: "Revision"
      },
      brotherId: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "BrotherID"
      }
    },
    {
      tableName: "SMSoldier",
      timestamps: false
    }
  );
};
