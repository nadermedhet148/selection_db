const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "preuint",
    {
      con: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      id: {
        type: DataTypes.STRING(13),
        allowNull: true
      },
      uintid: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      todam: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      fromdam: {
        type: DataTypes.DATEONLY,
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "preuint",
      schema: "dbo",
      timestamps: true
      // indexes: [
      //   {
      //     name: "PK_preuint",
      //     unique: true,
      //     fields: [
      //       { name: "con" },
      //     ]
      //   },
      // ]
    }
  );
};
