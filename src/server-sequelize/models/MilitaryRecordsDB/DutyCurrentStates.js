/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "dutyCurrentStates",
    {
      stateId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        field: "StateId"
      },
      text: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Text"
      },
      afradId: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "AfradId"
      }
    },
    {
      tableName: "DutyCurrentStates",
      timestamps: false
    }
  );
};
