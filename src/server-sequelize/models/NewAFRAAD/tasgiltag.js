const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "tasgiltag",
    {
      id: {
        type: DataTypes.STRING(13),
        allowNull: false,
        primaryKey: true
      },
      datetg1: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      todatetag1: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      datetg2: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      todatetag: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      datees1: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      datees2: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      layakon1: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      layakon2: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      datefaalitag1: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      datefaalitag2: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      rev: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      reason: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      date_recivefromuint: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      date_sendfromuint: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      weapon: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      RatebCategory: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      type_tagdid: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      dateestaqaq: {
        type: DataTypes.STRING(50),
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "tasgiltag",
      schema: "dbo",
      timestamps: true
      // indexes: [
      //   {
      //     name: "PK_tasgiltag",
      //     unique: true,
      //     fields: [
      //       { name: "id" },
      //     ]
      //   },
      // ]
    }
  );
};
