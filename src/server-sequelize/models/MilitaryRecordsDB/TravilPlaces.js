/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "travilPlaces",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "ID"
      },
      text: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Text"
      }
    },
    {
      tableName: "TravilPlaces",
      timestamps: false
    }
  );
};
