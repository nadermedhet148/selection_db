const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "Duty",
    {
      DutyID: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      Duty: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "Duty",
      schema: "dbo",
      timestamps: false
      // indexes: [
      //   {
      //     name: "PK_Duty",
      //     unique: true,
      //     fields: [
      //       { name: "DutyID" },
      //     ]
      //   },
      // ]
    }
  );
};
