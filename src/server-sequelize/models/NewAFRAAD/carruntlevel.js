const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "carruntlevel",
    {
      id: {
        type: DataTypes.STRING(50),
        allowNull: false,
        primaryKey: true
      },
      RatebCategory: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      nextlevel: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      date_esta7qaq: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      date_fa3li: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      layakon1: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      reason: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      rev: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      date_recivefromuint: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      date_sendfromuint: {
        type: DataTypes.STRING(50),
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "carruntlevel",
      schema: "dbo",
      timestamps: true
      // indexes: [
      //   {
      //     name: "PK_carruntlevel",
      //     unique: true,
      //     fields: [
      //       { name: "id" },
      //     ]
      //   },
      // ]
    }
  );
};
