/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "errands",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "id"
      },
      militaryId: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "MilitaryId"
      },
      degreeId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Degrees",
          key: "DegreeId"
        },
        field: "DegreeId"
      },
      fullName: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "FullName"
      },
      unitId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Units",
          key: "UnitId"
        },
        field: "UnitId"
      },
      recordingDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "RecordingDate"
      },
      officeId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "OfficeId"
      },
      errandsDateId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "ErrandsGroups",
          key: "ErrandsDateId"
        },
        field: "ErrandsDateId"
      },
      adminAcceptance: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "AdminAcceptance"
      },
      rejectionReanson: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "RejectionReanson"
      },
      following: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "Following"
      },
      dutyTypeId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "DutyTypes",
          key: "DutyTypeID"
        },
        field: "DutyTypeID"
      },
      recordingsOfficeId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "RecordingsOfficeId"
      },
      expectedReplyId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "ExpectedReplyID"
      },
      expectedReplayText: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "ExpectedReplayText"
      },
      errandLogId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "ErrandLogId"
      },
      theServiceId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "ErrandServices",
          key: "Id"
        },
        field: "TheServiceID"
      },
      reaction: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Reaction"
      },
      rejectionDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "RejectionDate"
      }
    },
    {
      tableName: "Errands",
      timestamps: false
    }
  );
};
