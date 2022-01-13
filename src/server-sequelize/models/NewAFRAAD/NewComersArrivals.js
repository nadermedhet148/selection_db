const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "NewComersArrivals",
    {
      RecuRegion: {
        type: DataTypes.STRING(20),
        allowNull: false
      },
      KnowledgeLevel: {
        type: DataTypes.STRING(20),
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
      RecuStage: {
        type: DataTypes.STRING(50),
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "NewComersArrivals",
      schema: "dbo",
      timestamps: false
    }
  );
};
