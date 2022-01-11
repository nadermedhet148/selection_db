/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "tasgiltag",
    {
      id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        field: "id"
      },
      datetg1: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "datetg1"
      },
      todatetag1: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "todatetag1"
      },
      datetg2: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "datetg2"
      },
      todatetag: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "todatetag"
      },
      datees1: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "datees1"
      },
      datees2: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "datees2"
      },
      layakon1: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        field: "layakon1"
      },
      layakon2: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        field: "layakon2"
      },
      datefaalitag1: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "datefaalitag1"
      },
      datefaalitag2: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "datefaalitag2"
      },
      rev: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        field: "rev"
      },
      reason: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "reason"
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
      },
      weapon: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "weapon"
      },
      ratebCategory: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "RatebCategory"
      },
      typeTagdid: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "type_tagdid"
      },
      dateestaqaq: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "dateestaqaq"
      }
    },
    {
      tableName: "tasgiltag",
      timestamps: false
    }
  );
};
