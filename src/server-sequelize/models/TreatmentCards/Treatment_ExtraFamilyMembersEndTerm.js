/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "treatmentExtraFamilyMembersEndTerm",
    {
      militaryIdConscript: {
        type: DataTypes.STRING,
        allowNull: true,
        references: {
          model: "ConscriptesEndTrmenations",
          key: "MilitaryId"
        },
        field: "MilitaryIdConscript"
      },
      // imagePath: {
      //   type: DataTypes.STRING,
      //   allowNull: true,
      //   field: "imagePath"
      // },
      typeId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "TypeID"
      },
      fullName: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "FullName"
      },
      birthDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "BirthDate"
      },
      deserve: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        field: "Deserve"
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Address"
      },
      teleNum: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "TeleNum"
      },
      inMa3Ash: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        field: "inMa3ash"
      },
      ma3AshAmount: {
        type: DataTypes.FLOAT,
        allowNull: true,
        field: "ma3ashAmount"
      },
      marriageStateId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "MarriageStateID"
      },
      watheqaNum: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "WatheqaNum"
      },
      marriageDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "MarriageDate"
      },
      divorceDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "DivorceDate"
      },
      religionId: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "ReligionID"
      },
      nationalityId: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "NationalityID"
      },
      mohafzaId: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "MohafzaId"
      },
      picture: {
        type: "VARBINARY",
        allowNull: true,
        field: "Picture"
      },
      nationalId: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "",
        primaryKey: true,
        field: "NationalID"
      },
      nationalIdParent: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "NationalIdParent"
      },
      jobId: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "JobID"
      },
      cardNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "cardNumber"
      },
      isDead: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        field: "isDead"
      }
    },
    {
      tableName: "Treatment_ExtraFamilyMembersEndTerm",
      timestamps: false
    }
  );
};
