/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "situationStates",
    {
      situationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        field: "SituationID"
      },
      situation: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Situation"
      }
    },
    {
      tableName: "SituationStates",
      timestamps: false
    }
  );
};
