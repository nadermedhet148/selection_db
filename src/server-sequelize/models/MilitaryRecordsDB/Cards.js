module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "cards",
    {
      // id: {
      //   type: DataTypes.INTEGER,
      //   allowNull: false,
      //   primaryKey: true,
      //   autoIncrement: true,
      //   field: "Id"
      // },
      // conscripteId: {
      //   type: DataTypes.INTEGER,
      //   allowNull: true,
      //   references: {
      //     model: "CardsConscriptes",
      //     key: "Id"
      //   },
      //   field: "ConscripteId"
      // },
      // fileNum: {
      //   type: DataTypes.INTEGER,
      //   allowNull: true,
      //   field: "FileNum"
      // },
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "Id"
      },
      cardNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: false,
        //primaryKey: true,
        field: "CardNumber"
      },
      consMilitaryId: {
        type: DataTypes.STRING(128),
        allowNull: true,
        references: {
          model: "Conscriptes",
          key: "MilitaryId"
        },
        field: "ConsMilitaryId"
      },
      fileNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "FileNumber"
      },
      dateOfIssurance: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: "DateOfIssurance"
      },
      typeId: {
        type: DataTypes.INTEGER,
        field: "typeId",
        references: {
          model: "CardTypes",
          key: "Id"
        }
      },
      isCanceled: {
        type: DataTypes.BOOLEAN,
        fieled: "isCanceled",
        allowNull: true
      },
      cancelationReason: {
        type: DataTypes.STRING,
        field: "cancelationReason",
        allowNull: true
      }
      // 0 => personal,
      // 1 => family in service
      // 2 => family out service
      // 3 => parents
      // cardType: {
      //   type: DataTypes.INTEGER,
      //   allowNull: true,
      //   field: "CardType"
      // },

      /*// 0 => أول أصدار,
      // 1 => تجديد,
      // 2 => بدل فاقد
      renewType: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "RenewType"
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
      sectionId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Sections",
          key: "Id"
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
      imagePath: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "ImagePath"
      }
      },*/
    },
    {
      tableName: "Cards",
      timestamps: false
    }
  );
};
