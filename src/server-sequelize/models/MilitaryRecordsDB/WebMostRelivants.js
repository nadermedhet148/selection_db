/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "webMostRelivants",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "Id"
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Name"
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Address"
      },
      degree: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Degree"
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Phone"
      }
    },
    {
      tableName: "WebMostRelivants",
      timestamps: false
    }
  );
};
