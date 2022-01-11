/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "treatmentJobs",
    {
      jobId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "JobID"
      },
      jobText: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "JobText"
      }
    },
    {
      tableName: "Treatment_Jobs",
      timestamps: false
    }
  );
};
