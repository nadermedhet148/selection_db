const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "City",
    {
      CityID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      City: {
        type: DataTypes.STRING(20),
        allowNull: true
      },
      Rigion: {
        type: DataTypes.STRING(12),
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "City",
      schema: "dbo",
      timestamps: false
      // indexes: [
      //   {
      //     name: "PK_City",
      //     unique: true,
      //     fields: [
      //       { name: "CityID" },
      //     ]
      //   },
      // ]
    }
  );
};
