/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "courts",
    {
      courtId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "CourtId"
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
      courtDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "CourtDate"
      },
      crimeSummary: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "CrimeSummary"
      },
      prosecutionAppear: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "ProsecutionAppear"
      },
      courtAppear: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "CourtAppear"
      },
      accusedState: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "AccusedState"
      },
      judgment: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Judgment"
      },
      judgmentDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "JudgmentDate"
      },
      judgmentExtractDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "JudgmentExtractDate"
      },
      s161Date: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "S161Date"
      },
      executionWritDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "ExecutionWritDate"
      },
      isFollowed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        field: "IsFollowed"
      },
      imprisonFrom: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "ImprisonFrom"
      },
      imprisonTo: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "ImprisonTo"
      },
      prosecutionFrom: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "ProsecutionFrom"
      },
      prosecutionTo: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "ProsecutionTo"
      },
      endingDutyStudy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "EndingDutyStudy"
      },
      releaseDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "ReleaseDate"
      },
      isUnCompleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: "0",
        field: "IsUnCompleted"
      },
      demobilizationStudy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "DemobilizationStudy"
      },
      medicalSituation: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "MedicalSituation"
      },
      lastUnitReply: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "LastUnitReply"
      },
      lastBranchReply: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "LastBranchReply"
      },
      notes: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Notes"
      },
      courtConfermation: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "CourtConfermation"
      },
      courtReduction: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "CourtReduction"
      },
      lastNoticeDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "LastNoticeDate"
      },
      notifyBranchDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "NotifyBranchDate"
      },
      lastShbka: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "LastShbka"
      },
      pYear: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "P_Year"
      },
      pMonth: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "P_Month"
      },
      pDay: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "P_Day"
      },
      notFollowingEhtyat: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        field: "notFollowingEhtyat"
      },
      contDuty: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        field: "ContDuty"
      },
      endDutyNotes: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "EndDutyNotes"
      },
      reductionYear: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "Reduction_Year"
      },
      reductionMonth: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "Reduction_Month"
      },
      reductionDay: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "Reduction_Day"
      },
      forgiveYear: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "Forgive_Year"
      },
      forgiveMonth: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "Forgive_Month"
      },
      forgiveDay: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "Forgive_Day"
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
      afradId: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "AfradId"
      },
      crimeStartDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "CrimeStartDate"
      },
      crimeEndDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "CrimeEndDate"
      },
      // جريمة مخلة بالشرف
      isDishonorable: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        field: "IsDishonorable"
      },
      // جريمة تمس أمن وسلامة القوات المسلحة
      isForSecurity: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        field: "IsForSecurity"
      }
    },
    {
      tableName: "Courts",
      timestamps: false
    }
  );
};
