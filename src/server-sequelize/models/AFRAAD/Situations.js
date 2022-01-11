/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "situations",
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
      situationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "SituationStates",
          key: "SituationID"
        },
        field: "SituationID"
      },
      situationNotes: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "SituationNotes"
      },
      contnuity: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "Contnuity"
      }
    },
    {
      tableName: "Situations",
      timestamps: false
    }
  );
};
