/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "dutyTerminations",
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
      termReasonDetails: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "TermReasonDetails"
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
      s170SendDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "S170SendDate"
      },
      s170ReceiveDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "S170ReceiveDate"
      },
      termFormSendDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "TermFormSendDate"
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
      fitnessDiagnosis: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "FitnessDiagnosis"
      },
      termFormIssueDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "TermFormIssueDate"
      },
      notes: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Notes"
      },
      s20SendToUnitDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "S20SendToUnitDate"
      },
      ekhlaToEdaraDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "EkhlaToEdaraDate"
      },
      ekhlaFromEdaraDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "EkhlaFromEdaraDate"
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
      gond5Exemption: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "Gond5Exemption"
      },
      facultyConfirmationDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "FacultyConfirmationDate"
      },
      gond5Faculty: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "Gond5Faculty"
      },
      lastProsecutionDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "LastProsecutionDate"
      },
      medicalCommitteeIssueDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "MedicalCommitteeIssueDate"
      },
      finished: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: "0",
        field: "Finished"
      },
      recieveConfirmation: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        field: "RecieveConfirmation"
      },
      unitInform: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        field: "UnitInform"
      },
      lastJudgment: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "LastJudgment"
      },
      insuranceConfirmationDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "InsuranceConfirmationDate"
      },
      s26SendDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "S26SendDate"
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
      certificateNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "CertificateNumber"
      },
      termFormReciever: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "TermFormReciever"
      },
      notesEnhaa: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "notesEnhaa"
      },
      termDateByPromotion: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "TermDateByPromotion"
      }
    },
    {
      tableName: "DutyTerminations",
      timestamps: false
    }
  );
};
