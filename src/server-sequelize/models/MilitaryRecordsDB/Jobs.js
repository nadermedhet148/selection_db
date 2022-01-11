/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "jobs",
    {
      jobId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        field: "JobId"
      },
      jobText: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "JobText"
      },
      typeId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "DutyTypes",
          key: "DutyTypeID"
        },
        field: "TypeId"
      },
      afradId: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "AfradId"
      }
    },
    {
      tableName: "Jobs",
      timestamps: false
    }
  );
};
