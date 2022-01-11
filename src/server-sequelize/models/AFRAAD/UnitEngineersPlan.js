/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "unitEngineersPlan",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "ID"
      },
      unitId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "UnitId"
      },
      stage: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "Stage"
      },
      arch: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "Arch"
      },
      civil: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "Civil"
      },
      power: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "Power"
      },
      elect: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "Elect"
      },
      com: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "Com"
      },
      planName: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "PlanName"
      }
    },
    {
      tableName: "UnitEngineersPlan",
      timestamps: false
    }
  );
};
