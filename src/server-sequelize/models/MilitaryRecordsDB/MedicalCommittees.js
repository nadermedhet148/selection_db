/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "medicalCommittees",
    {
      committeeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "CommitteeId"
      },
      militaryId: {
        type: DataTypes.STRING,
        allowNull: true,
        references: {
          model: "Conscriptes",
          key: "MilitaryId"
        },
        field: "MilitaryId"
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
      sendCommitteeDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "sendCommitteeDate"
      },
      getKaraSababeyaDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "getKaraSababeyaDate"
      },
      sendLagnetTaawedatDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "sendLagnetTaawedatDate"
      },
      getLagnetTaawedatDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "getLagnetTaawedatDate"
      },
      sendTaameenMaashatDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "sendTaameenMaashatDate"
      },
      comitDecisionId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Committees",
          key: "Id"
        },
        field: "comitDecisionId"
      },
      injuryId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Injuries",
          key: "InjuryId"
        },
        field: "InjuryId"
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
      },
      followedAddedDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "FollowedAddedDate"
      },
      followedEndedDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "FollowedEndedDate"
      }
    },
    {
      tableName: "MedicalCommittees",
      timestamps: false
    }
  );
};
