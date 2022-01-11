/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "carruntlevel",
    {
      id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        field: "id"
      },
      ratebCategory: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "RatebCategory"
      },
      nextlevel: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "nextlevel"
      },
      dateEsta7Qaq: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: "date_esta7qaq"
      },
      dateFa3Li: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "date_fa3li"
      },
      layakon1: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        field: "layakon1"
      },
      reason: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "reason"
      },
      rev: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        field: "rev"
      },
      dateRecivefromuint: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "date_recivefromuint"
      },
      dateSendfromuint: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "date_sendfromuint"
      }
    },
    {
      tableName: "carruntlevel",
      timestamps: false
    }
  );
};
