/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "conscriptesEndTrmenations",
    {
      militaryId: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        field: "MilitaryId"
      },
      // imagePath: {
      //   type: DataTypes.STRING,
      //   allowNull: true,
      //   field: "imagePath"
      // },
      nationalId: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "NationalID"
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Name"
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "PhoneNumber"
      },
      numberOfSons: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "NumberOfSons"
      },
      numberOfDaughters: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "NumberOfDaughters"
      },
      numberOfWives: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "NumberOfWives"
      },
      nots: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Nots"
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Address"
      },
      dateOfEndTrmenation: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "DateOfEndTrmenation"
      },
      cardTreatmentPersonal: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        field: "CardTreatmentPersonal"
      },
      cardTreatmentParents: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        field: "CardTreatmentParents"
      },
      cardTreatmentFamily: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        field: "CardTreatmentFamily"
      },
      degreeId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Degrees",
          key: "DegreeId"
        },
        field: "DegreeId"
      },
      unitId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Units",
          key: "UnitId"
        },
        field: "UnitId"
      },
      trmenationId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Treatment_EndTrmenation",
          key: "TrmenationID"
        },
        field: "TrmenationID"
      },
      picture: {
        type: "VARBINARY",
        allowNull: true,
        field: "Picture"
      }
    },
    {
      tableName: "ConscriptesEndTrmenations",
      timestamps: false
    }
  );
};
