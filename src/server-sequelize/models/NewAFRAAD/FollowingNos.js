const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "FollowingNos",
    {
      FollowRigionID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: "FollowingRigion",
          key: "FollowRigionID"
        }
      },
      RecuStage: {
        type: DataTypes.STRING(50),
        allowNull: false,
        primaryKey: true
      },
      AcceptedNo: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      Notes: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "FollowingNos",
      schema: "dbo",
      timestamps: true
      // indexes: [
      //   {
      //     name: "PK_FollowingNos_1",
      //     unique: true,
      //     fields: [
      //       { name: "FollowRigionID" },
      //       { name: "RecuStage" },
      //     ]
      //   },
      // ]
    }
  );
};
