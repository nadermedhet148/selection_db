const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "MkzanMohab",
    {
      ID: {
        type: DataTypes.STRING(13),
        allowNull: true,
        primaryKey: true
      },
      akdmia: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      hafza: {
        type: DataTypes.STRING(100),
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "MkzanMohab",
      schema: "dbo",
      timestamps: false
    }
  );
};
