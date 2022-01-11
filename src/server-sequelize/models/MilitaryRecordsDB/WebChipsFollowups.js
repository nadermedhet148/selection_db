/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "webChipsFollowups",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "Id"
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
      startDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "StartDate"
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "EndDate"
      },
      conscripteType: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "ConscripteType"
      },
      chipType: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "ChipType"
      },
      fullName: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "FullName"
      },
      degree: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Degree"
      },
      reductionPeriod: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "ReductionPeriod"
      },
      orderDate: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "OrderDate"
      },
      specialism: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Specialism"
      },
      absenceDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "AbsenceDate"
      },
      fugitiveNoticeDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "FugitiveNoticeDate"
      },
      notes: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Notes"
      },
      returnDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "ReturnDate"
      },
      returnNoticeDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "ReturnNoticeDate"
      },
      firstLicenceNumber: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "FirstLicenceNumber"
      },
      firstLicenceDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "FirstLicenceDate"
      },
      secondLicenceNumber: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "SecondLicenceNumber"
      },
      secondLicenceDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "SecondLicenceDate"
      },
      lastComsionDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "LastComsionDate"
      },
      qualification: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Qualification"
      },
      seatNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "SeatNumber"
      },
      qualificationDegree: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "QualificationDegree"
      },
      governorate: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Governorate"
      },
      markaz: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Markaz"
      },
      fromDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "FromDate"
      },
      toDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "ToDate"
      },
      ignorantDegree: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "IgnorantDegree"
      },
      cardNumber: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "CardNumber"
      },
      cardDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "CardDate"
      },
      unit: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Unit"
      },
      force: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Force"
      },
      promotionType: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "PromotionType"
      },
      country: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Country"
      },
      confirmer: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Confirmer"
      },
      reason: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Reason"
      },
      newType: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "NewType"
      },
      isDone: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: "0",
        field: "isDone"
      },
      isCreatedByBot: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: "0",
        field: "isCreatedByBot"
      },
      orderNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "OrderNumber"
      }
    },
    {
      tableName: "WebChipsFollowups",
      timestamps: false
    }
  );
};
