/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "neshan",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "ID"
      },
      soilderId: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "SoilderID"
      },
      noot: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "Noot"
      },
      ression: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "Ression"
      },
      orderid: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "Orderid"
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        field: "Date"
      },
      notes: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "Notes"
      }
    },
    {
      tableName: "Neshan",
      timestamps: false
    }
  );
};
