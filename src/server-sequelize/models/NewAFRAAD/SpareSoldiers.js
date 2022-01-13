const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "SpareSoldiers",
    {
      ID: {
        type: DataTypes.STRING(13),
        allowNull: true,
        primaryKey: true
      },
      Name: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      Degree: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      CentreID: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      CityID: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      UnitID: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      DutyID: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      KnowldgeLevel: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      PlanType: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      SpareDate: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      Notes: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      RefusingState: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      From_Date: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      To_Date: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      Catergory: {
        type: DataTypes.CHAR(10),
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "SpareSoldiers",
      schema: "dbo",
      timestamps: false
    }
  );
};
