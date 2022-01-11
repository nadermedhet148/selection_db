const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "DiscountTime",
    {
      ID: {
        type: DataTypes.INTEGER,
        allowNull: true,
        primaryKey: true
      },
      TimeDiscount: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      DateTimeBefore: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      DataTimeAfter: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "DiscountTime",
      schema: "dbo",
      timestamps: true
    }
  );
};
