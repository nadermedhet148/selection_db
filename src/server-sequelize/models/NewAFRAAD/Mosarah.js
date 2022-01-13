const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "Mosarah",
    {
      ID: {
        type: DataTypes.STRING(13),
        allowNull: true,
        primaryKey: true
      },
      Duty: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      DutyID: {
        type: DataTypes.INTEGER,
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "Mosarah",
      schema: "dbo",
      timestamps: false
    }
  );
};
