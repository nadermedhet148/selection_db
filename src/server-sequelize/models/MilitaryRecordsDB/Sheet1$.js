/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "sheet1",
    {
      lostPeriodStateid: {
        type: DataTypes.FLOAT,
        allowNull: true,
        field: "LostPeriodStateid"
      },
      typeId: {
        type: DataTypes.FLOAT,
        allowNull: true,
        field: "TypeId"
      },
      licenseId: {
        type: DataTypes.FLOAT,
        allowNull: true,
        field: "LicenseId"
      },
      reductionStateId: {
        type: DataTypes.FLOAT,
        allowNull: true,
        field: "ReductionStateId"
      },
      martialStateId: {
        type: DataTypes.FLOAT,
        allowNull: true,
        field: "MartialStateId"
      },
      zoneId: {
        type: DataTypes.FLOAT,
        allowNull: true,
        field: "ZoneId"
      },
      stateId: {
        type: DataTypes.FLOAT,
        allowNull: true,
        field: "StateId"
      },
      periodId: {
        type: DataTypes.FLOAT,
        allowNull: true,
        field: "PeriodId"
      },
      forceId: {
        type: DataTypes.FLOAT,
        allowNull: true,
        field: "ForceId"
      },
      unitId: {
        type: DataTypes.FLOAT,
        allowNull: true,
        field: "UnitId"
      },
      additionalYearStateId: {
        type: DataTypes.FLOAT,
        allowNull: true,
        field: "AdditionalYearStateId"
      },
      groupId: {
        type: DataTypes.FLOAT,
        allowNull: true,
        field: "GroupId"
      },
      jobId: {
        type: DataTypes.FLOAT,
        allowNull: true,
        field: "JobId"
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Address"
      },
      qualificationId: {
        type: DataTypes.FLOAT,
        allowNull: true,
        field: "QualificationId"
      },
      tripartiteNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "TripartiteNumber"
      },
      demobilizationDate: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "DemobilizationDate"
      },
      conscriptionDate: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "ConscriptionDate"
      },
      fullName: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "FullName"
      },
      degreeId: {
        type: DataTypes.FLOAT,
        allowNull: true,
        field: "DegreeId"
      },
      areaId: {
        type: DataTypes.FLOAT,
        allowNull: true,
        field: "AreaId"
      },
      militaryId: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "MilitaryId"
      }
    },
    {
      tableName: "Sheet1$",
      timestamps: false
    }
  );
};
