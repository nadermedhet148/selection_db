const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "Unit",
    {
      UnitID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      Unit: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      Directionforunit: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      SupplyLayer: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      ordering: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      DirectionforFeaat: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      General_Direction: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      OrderingFeaat: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      TaabeaaCode: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      DirectionForSM: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      tamrkoz: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      statue: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "Unit",
      schema: "dbo",
      timestamps: true
      // indexes: [
      //   {
      //     name: "PK_Unit",
      //     unique: true,
      //     fields: [
      //       { name: "UnitID" },
      //     ]
      //   },
      // ]
    }
  );
};
