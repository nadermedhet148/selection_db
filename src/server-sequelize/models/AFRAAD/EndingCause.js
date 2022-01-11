/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "endingCause",
    {
      id: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "ID",
        primaryKey: true
      },
      reason: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Reason"
      },
      state: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "State"
      }
    },
    {
      tableName: "EndingCause",
      timestamps: false
    }
  );
};
