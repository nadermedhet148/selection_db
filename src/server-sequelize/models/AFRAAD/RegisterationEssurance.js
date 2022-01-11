/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "registerationEssurance",
    {
      dist: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        field: "Dist"
      },
      high: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: "((0))",
        field: "High"
      },
      aboveAvg: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: "((0))",
        field: "AboveAvg"
      },
      avg: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: "((0))",
        field: "Avg"
      },
      normal: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: "((0))",
        field: "Normal"
      },
      sum: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "Sum"
      },
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "ID"
      },
      notes: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "Notes"
      },
      stage: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "Stage"
      }
    },
    {
      tableName: "RegisterationEssurance",
      timestamps: false
    }
  );
};
