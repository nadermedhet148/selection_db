/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "elHalaas",
    {
      halaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "HalaId"
      },
      halaText: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "HalaText"
      }
    },
    {
      tableName: "ElHalaas",
      timestamps: false
    }
  );
};
