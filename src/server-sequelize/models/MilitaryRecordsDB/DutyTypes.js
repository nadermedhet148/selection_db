/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "dutyTypes",
    {
      dutyTypeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "DutyTypeID"
      },
      dutyTypeText: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "DutyTypeText"
      },
      afradId: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "AfradId"
      }
    },
    {
      tableName: "DutyTypes",
      timestamps: false
    }
  );
};
