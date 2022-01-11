/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "centre",
    {
      centreId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        field: "CentreID"
      },
      centre: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Centre"
      },
      cityId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "City",
          key: "CityID"
        },
        field: "CityID"
      }
    },
    {
      tableName: "Centre",
      timestamps: false
    }
  );
};
