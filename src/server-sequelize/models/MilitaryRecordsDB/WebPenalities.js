/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "webPenalities",
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
      date: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "Date"
      },
      crimeText: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "CrimeText"
      },
      crimeFromDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "CrimeFromDate"
      },
      crimeToDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "CrimeToDate"
      },
      periodInDays: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "PeriodInDays"
      },
      ordererId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "WebPenalityOrderers",
          key: "Id"
        },
        field: "OrdererId"
      },
      kindId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "WebPenalityKinds",
          key: "Id"
        },
        field: "KindId"
      },
      withSalaryCut: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        field: "WithSalaryCut"
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
      orderNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "OrderNumber"
      },
      orderDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "OrderDate"
      },
      typeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "WebPenalityTypes",
          key: "Id"
        },
        field: "TypeId"
      },
      isCourt: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        field: "IsCourt"
      },
      courtDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "CourtDate"
      },
      courtPlaceId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "WebCourtPlaces",
          key: "Id"
        },
        field: "CourtPlaceId"
      }
    },
    {
      tableName: "WebPenalities",
      timestamps: false
    }
  );
};
