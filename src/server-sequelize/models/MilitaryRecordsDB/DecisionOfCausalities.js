/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "decisionOfCausalities",
    {
      decisionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "DecisionId"
      },
      decisionTxt: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "DecisionTxt"
      }
    },
    {
      tableName: "DecisionOfCausalities",
      timestamps: false
    }
  );
};
