const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "Centre",
    {
      CentreID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      Centre: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      CityID: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "City",
          key: "CityID"
        }
      }
    },
    {
      sequelize,
      tableName: "Centre",
      schema: "dbo",
      timestamps: true
      // indexes: [
      //   {
      //     name: "PK_Centre",
      //     unique: true,
      //     fields: [
      //       { name: "CentreID" },
      //     ]
      //   },
      // ]
    }
  );
};
