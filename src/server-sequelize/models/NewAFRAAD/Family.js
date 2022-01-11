const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "Family",
    {
      ID: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      SoliderID: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      Name: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      Drga: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      CenterID: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      Date: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      Tel: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      Address: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      Ya3wl: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      DateofBirth: {
        type: DataTypes.DATEONLY,
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "Family",
      schema: "dbo",
      timestamps: true
      // indexes: [
      //   {
      //     name: "PK_Family",
      //     unique: true,
      //     fields: [{ name: "ID" }]
      //   }
      // ]
    }
  );
};
