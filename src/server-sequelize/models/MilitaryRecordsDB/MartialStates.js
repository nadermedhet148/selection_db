/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "martialStates",
    {
      martialStateId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "MartialStateId"
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
      tableName: "MartialStates",
      timestamps: false
    }
  );
};
