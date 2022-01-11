/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "ta3Be2A",
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
          model: "Ta3be2aType",
          key: "Id"
        },
        field: "TypeId"
      },
      number: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "Number"
      },
      office: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Office"
      },
      date: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "Date"
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Phone"
      }
    },
    {
      tableName: "Ta3be2a",
      timestamps: false
    }
  );
};
