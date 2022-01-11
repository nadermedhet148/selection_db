/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "calendarDegrees",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "Id"
      },
      displayedText: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "DisplayedText"
      },
      color: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Color"
      }
    },
    {
      tableName: "CalendarDegrees",
      timestamps: false
    }
  );
};
