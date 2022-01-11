/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "fugitiveLogs",
    {
      militaryId: {
        type: DataTypes.STRING,
        allowNull: true,
        references: {
          model: "Conscriptes",
          key: "MilitaryId"
        },
        field: "MilitaryId"
      },
      isNonCommissioned: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        field: "IsNonCommissioned"
      },
      returnDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "ReturnDate"
      },
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "Id"
      },
      absenceDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "AbsenceDate"
      },
      absenceOrder: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "AbsenceOrder"
      },
      strikeoffDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "StrikeoffDate"
      },
      strikeOffOrder: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "StrikeOffOrder"
      },
      returnOrder: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "ReturnOrder"
      },
      s1ReceptionDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "S1ReceptionDate"
      },
      s1SendToUnitDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "S1SendToUnitDate"
      },
      nameMostalem: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "nameMostalem"
      },
      degreeMostalemId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Degrees",
          key: "DegreeId"
        },
        field: "degreeMostalemId"
      },
      s1Attachments: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "S1Attachments"
      },
      s1AttachmentsBefore1Year: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "S1_ATTACHMENTS_Before1Year"
      },
      s1AttachmentsAfter21Days: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "S1_ATTACHMENTS_After21Days"
      },
      personAttendanceDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "PersonAttendanceDate"
      },
      overAgeAttachments: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "OverAgeAttachments"
      },
      managementReceptionDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "ManagementReceptionDate"
      },
      s1ExecutionCommiteeDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "S1ExecutionCommiteeDate"
      },
      journalNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "JournalNumber"
      },
      serialNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "SerialNumber"
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "PhoneNumber"
      },
      isContinued: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: "0",
        field: "IsContinued"
      },
      branchNoticeDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "BranchNoticeDate"
      },
      unitNoticeDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "UnitNoticeDate"
      },
      s116ReceptionDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "s116ReceptionDate"
      },
      notes: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Notes"
      },
      unitText: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "UnitText"
      },
      filmNumberFugitive: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "filmNumberFugitive"
      },
      sequenceNumberFugitive: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "sequenceNumberFugitive"
      }
    },
    {
      tableName: "FugitiveLogs",
      timestamps: false
    }
  );
};
