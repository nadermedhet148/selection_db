/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "unitSelect",
    {
      unitId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "UnitID",
        primaryKey: true
      },
      unit: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "unit"
      },
      soldierCategory: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "SoldierCategory"
      },
      soldierLevel: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "SoldierLevel"
      },
      recuEndDate: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "RecuEndDate"
      },
      knowledgeLevel: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "KnowledgeLevel"
      }
    },
    {
      tableName: "UnitSelect",
      timestamps: false
    }
  );
};
