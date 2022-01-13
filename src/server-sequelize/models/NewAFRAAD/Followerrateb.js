const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "Followerrateb",
    {
      ID: {
        type: DataTypes.STRING(50),
        allowNull: false,
        primaryKey: true
      },
      Orderoffolwer: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      followplace: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      workplace: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      Suputer: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      notes: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      uintid: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      TarekhElhak: {
        type: DataTypes.DATEONLY,
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "Followerrateb",
      schema: "dbo",
      timestamps: false
      // indexes: [
      //   {
      //     name: "PK_Followerrateb",
      //     unique: true,
      //     fields: [
      //       { name: "ID" },
      //     ]
      //   },
      // ]
    }
  );
};
