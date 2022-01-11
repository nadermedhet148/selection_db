/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "localLicences",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "Id"
      },
      militaryId: {
        type: DataTypes.STRING,
        allowNull: true,
        references: {
          model: "Conscriptes",
          key: "MilitaryId"
        },
        field: "MilitaryId"
      },
      typeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "LicenceTypes",
          key: "Id"
        },
        field: "TypeId"
      },
      number: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "Number"
      },
      date: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "Date"
      }
    },
    {
      tableName: "LocalLicences",
      timestamps: false
    }
  );
};
