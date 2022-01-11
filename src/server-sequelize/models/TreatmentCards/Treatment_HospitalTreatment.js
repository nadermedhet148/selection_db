/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "treatmentHospitalTreatment",
    {
      hospitalId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "HospitalID"
      },
      hospitalType: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "HospitalType"
      }
    },
    {
      tableName: "Treatment_HospitalTreatment",
      timestamps: false
    }
  );
};
