/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "families",
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
      name: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Name"
      },
      daraga: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Daraga"
      },
      date: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "Date"
      },
      birthDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "BirthDate"
      },
      telephone: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Telephone"
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Address"
      },
      ya3Ol: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        field: "Ya3ol"
      },
      afradId: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "AfradId"
      }
    },
    {
      tableName: "Families",
      timestamps: false
    }
  );
};
