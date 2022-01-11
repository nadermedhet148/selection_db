/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "prevlevelup",
    {
      count: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "count",
        primaryKey: true
      },
      id: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "id"
      },
      level: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "level"
      },
      dateLevel: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: "date_level"
      }
    },
    {
      tableName: "prevlevelup",
      timestamps: false
    }
  );
};
