/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "qualifications",
    {
      qualificationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        field: "QualificationId"
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Name"
      },
      afradId: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "AfradId"
      }
    },
    {
      tableName: "Qualifications",
      timestamps: false
    }
  );
};
