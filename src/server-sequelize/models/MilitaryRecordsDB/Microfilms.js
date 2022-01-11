/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "microfilms",
    {
      microfilmId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        field: "MicrofilmId"
      },
      filmTitle: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "FilmTitle"
      },
      state: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "State"
      }
    },
    {
      tableName: "Microfilms",
      timestamps: false
    }
  );
};
