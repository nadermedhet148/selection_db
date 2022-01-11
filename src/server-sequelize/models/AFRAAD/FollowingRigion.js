/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "followingRigion",
    {
      followRigionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        field: "FollowRigionID"
      },
      followRigionName: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "FollowRigionName"
      }
    },
    {
      tableName: "FollowingRigion",
      timestamps: false
    }
  );
};
