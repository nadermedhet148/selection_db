const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "RatebX",
    {
      F1: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      F2: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      F3: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      F4: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      F5: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      F6: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      F7: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      F8: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      F9: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      F10: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      F11: {
        type: DataTypes.STRING(255),
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "RatebX",
      schema: "dbo",
      timestamps: true
    }
  );
};
