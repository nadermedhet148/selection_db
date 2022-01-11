/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "situationDecision",
    {
      id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        references: {
          model: "Soldier",
          key: "ID"
        },
        field: "ID"
      },
      situationDecision: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "SituationDecision"
      },
      situationDecisionOwner: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "SituationDecisionOwner"
      },
      situationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "SituationStates",
          key: "SituationID"
        },
        field: "SituationID"
      },
      situationDate: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "SituationDate"
      },
      serialNo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "SerialNo"
      }
    },
    {
      tableName: "SituationDecision",
      timestamps: false
    }
  );
};
