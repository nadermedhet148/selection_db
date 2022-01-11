/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "ratebzzz",
    {
      id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        field: "ID"
      },
      ratebLevel: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "RatebLevel"
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Name"
      },
      unitId: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "UnitID"
      },
      volunteeringDate: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "VolunteeringDate"
      },
      satrtingSarefRateb: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "SatrtingSarefRateb"
      },
      f7: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "F7"
      },
      f8: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "F8"
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Address"
      },
      dutyId: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "DutyID"
      },
      ratebCategory: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "RatebCategory"
      },
      supplyingRigion: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "SupplyingRigion"
      }
    },
    {
      tableName: "Ratebzzz",
      timestamps: false
    }
  );
};
