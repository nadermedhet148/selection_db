/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "webConscriptes",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "Id"
      },
      militaryId: {
        type: DataTypes.STRING,
        allowNull: true
      },
      tripartiteNumber: {
        type: DataTypes.STRING,
        allowNull: true
      },
      area: {
        type: DataTypes.STRING,
        allowNull: true
      },
      powers: {
        type: DataTypes.STRING,
        allowNull: true
      },
      fullName: {
        type: DataTypes.STRING,
        allowNull: true
      },
      caltureLevel: {
        type: DataTypes.STRING,
        allowNull: true
      },
      medicalLevel: {
        type: DataTypes.STRING,
        allowNull: true
      },
      conscriptionDate: {
        type: DataTypes.STRING,
        allowNull: true
      },
      force: {
        type: DataTypes.STRING,
        allowNull: true
      },
      jobInArmy: {
        type: DataTypes.STRING,
        allowNull: true
      },
      webServicePeriod: {
        type: DataTypes.STRING,
        allowNull: true
      },
      civilQualificationGroup: {
        type: DataTypes.STRING,
        allowNull: true
      },
      civilQualification: {
        type: DataTypes.STRING,
        allowNull: true
      },
      jobBeforeConscription: {
        type: DataTypes.STRING,
        allowNull: true
      },
      religion: {
        type: DataTypes.STRING,
        allowNull: true
      },
      bloodType: {
        type: DataTypes.STRING,
        allowNull: true
      },
      maritalStatus: {
        type: DataTypes.STRING,
        allowNull: true
      },
      gender: {
        type: DataTypes.STRING,
        allowNull: true
      },
      governorateNationalCardSide: {
        type: DataTypes.STRING,
        allowNull: true
      },
      segelMadany: {
        type: DataTypes.STRING,
        allowNull: true
      },
      nationalId: {
        type: DataTypes.STRING,
        allowNull: true
      },
      governorateBirthSide: {
        type: DataTypes.STRING,
        allowNull: true
      },
      qesm: {
        type: DataTypes.STRING,
        allowNull: true
      },
      region: {
        type: DataTypes.STRING,
        allowNull: true
      },
      birthDate: {
        type: DataTypes.STRING,
        allowNull: true
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true
      },
      highSalaryPayingOutDate: {
        type: DataTypes.STRING,
        allowNull: true
      },
      webDemobilizationDate: {
        type: DataTypes.STRING,
        allowNull: true
      },
      dutyState: {
        type: DataTypes.STRING,
        allowNull: true
      },
      penalitiesCounter: {
        type: DataTypes.STRING,
        allowNull: true
      },
      allUnits: {
        type: DataTypes.STRING,
        allowNull: true
      },
      firstUnit: {
        type: DataTypes.STRING,
        allowNull: true
      },
      lastUnit: {
        type: DataTypes.STRING,
        allowNull: true
      },
      allDegrees: {
        type: DataTypes.STRING,
        allowNull: true
      },
      firstDegree: {
        type: DataTypes.STRING,
        allowNull: true
      },
      lastDegree: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    {
      tableName: "WebConscriptes",
      timestamps: false
    }
  );
};
