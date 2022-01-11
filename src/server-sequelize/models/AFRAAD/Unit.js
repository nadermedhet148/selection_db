/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "unit",
    {
      unitId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        field: "UnitID"
      },
      unit: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Unit"
      },
      directionforunit: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Directionforunit"
      },
      supplyLayer: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "SupplyLayer"
      },
      ordering: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "ordering"
      },
      directionforFeaat: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "DirectionforFeaat"
      },
      generalDirection: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "General_Direction"
      },
      orderingFeaat: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "OrderingFeaat"
      },
      taabeaaCode: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "TaabeaaCode"
      },
      directionForSm: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "DirectionForSM"
      },
      tamrkoz: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "tamrkoz"
      }
    },
    {
      tableName: "Unit",
      timestamps: false
    }
  );
};
