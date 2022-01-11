/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "promotions",
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
      date: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "Date"
      },
      type: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "Type"
      },
      from: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "From"
      },
      to: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "To"
      },
      confirmer: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Confirmer"
      },
      order: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Order"
      }
    },
    {
      tableName: "Promotions",
      timestamps: false
    }
  );
};
