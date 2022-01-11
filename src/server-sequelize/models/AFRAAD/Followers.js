/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "followers",
    {
      id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        references: {
          model: "Soldier",
          key: "ID"
        },
        field: "ID"
      },
      followRigionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: "FollowingRigion",
          key: "FollowRigionID"
        },
        field: "FollowRigionID"
      },
      followingOrder: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        field: "FollowingOrder"
      },
      followingRecommender: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        field: "FollowingRecommender"
      },
      notes: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Notes"
      },
      serialNo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "SerialNo"
      },
      acceptance: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        field: "Acceptance"
      },
      recuStage: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "RecuStage"
      }
    },
    {
      tableName: "Followers",
      timestamps: false
    }
  );
};
