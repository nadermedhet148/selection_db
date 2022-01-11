/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "militaryCardMovements",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "Id"
      },
      renewId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "MilitaryCardRenews",
          key: "Id"
        },
        field: "RenewId"
      },
      movementDate: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "MovementDate"
      },
      from: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "From"
      },
      to: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "To"
      },
      state: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "State"
      },
      rejectionReasons: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "RejectionReasons"
      },
      delegate: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Delegate"
      },
      notes: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Notes"
      }
    },
    {
      tableName: "MilitaryCardMovements",
      timestamps: false
    }
  );
};
