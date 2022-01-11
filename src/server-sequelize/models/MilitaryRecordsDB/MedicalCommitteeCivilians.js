/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "medicalCommitteeCivilians",
    {
      key: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "key"
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "name"
      },
      nationalId: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "nationalID"
      },
      telephone: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "telephone"
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "address"
      },
      committeeNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "committeeNumber"
      },
      committeeDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "committeeDate"
      },
      comitDecisionId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "CommitteeCivilans",
          key: "Id"
        },
        field: "comitDecisionId"
      },
      medicalCommitteeTypeId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "MedicalCommitteeTypes",
          key: "Id"
        },
        field: "MedicalCommitteeTypeID"
      },
      notes: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "notes"
      },
      isFollowed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        field: "isFollowed"
      }
    },
    {
      tableName: "MedicalCommitteeCivilians",
      timestamps: false
    }
  );
};
