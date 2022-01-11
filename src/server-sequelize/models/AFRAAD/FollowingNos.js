/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "followingNos",
    {
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
      recuStage: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        field: "RecuStage"
      },
      acceptedNo: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "AcceptedNo"
      },
      notes: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Notes"
      }
    },
    {
      tableName: "FollowingNos",
      timestamps: false
    }
  );
};
