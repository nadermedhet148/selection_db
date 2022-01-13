const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "TravalTable",
    {
      ID: {
        type: DataTypes.STRING(50),
        allowNull: false,
        primaryKey: true
      },
      TravalDistination: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      TravalType: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      TravalDateFrom: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      TravalDateTo: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      Travalintadab: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      AmanaNum: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "TravalTable",
      schema: "dbo",
      timestamps: false
      // indexes: [
      //   {
      //     name: "PK_TravalTable",
      //     unique: true,
      //     fields: [
      //       { name: "ID" },
      //     ]
      //   },
      // ]
    }
  );
};
