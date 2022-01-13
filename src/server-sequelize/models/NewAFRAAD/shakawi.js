const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "shakawi",
    {
      con: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      ID: {
        type: DataTypes.STRING(13),
        allowNull: false,
        primaryKey: true
      },
      type_shakwa: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      shakwa_date: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      moawkf_shakwa: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "shakawi",
      schema: "dbo",
      timestamps: false
    }
  );
};
