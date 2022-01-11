/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "attachedUnits",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        field: "ID"
      },
      text: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Text"
      }
    },
    {
      tableName: "AttachedUnits",
      timestamps: false
    }
  );
};
