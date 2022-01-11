/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "dutyTerminationNonCommissioneds",
    {
      militaryId: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        references: {
          model: "Conscriptes",
          key: "MilitaryId"
        },
        field: "MilitaryId"
      },
      termReason: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "TermReason"
      },
      termReasonDetails: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "TermReasonDetails"
      },
      fitnessDiagnosis: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "FitnessDiagnosis"
      },
      notes: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Notes"
      },
      termDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "TermDate"
      },
      s20IssueDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "S20issueDate"
      },
      s20ConfirmationDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "S20ConfirmationDate"
      },
      recieveConfirmation: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        field: "RecieveConfirmation"
      },
      s20SendToUnitDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "S20SendToUnitDate"
      },
      unitInform: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        field: "UnitInform"
      },
      decReasonabilitySendDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "decReasonabilitySendDate"
      },
      decReasonabilityReceiveDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "decReasonabilityReceiveDate"
      },
      s170ReceiveDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "S170ReceiveDate"
      },
      s170SendDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "S170SendDate"
      },
      termFormIssueDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "TermFormIssueDate"
      },
      termFormSendDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "TermFormSendDate"
      },
      deathDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "DeathDate"
      },
      deathFormIssueDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "DeathFormIssueDate"
      },
      martyrFormReceiveDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "MartyrFormReceiveDate"
      },
      martyrFormSendDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "MartyrFormSendDate"
      },
      martyrFormReceiveDate2: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "MartyrFormReceiveDate2"
      },
      lastProsecutionDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "LastProsecutionDate"
      },
      lastJudgment: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "LastJudgment"
      },
      medicalCommitteeIssueDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "MedicalCommitteeIssueDate"
      },
      insuranceConfirmationDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "InsuranceConfirmationDate"
      },
      insuranceDepSendDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "InsuranceDepSendDate"
      },
      insurancePrivetBoxSendDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "InsurancePrivetBoxSendDate"
      },
      insuranceSupplySendDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "InsuranceSupplySendDate"
      },
      compensationSendDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "CompensationSendDate"
      },
      compensationReceiveDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "CompensationReceiveDate"
      },
      finished: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        field: "Finished"
      },
      promotionConfirmationDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "PromotionConfirmationDate"
      },
      promotionRecieveDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "PromotionRecieveDate"
      },
      promotionInformDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "PromotionInformDate"
      },
      message6Monthes: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "Message6Monthes"
      },
      message4Monthes: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "Message4Monthes"
      },
      medicalCard: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "MedicalCard"
      },
      militaryCard: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "MilitaryCard"
      },
      drivingLicence: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "DrivingLicence"
      },
      s26SendDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "S26SendDate"
      }
    },
    {
      tableName: "DutyTerminationNonCommissioneds",
      timestamps: false
    }
  );
};
