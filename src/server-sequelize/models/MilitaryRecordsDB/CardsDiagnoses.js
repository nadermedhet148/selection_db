module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "cardsDiagnoses",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "Id"
      },
      memberId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "CardsFamilyMembers",
          key: "Id"
        },
        field: "MemberId"
      },
      committeNum: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "CommitteNum"
      },
      committeDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: "CommiteDate"
      },
      diagnosis: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Diagnosis"
      },
      decision: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: "Decision"
      },
      // last is Deserve will overiden the rest
      isDeserve: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        field: "IsDeserve"
      },
      imagePath: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "ImagePath"
      }
    },
    {
      tableName: "CardsDiagnoses",
      timestamps: false
    }
  );
};
