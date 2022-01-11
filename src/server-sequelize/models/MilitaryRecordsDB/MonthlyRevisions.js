/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "monthlyRevisions",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "Id"
      },
      unitId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Units",
          key: "UnitId"
        },
        field: "UnitId"
      },
      representativeName: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "RepresentativeName"
      },
      notes: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Notes"
      },
      attendanceDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "AttendanceDate"
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "EndDate"
      },
      month: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: "1900-01-01T00:00:00.000",
        references: {
          model: "SelectMonths",
          key: "MovingMonth"
        },
        field: "Month"
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "PhoneNumber"
      }
    },
    {
      tableName: "MonthlyRevisions",
      timestamps: false
    }
  );
};
