/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "tagdidrevsioin",
    {
      id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        field: "id"
      },
      rev: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        field: "rev"
      },
      reason: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "reason"
      }
    },
    {
      tableName: "tagdidrevsioin",
      timestamps: false
    }
  );
};
