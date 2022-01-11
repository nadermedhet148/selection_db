/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "treatmentCertification",
    {
      certificationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "CertificationID"
      },
      certificationText: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "CertificationTEXT"
      }
    },
    {
      tableName: "Treatment_Certification",
      timestamps: false
    }
  );
};
