const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "Grade",
    {
      ID: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      SoliderID: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      Year: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      Nesba_Number: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      From_Date: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      To_Date: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      Note: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      Grade_Text: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      Mosdak: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "Grade",
      schema: "dbo",
      timestamps: false
      // indexes: [
      //   {
      //     name: "PK_Grade",
      //     unique: true,
      //     fields: [
      //       { name: "ID" },
      //     ]
      //   },
      // ]
    }
  );
};
