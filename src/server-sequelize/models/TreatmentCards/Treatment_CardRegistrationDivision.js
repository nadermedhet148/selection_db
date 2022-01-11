/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "treatmentCardRegistrationDivision",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "ID"
      },
      // imagePath: {
      //   type: DataTypes.STRING,
      //   allowNull: true,
      //   field: "imagePath"
      // },
      nationalId: {
        type: DataTypes.STRING,
        allowNull: true,
        references: {
          model: "Conscriptes",
          key: "NationalID"
        },
        field: "NationalID"
      },
      cardNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "CardNumber"
      },
      profileNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "ProfileNumber"
      },
      cardTypeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "CardTypeID"
      },
      renewType: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "RenewType"
      },
      dateOfIssuance: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "DateOfIssuance"
      },
      dateOfRenewal: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "DateOfRenewal"
      },
      dateOfRenewalEnd: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "DateOfRenewalEnd"
      },
      lastMohafzaId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "LastMohafzaID"
      },
      hospitalId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Treatment_HospitalTreatment",
          key: "HospitalID"
        },
        field: "HospitalID"
      },
      certificationId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Treatment_Certification",
          key: "CertificationID"
        },
        field: "CertificationID"
      },
      referencesId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Treatment_References",
          key: "ReferencesID"
        },
        field: "ReferencesID"
      },
      picture: {
        type: "VARBINARY",
        allowNull: true,
        field: "Picture"
      }
    },
    {
      tableName: "Treatment_CardRegistrationDivision",
      timestamps: false
    }
  );
};
