/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "city",
    {
      cityId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        field: "CityID"
      },
      city: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "City"
      },
      rigion: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Rigion"
      }
    },
    {
      tableName: "City",
      timestamps: false
    }
  );
};
