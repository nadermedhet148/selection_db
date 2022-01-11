const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "tagdidrevsioin",
    {
      id: {
        type: DataTypes.STRING(13),
        allowNull: false,
        primaryKey: true
      },
      rev: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      reason: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "tagdidrevsioin",
      schema: "dbo",
      timestamps: true
      // indexes: [
      //   {
      //     name: "PK_tagdidrevsioin",
      //     unique: true,
      //     fields: [
      //       { name: "id" },
      //     ]
      //   },
      // ]
    }
  );
};
