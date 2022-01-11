/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "lostPeriodStates",
    {
      stateId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "StateId"
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
      tableName: "LostPeriodStates",
      timestamps: false
    }
  );
};
