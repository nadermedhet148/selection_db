/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "mosarah",
    {
      id: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "ID",
        primaryKey: true
      },
      duty: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Duty"
      },
      dutyId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "DutyID"
      }
    },
    {
      tableName: "Mosarah",
      timestamps: false
    }
  );
};
