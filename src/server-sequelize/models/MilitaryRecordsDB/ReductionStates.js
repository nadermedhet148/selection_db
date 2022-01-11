/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "reductionStates",
    {
      reductionStateId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "ReductionStateId"
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
      tableName: "ReductionStates",
      timestamps: false
    }
  );
};
