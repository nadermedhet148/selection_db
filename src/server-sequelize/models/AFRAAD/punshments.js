/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "punshments",
    {
      count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "count"
      },
      id: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "ID"
      },
      summryofcrime: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Summryofcrime"
      },
      dateofcrime: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: "dateofcrime"
      },
      fromdateofabsens: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: "fromdateofabsens"
      },
      todateofabsens: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: "todateofabsens"
      },
      numberofabsensday: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "numberofabsensday"
      },
      numberofabsensmonth: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "numberofabsensmonth"
      },
      numberofabsensyear: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "numberofabsensyear"
      },
      totaloflosctday: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "totaloflosctday"
      },
      totaloflosctmonth: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "totaloflosctmonth"
      },
      totaloflosctyear: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "totaloflosctyear"
      },
      kindofpunshment: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "kindofpunshment"
      },
      punshment: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "punshment"
      },
      durationofdaypunshment: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "durationofdaypunshment"
      },
      durationofmonthpunshment: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "durationofmonthpunshment"
      },
      durationofyearpunshment: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "durationofyearpunshment"
      },
      fromdateofpunshment: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: "fromdateofpunshment"
      },
      todateofpunshment: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: "todateofpunshment"
      },
      pand: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "pand"
      },
      responsibleofpunshment: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "responsibleofpunshment"
      },
      notes: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "notes"
      },
      degreeofpunshment: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "degreeofpunshment"
      },
      dateesta7Qaqathar: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: "dateesta7qaqathar"
      },
      datefa3Liathar: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: "datefa3liathar"
      },
      dateesta7Qaqradfa3L: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: "dateesta7qaqradfa3l"
      },
      datefa3Liradfa3L: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: "datefa3liradfa3l"
      },
      totalLostOfPunshmentDay: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "total_lost_of_punshment_day"
      },
      totalLostOfPunshmentMonth: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "total_lost_of_punshment_month"
      },
      totalLostOfPunshmentYear: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "total_lost_of_punshment_year"
      }
    },
    {
      tableName: "punshments",
      timestamps: false
    }
  );
};
