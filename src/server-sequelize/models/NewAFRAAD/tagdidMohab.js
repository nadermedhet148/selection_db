const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "tagdidMohab",
    {
      ID: {
        type: DataTypes.STRING(13),
        allowNull: false,
        primaryKey: true
      },
      tareekh1: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      layakon: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      date2: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      tareekh3: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      type: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      WeaponID: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      Weapon: {
        type: DataTypes.STRING(50),
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "tagdidMohab",
      schema: "dbo",
      timestamps: false
      // indexes: [
      //   {
      //     name: "PK_tagdidMohab",
      //     unique: true,
      //     fields: [
      //       { name: "ID" },
      //     ]
      //   },
      // ]
    }
  );
};
