/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "webGovernorates",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "Id"
      },
      displayedText: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "DisplayedText"
      }
    },
    {
      tableName: "WebGovernorates",
      timestamps: false
    }
  );
};
