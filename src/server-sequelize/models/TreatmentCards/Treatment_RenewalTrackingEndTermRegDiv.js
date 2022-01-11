/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "treatmentRenewalTrackingEndTermRegDiv",
    {
      renewalTrackingId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "RenewalTrackingID"
      },
      // imagePath: {
      //   type: DataTypes.STRING,
      //   allowNull: true,
      //   field: "imagePath"
      // },
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
      mohafzaId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "MohafzaID"
      },
      notes: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Notes"
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
      cardTypeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "CardTypeID"
      },
      renewType: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "RenewType"
      },
      picture: {
        type: "VARBINARY",
        allowNull: true,
        field: "Picture"
      },
      nationalId: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "NationalId"
      }
    },
    {
      tableName: "Treatment_RenewalTrackingEndTermRegDiv",
      timestamps: false
    }
  );
};
