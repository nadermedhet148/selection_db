/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "newComersTimeline",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        field: "ID"
      },
      reason: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Reason"
      },
      fromDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: "fromDate"
      },
      toDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: "toDate"
      },
      recuStage: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "RecuStage"
      }
    },
    {
      tableName: "NewComersTimeline",
      timestamps: false
    }
  );
};
