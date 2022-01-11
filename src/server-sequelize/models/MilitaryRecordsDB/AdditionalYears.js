/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "additionalYears",
    {
      additionalYearStateId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "AdditionalYearStateId"
      },
      state: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "State"
      },
      afradId: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "AfradId"
      }
    },
    {
      tableName: "AdditionalYears",
      timestamps: false
    }
  );
};
