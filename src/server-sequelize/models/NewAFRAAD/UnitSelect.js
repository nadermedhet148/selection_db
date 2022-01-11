const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "UnitSelect",
    {
      UnitID: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      unit: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      SoldierCategory: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      SoldierLevel: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      RecuEndDate: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      KnowledgeLevel: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "UnitSelect",
      schema: "dbo",
      timestamps: true
    }
  );
};
