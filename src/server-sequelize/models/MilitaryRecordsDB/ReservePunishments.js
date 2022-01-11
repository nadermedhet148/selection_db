/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "reservePunishments",
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
          model: "RecordsPrintVerifies",
          key: "MilitaryId"
        },
        field: "MilitaryId"
      },
      lostDays: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "LostDays"
      },
      lostMonths: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "LostMonths"
      },
      lostYears: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "LostYears"
      },
      points: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "Points"
      },
      crime: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Crime"
      },
      crimeType: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: "((0))",
        field: "CrimeType"
      },
      crimeDate: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: "1900-01-01T00:00:00.000",
        field: "CrimeDate"
      },
      punishmentDate: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: "1900-01-01T00:00:00.000",
        field: "PunishmentDate"
      },
      branchNoticeDate: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: "1900-01-01T00:00:00.000",
        field: "branchNoticeDate"
      },
      managementNoticeDate: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: "1900-01-01T00:00:00.000",
        field: "ManagementNoticeDate"
      },
      recordPunishmentState: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: "((0))",
        field: "RecordPunishmentState"
      },
      absenceDays: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: "((0))",
        field: "AbsenceDays"
      },
      punishment: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Punishment"
      },
      punishmentType: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: "((0))",
        field: "PunishmentType"
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
      }
    },
    {
      tableName: "ReservePunishments",
      timestamps: false
    }
  );
};
