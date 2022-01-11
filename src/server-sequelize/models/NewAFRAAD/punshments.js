const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "punshments",
    {
      count: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      ID: {
        type: DataTypes.STRING(13),
        allowNull: false
      },
      Summryofcrime: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      dateofcrime: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      fromdateofabsens: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      todateofabsens: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      numberofabsensday: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      numberofabsensmonth: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      numberofabsensyear: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      totaloflosctday: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      totaloflosctmonth: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      totaloflosctyear: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      kindofpunshment: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      punshment: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      durationofdaypunshment: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      durationofmonthpunshment: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      durationofyearpunshment: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      fromdateofpunshment: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      todateofpunshment: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      pand: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      responsibleofpunshment: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      degreeofpunshment: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      dateesta7qaqathar: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      datefa3liathar: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      dateesta7qaqradfa3l: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      datefa3liradfa3l: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      total_lost_of_punshment_day: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      total_lost_of_punshment_month: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      total_lost_of_punshment_year: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "punshments",
      schema: "dbo",
      timestamps: true
      // indexes: [
      //   {
      //     name: "IX_punshments",
      //     fields: [
      //       { name: "count" },
      //     ]
      //   },
      //   {
      //     name: "PK_punshments",
      //     unique: true,
      //     fields: [
      //       { name: "count" },
      //     ]
      //   },
      // ]
    }
  );
};
