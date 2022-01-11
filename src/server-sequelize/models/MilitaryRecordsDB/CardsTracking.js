module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "cardsTracking",
    {
      trackingId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "TrackingId"
      },
      // "_" => to make a different name for this column so sequelize can understand the relation
      /*_cardNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        references: {
          model: "Cards",
          key: "CardNumber"
        },
        field: "_CardNumber"
      },*/
      cardId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Cards",
          key: "Id"
        },
        field: "cardId"
      },
      hospitalId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "CardsHospitals",
          key: "Id"
        },
        field: "HospitalId"
      },
      officeId: {
        // instead of mohafzaId which means which office generate this card
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Offices",
          key: "Id"
        },
        field: "OfficeId"
      },
      notes: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Notes"
      },
      sectionId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Sections",
          key: "id"
        },
        field: "SectionId"
      },
      referenceId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Users",
          key: "UserId"
        },
        field: "ReferenceId"
      },
      certificantId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "CardsCertificants",
          key: "Id"
        },
        field: "CertificantId"
      },
      // 0 => أول أصدار,
      // 1 => تجديد,
      // 2 => بدل فاقد
      renewType: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "RenewType"
      },
      dateOfRenewal: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: "DateOfRenewal"
      },
      dateOfExpiration: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: "DateOfExpiration"
      },
      imagePath: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "ImagePath"
      }
    },
    {
      tableName: "CardsTracking",
      timestamps: false
    }
  );
};
