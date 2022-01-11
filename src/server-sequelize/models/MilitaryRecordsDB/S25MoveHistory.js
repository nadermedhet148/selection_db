/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "s25MoveHistory",
    {
      militaryId: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        references: {
          model: "Conscriptes",
          key: "MilitaryId"
        },
        field: "MilitaryId"
      },
      s25MovedFromId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "S25MovedFromId"
      },
      s25MovedToId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "S25MovedToId"
      },
      moveDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "MoveDate"
      },
      moveResone: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "MoveResone"
      },
      condition: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "Condition"
      },
      rejectionReason: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "RejectionReason"
      },
      idReception: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "IdReception"
      },
      licenseReception: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "LicenseReception"
      },
      ethicalDegree: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "EthicalDegree"
      },
      delegateId: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "DelegateId"
      },
      studyDegree: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "StudyDegree"
      }
    },
    {
      tableName: "S25MoveHistory",
      timestamps: false
    }
  );
};
