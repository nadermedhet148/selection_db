const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "Notes",
    {
      noteId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      ID: {
        type: DataTypes.STRING(13),
        allowNull: false,
        primaryKey: true,
        references: {
          model: "Soldier",
          key: "ID"
        }
      },
      section: {
        type: DataTypes.STRING,
        allowNull: true
      },
      isFollowed: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      Note: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      decision: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      followupTime : {
        type: DataTypes.DATE,
        allowNull: true
      },
      isPresented: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "Notes",
      schema: "dbo",
      timestamps: false
      // indexes: [
      //   {
      //     name: "PK_City",
      //     unique: true,
      //     fields: [
      //       { name: "CityID" },
      //     ]
      //   },
      // ]
    }
  );
};
