/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "accidents",
    {
      accidentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "AccidentId"
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
      accidentDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "AccidentDate"
      },
      summary: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Summary"
      },
      unitProcedures: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "UnitProcedures"
      },
      recordsBranchProcedures: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "RecordsBranchProcedures"
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
        defaultValue: "0",
        field: "IsFollowed"
      },
      state: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "State"
      },
      isUnCompleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: "0",
        field: "IsUnCompleted"
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
      committeeId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Committees",
          key: "Id"
        },
        field: "CommitteeId"
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
      demobilizationStudy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "DemobilizationStudy"
      },
      lastNoticeDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "LastNoticeDate"
      },
      lastcomisionpreviewdate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "lastcomisionpreviewdate"
      },
      myProperty: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: "((0))",
        field: "MyProperty"
      },
      committeeNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "CommitteeNumber"
      },
      notifyBranchDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "NotifyBranchDate"
      }
    },
    {
      tableName: "Accidents",
      timestamps: false
    }
  );
};
