/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "travalTable",
    {
      id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        field: "ID"
      },
      travalDistination: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "TravalDistination"
      },
      travalType: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "TravalType"
      },
      travalDateFrom: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: "TravalDateFrom"
      },
      travalDateTo: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: "TravalDateTo"
      },
      travalintadab: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Travalintadab"
      },
      amanaNum: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "AmanaNum"
      }
    },
    {
      tableName: "TravalTable",
      timestamps: false
    }
  );
};
