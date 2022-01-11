const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "DriversArrival",
    {
      KnowledgeLevel: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      Date: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      NumberofArrivals: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      Planned: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      RecuStage: {
        type: DataTypes.STRING(50),
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "DriversArrival",
      schema: "dbo",
      timestamps: true
    }
  );
};
