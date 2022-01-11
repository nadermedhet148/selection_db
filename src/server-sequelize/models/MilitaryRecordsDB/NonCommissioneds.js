/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "nonCommissioneds",
    {
      militaryId: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        references: {
          model: "Conscriptes",
          key: "MilitaryId"
        },
        field: "MilitaryId"
      },
      nationalId: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "NationalId"
      },
      birthday: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "Birthday"
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Phone"
      },
      highSalaryPayingOutDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "HighSalaryPayingOutDate"
      },
      currentPromotionDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "CurrentPromotionDate"
      },
      currentUnitJoiningDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "CurrentUnitJoiningDate"
      },
      wifeCount: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "WifeCount"
      },
      sonsCount: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "SonsCount"
      },
      daughtersCount: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "DaughtersCount"
      },
      governorate: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "Governorate"
      },
      checkup40: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "Checkup40"
      },
      medicalLevel: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "MedicalLevel"
      },
      specialization: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "Specialization"
      },
      bloodType: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "BloodType"
      },
      religion: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "Religion"
      },
      parents: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "Parents"
      },
      qualification: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "Qualification"
      },
      oldNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "OldNumber"
      }
    },
    {
      tableName: "NonCommissioneds",
      timestamps: false
    }
  );
};
