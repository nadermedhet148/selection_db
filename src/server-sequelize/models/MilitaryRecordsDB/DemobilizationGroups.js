/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "demobilizationGroups",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "Id"
      },
      demobilizationDate: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "DemobilizationDate"
      },
      type: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Type"
      },
      afradId: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "AfradId"
      }
    },
    {
      tableName: "DemobilizationGroups",
      timestamps: false
    }
  );
};
