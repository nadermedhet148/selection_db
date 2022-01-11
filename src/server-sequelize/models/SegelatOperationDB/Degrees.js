/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "degrees",
    {
      degreeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "DegreeID"
      },
      degreeText: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "DegreeText"
      }
    },
    {
      tableName: "Degrees",
      timestamps: false
    }
  );
};
