/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "spareSoldiers",
    {
      id: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "ID",
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Name"
      },
      degree: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Degree"
      },
      centreId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "CentreID"
      },
      cityId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "CityID"
      },
      unitId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "UnitID"
      },
      dutyId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "DutyID"
      },
      knowldgeLevel: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "KnowldgeLevel"
      },
      planType: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "PlanType"
      },
      spareDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: "SpareDate"
      },
      notes: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Notes"
      },
      refusingState: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "RefusingState"
      },
      fromDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: "From_Date"
      },
      toDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: "To_Date"
      },
      catergory: {
        type: "NCHAR",
        allowNull: true,
        field: "Catergory"
      }
    },
    {
      tableName: "SpareSoldiers",
      timestamps: false
    }
  );
};
