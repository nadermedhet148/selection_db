/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "treatmentEndTrmenation",
    {
      trmenationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "TrmenationID"
      },
      trmenationName: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "TrmenationName"
      }
    },
    {
      tableName: "Treatment_EndTrmenation",
      timestamps: false
    }
  );
};
