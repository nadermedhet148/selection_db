const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "References",
    {
      referenceID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        references: {
          model: "References",
          key: "referenceID"
        }
      },
      title: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      path: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "References",
      schema: "dbo",
      timestamps: false
    }
  );
};
