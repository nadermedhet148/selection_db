const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "Weapon",
    {
      WeaponID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      Weapon: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      Markez_Tadreb: {
        type: DataTypes.STRING(50),
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "Weapon",
      schema: "dbo",
      timestamps: true
      // indexes: [
      //   {
      //     name: "PK_Weapon",
      //     unique: true,
      //     fields: [
      //       { name: "WeaponID" },
      //     ]
      //   },
      // ]
    }
  );
};
