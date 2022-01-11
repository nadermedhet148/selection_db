const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "Motabaa",
    {
      NoMsg: {
        type: DataTypes.STRING(50),
        allowNull: false,
        primaryKey: true
      },
      Direction: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      Partion: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      DateofMsg: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      Modoat: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      Karar: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      EgraaMotakhas: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      Motaba: {
        type: DataTypes.STRING(50),
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "Motabaa",
      schema: "dbo",
      timestamps: true
      // indexes: [
      //   {
      //     name: "PK_Motabaa",
      //     unique: true,
      //     fields: [
      //       { name: "NoMsg" },
      //     ]
      //   },
      // ]
    }
  );
};
