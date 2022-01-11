const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "makhzan",
    {
      id: {
        type: DataTypes.STRING(13),
        allowNull: false,
        primaryKey: true
      },
      date_send: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      recipient: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      mostalm: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      reason: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      date_receive: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      card_recipient: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      tm: {
        type: DataTypes.INTEGER,
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "makhzan",
      schema: "dbo",
      timestamps: true
      // indexes: [
      //   {
      //     name: "PK_makhzan",
      //     unique: true,
      //     fields: [
      //       { name: "id" },
      //     ]
      //   },
      // ]
    }
  );
};
