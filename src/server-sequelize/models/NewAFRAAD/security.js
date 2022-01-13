const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "security",
    {
      id: {
        type: DataTypes.STRING(13),
        allowNull: false,
        primaryKey: true
      },
      security: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      decision: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "security",
      schema: "dbo",
      timestamps: false
      // indexes: [
      //   {
      //     name: "PK_security",
      //     unique: true,
      //     fields: [
      //       { name: "id" },
      //     ]
      //   },
      // ]
    }
  );
};
