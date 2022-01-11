const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "followersolider",
    {
      ID: {
        type: DataTypes.STRING(50),
        allowNull: false,
        primaryKey: true
      },
      Orderoffolwer: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      followplace: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      workplace: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      Suputer: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      notes: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      stage: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      uintid: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      TarekhElhak: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      SoldierStatus: {
        type: DataTypes.STRING(50),
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "followersolider",
      schema: "dbo",
      timestamps: true
      // indexes: [
      //   {
      //     name: "PK_followersolider",
      //     unique: true,
      //     fields: [
      //       { name: "ID" },
      //     ]
      //   },
      // ]
    }
  );
};
