/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "duty",
    {
      dutyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "DutyID"
      },
      duty: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Duty"
      }
    },
    {
      tableName: "Duty",
      timestamps: false
    }
  );
};
