/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "errandMaessages",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "id"
      },
      messageCode: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "MessageCode"
      },
      subject: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Subject"
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
      recordingsOfficeId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "RecordingsOfficeId"
      },
      expectedReplayText: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "ExpectedReplayText"
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
      errandLogId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "ErrandLogId"
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
      tableName: "ErrandMaessages",
      timestamps: false
    }
  );
};
