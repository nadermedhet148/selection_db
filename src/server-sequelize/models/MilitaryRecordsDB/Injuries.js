/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "injuries",
    {
      injuryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "InjuryId"
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
      injuryDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "InjuryDate"
      },
      summary: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Summary"
      },
      diagnosis: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Diagnosis"
      },
      notes: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Notes"
      },
      isFollowed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        field: "IsFollowed"
      },
      caseType: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: "((0))",
        field: "CaseType"
      },
      isUnCompleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: "0",
        field: "IsUnCompleted"
      },
      casePlace: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: "((0))",
        field: "CasePlace"
      },
      sequestratorId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Sequestrators",
          key: "Id"
        },
        field: "SequestratorId"
      },
      healingReportId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "HealingReports",
          key: "Id"
        },
        field: "HealingReportId"
      },
      lastUnitReply: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "LastUnitReply"
      },
      demobilizationStudy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "DemobilizationStudy"
      },
      notifyBranchDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "NotifyBranchDate"
      },
      lastShabaka: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "LastShabaka"
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
      },
      injuryAttachments: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "InjuryAttachments"
      }
      // medicalCommitteeId: {
      //   type: DataTypes.INTEGER,
      //   allowNull: true,
      //   references: {
      //     model: "MedicalCommittees",
      //     key: "CommitteeId"
      //   },
      //   field: "MedicalCommitteeId"
      // }
    },
    {
      tableName: "Injuries",
      timestamps: false
    }
  );
};
