/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "followerwork",
    {
      idwork: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "idwork"
      },
      workplace: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "workplace"
      },
      wokel7Aq: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "wokel7aq"
      }
    },
    {
      tableName: "followerwork",
      timestamps: false
    }
  );
};
