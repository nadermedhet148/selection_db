const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "prevlevelup",
    {
      count: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      id: {
        type: DataTypes.STRING(13),
        allowNull: false,
        primaryKey: true
      },
      level: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      date_level: {
        type: DataTypes.DATEONLY,
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "prevlevelup",
      schema: "dbo",
      timestamps: true
    }
  );
};
