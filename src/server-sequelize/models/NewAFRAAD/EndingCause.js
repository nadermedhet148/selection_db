const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "EndingCause",
    {
      ID: {
        type: DataTypes.STRING(13),
        allowNull: true,
        primaryKey: true
      },
      Reason: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      State: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "EndingCause",
      schema: "dbo",
      timestamps: true
    }
  );
};
