/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "treatmentReferences",
    {
      referencesId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "ReferencesID"
      },
      referencesText: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "ReferencesTEXT"
      }
    },
    {
      tableName: "Treatment_References",
      timestamps: false
    }
  );
};
