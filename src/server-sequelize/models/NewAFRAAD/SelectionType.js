const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "SelectionType",
    {
      SelectionID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      Selection: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "SelectionType",
      schema: "dbo",
      timestamps: false
      // indexes: [
      //   {
      //     name: "PK_SelectionType",
      //     unique: true,
      //     fields: [
      //       { name: "SelectionID" },
      //     ]
      //   },
      // ]
    }
  );
};
