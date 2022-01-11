/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "exemptions",
    {
      exemptionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "ExemptionId"
      },
      militaryId: {
        type: DataTypes.STRING,
        allowNull: true,
        references: {
          model: "Conscriptes",
          key: "MilitaryId"
        },
        field: "MilitaryId"
      },
      exemptionDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "ExemptionDate"
      },
      exemptionReason: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "ExemptionReason"
      },
      decision: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Decision"
      },
      isFollowed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        field: "IsFollowed"
      },
      notes: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Notes"
      },
      isUnCompleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: "0",
        field: "IsUnCompleted"
      },
      confirmationId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "ConfirmationId"
      },
      s5ReceptionDate: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: "1900-01-01T00:00:00.000",
        field: "S5ReceptionDate"
      },
      afradId: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "AfradId"
      }
    },
    {
      tableName: "Exemptions",
      timestamps: false
    }
  );
};
