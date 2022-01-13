const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "Followers",
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
      FollowRigionID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: "FollowingRigion",
          key: "FollowRigionID"
        }
      },
      FollowingOrder: {
        type: DataTypes.STRING(100),
        allowNull: false,
        primaryKey: true
      },
      FollowingRecommender: {
        type: DataTypes.STRING(100),
        allowNull: false,
        primaryKey: true
      },
      Notes: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      SerialNo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true
      },
      Acceptance: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      RecuStage: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "Followers",
      schema: "dbo",
      timestamps: false
      // indexes: [
      //   {
      //     name: "PK_Followers",
      //     unique: true,
      //     fields: [
      //       { name: "ID" },
      //       { name: "FollowRigionID" },
      //       { name: "FollowingOrder" },
      //       { name: "FollowingRecommender" }
      //     ]
      //   }
      // ]
    }
  );
};
