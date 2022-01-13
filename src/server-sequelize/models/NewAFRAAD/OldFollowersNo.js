const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "OldFollowersNo",
    {
      UnitID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: "Unit",
          key: "UnitID"
        }
      },
      RecuStage: {
        type: DataTypes.STRING(100),
        allowNull: false,
        primaryKey: true
      },
      OldFollowers: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      FinishingFollowers: {
        type: DataTypes.INTEGER,
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "OldFollowersNo",
      schema: "dbo",
      timestamps: false
      // indexes: [
      //   {
      //     name: "PK_OldFollowersNo",
      //     unique: true,
      //     fields: [
      //       { name: "UnitID" },
      //       { name: "RecuStage" },
      //     ]
      //   },
      // ]
    }
  );
};
