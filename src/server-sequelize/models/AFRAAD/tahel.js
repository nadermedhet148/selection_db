/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "tahel",
    {
      count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "count"
      },
      id: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "id"
      },
      leavel: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "leavel"
      },
      dateFrom: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        field: "date_from"
      },
      dateTo: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        field: "date_to"
      },
      degree: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "degree"
      }
    },
    {
      tableName: "tahel",
      timestamps: false
    }
  );
};
