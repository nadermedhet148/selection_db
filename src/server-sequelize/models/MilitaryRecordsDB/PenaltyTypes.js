/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "penaltyTypes",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "id"
      },
      displayText: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "displayText"
      },
      afradId: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "AfradId"
      }
    },
    {
      tableName: "PenaltyTypes",
      timestamps: false
    }
  );
};
