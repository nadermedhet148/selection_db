/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "elHarbs",
    {
      elHarbId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "ElHarbId"
      },
      elHarbTxt: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "ElHarbTxt"
      }
    },
    {
      tableName: "ElHarbs",
      timestamps: false
    }
  );
};
