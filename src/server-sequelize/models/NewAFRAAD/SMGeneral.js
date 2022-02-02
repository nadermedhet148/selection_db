const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "SMGeneral",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      El_Moratab: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      Siasa: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      Feaa_Code: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      UNIT_NAME: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      GEHA_NAME: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      NAMAT_NAME: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      Weapon: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      Job: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      Rotaba_Code: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      Khedma_Type: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      Mostwa_3la: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      TAMARKZ_NAME: {
        type: DataTypes.STRING(100),
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "SMGeneral",
      schema: "dbo",
      timestamps: false
    }
  );
};
