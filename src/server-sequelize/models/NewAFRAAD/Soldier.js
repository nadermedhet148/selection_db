const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "Soldier",
    {
      ID: {
        type: DataTypes.STRING(13),
        allowNull: false,
        primaryKey: true,
        references: {
          model: "Soldier",
          key: "ID"
        }
      },
      Name: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      TripleNo: {
        type: DataTypes.STRING(14),
        allowNull: true
      },
      RecuRegion: {
        type: DataTypes.STRING(15),
        allowNull: true
      },
      KnowledgeLevel: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      IdentityNo: {
        type: DataTypes.STRING(14),
        allowNull: true
      },
      BirthDate: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },

      Centre: {
        type: DataTypes.STRING(50),
        allowNull: true
      },

      Religion: {
        type: DataTypes.STRING(5),
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "Soldier",
      schema: "dbo",
      timestamps: false
      // indexes: [
      //   {
      //     name: "PK_Soldier",
      //     unique: true,
      //     fields: [
      //       { name: "ID" },
      //     ]
      //   },
      // ]
    }
  );
};
