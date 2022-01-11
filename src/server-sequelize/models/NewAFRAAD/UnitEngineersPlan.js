const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "UnitEngineersPlan",
    {
      ID: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      UnitId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      Stage: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      Arch: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      Civil: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      Power: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      Elect: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      Com: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      PlanName: {
        type: DataTypes.STRING(50),
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "UnitEngineersPlan",
      schema: "dbo",
      timestamps: true
      // indexes: [
      //   {
      //     name: "PK_UnitEngineersPlan.",
      //     unique: true,
      //     fields: [
      //       { name: "ID" },
      //     ]
      //   },
      // ]
    }
  );
};
