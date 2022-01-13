const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "SMDriversSuggestion",
    {
      UnitID: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      RFardi: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: "0"
      },
      RGmai: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: "0"
      },
      SHA: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: "0"
      },
      Qtal: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: "0"
      },
      T2meen: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: "0"
      },
      As3af: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: "0"
      },
      Warsha: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: "0"
      },
      Nagda: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: "0"
      },
      Itfaa: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: "0"
      },
      Hamr: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: "0"
      },
      Moghaza: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: "0"
      },
      Modr3a: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: "0"
      },
      TotalHamar: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: "0"
      },
      Total3agl: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: "0"
      },
      Total: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: "0"
      },
      ImdadHamar: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: "0"
      },
      Imdad3agl: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: "0"
      },
      ImdadTotal: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: "0"
      },
      RecuStage: {
        type: DataTypes.STRING(50),
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "SMDriversSuggestion",
      schema: "dbo",
      timestamps: false
    }
  );
};
