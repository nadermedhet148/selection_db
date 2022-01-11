const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "Direction",
    {
      Direction_ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      KnowledgeLevel: {
        type: DataTypes.STRING(15),
        allowNull: true
      },
      City: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      Direction: {
        type: DataTypes.STRING(10),
        allowNull: true
      },
      RecuRegion: {
        type: DataTypes.CHAR(10),
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "Direction",
      schema: "dbo",
      timestamps: true
      // indexes: [
      //   {
      //     name: "PK_Direction_1",
      //     unique: true,
      //     fields: [
      //       { name: "Direction_ID" },
      //     ]
      //   },
      // ]
    }
  );
};
