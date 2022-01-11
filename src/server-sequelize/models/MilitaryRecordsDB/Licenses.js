/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "licenses",
    {
      licenseId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "LicenseId"
      },
      licenseType: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "LicenseType"
      }
    },
    {
      tableName: "Licenses",
      timestamps: false
    }
  );
};
