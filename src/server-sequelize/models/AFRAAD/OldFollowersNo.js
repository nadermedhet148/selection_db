/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "oldFollowersNo",
    {
      unitId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: "Unit",
          key: "UnitID"
        },
        field: "UnitID"
      },
      recuStage: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "RecuStage"
      },
      oldFollowers: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "OldFollowers"
      },
      finishingFollowers: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "FinishingFollowers"
      }
    },
    {
      tableName: "OldFollowersNo",
      timestamps: false
    }
  );
};
