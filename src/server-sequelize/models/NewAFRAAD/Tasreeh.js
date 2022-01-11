const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "Tasreeh",
    {
      Date: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      Unit: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      Supp: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      sequelize,
      tableName: "Tasreeh",
      schema: "dbo",
      timestamps: true
    }
  );
};
