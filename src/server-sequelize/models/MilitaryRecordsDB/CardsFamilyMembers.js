module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "cardsFamilyMembers",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "Id"
      },
      nationalId: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
        field: "NationalId"
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Name"
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
      motherId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "CardsFamilyMembers",
          key: "Id"
        },
        field: "MotherId"
      },
      familyTypeRelId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "CardsFamilyTypeRel",
          key: "Id"
        },
        field: "FamilyTypeRelId"
      },
      birthDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: "BirthDate"
      },
      isDeserve: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        field: "IsDeserve"
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Address"
      },
      isRetired: {
        // I don't use it right now
        type: DataTypes.BOOLEAN,
        allowNull: true,
        field: "IsRetired"
      },
      pensionVal: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "PensionVal"
      },

      /**
       * mariageStates: [
       * { title: "متزوجه", value: 1 },
       * { title: "مطلقه", value: 2 },
       * { title: "ارمله", value: 3 }
       * ],
       */
      marriageState: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "MarriageState"
      },
      marriageDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: "MarriageDate"
      },
      divorceDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: "DivorceDate"
      },
      documentNum: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "DocumentNum"
      },
      religionId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Religions",
          key: "Id"
        },
        field: "ReligionId"
      },
      nationalityId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Nationalities",
          key: "Id"
        },
        field: "NationalityId"
      },
      governorateId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Governorates",
          key: "Id"
        },
        field: "governorateId"
      },
      job: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Job"
      },
      /*cardNum: {
        type: DataTypes.STRING,
        allowNull: true,
        references: {
          model: "Cards",
          key: "CardNumber"
        },
        field: "CardNum"
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
      isDead: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        field: "IsDead"
      },
      imagePath: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "ImagePath"
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "PhoneNumber"
      }
    },
    {
      tableName: "CardsFamilyMembers",
      timestamps: false
    }
  );
};
