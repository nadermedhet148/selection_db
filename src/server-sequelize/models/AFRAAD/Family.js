/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "family",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "ID"
      },
      soliderId: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "SoliderID"
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Name"
      },
      drga: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Drga"
      },
      centerId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "CenterID"
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: "Date"
      },
      tel: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Tel"
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Address"
      },
      ya3Wl: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Ya3wl"
      },
      dateofBirth: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: "DateofBirth"
      }
    },
    {
      tableName: "Family",
      timestamps: false
    }
  );
};
