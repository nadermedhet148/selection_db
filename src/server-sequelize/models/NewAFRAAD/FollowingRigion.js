const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "FollowingRigion",
    {
      FollowRigionID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      FollowRigionName: {
        type: DataTypes.STRING(100),
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "FollowingRigion",
      schema: "dbo",
      timestamps: true
      // indexes: [
      //   {
      //     name: "PK_FollowingRigion",
      //     unique: true,
      //     fields: [
      //       { name: "FollowRigionID" },
      //     ]
      //   },
      // ]
    }
  );
};
