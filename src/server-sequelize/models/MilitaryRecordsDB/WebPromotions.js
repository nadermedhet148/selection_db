/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "webPromotions",
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
          model: "WebPromotionTypes",
          key: "Id"
        },
        field: "TypeId"
      },
      degreeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "WebDegrees",
          key: "Id"
        },
        field: "DegreeId"
      },
      date: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "Date"
      },
      orderNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "OrderNumber"
      }
    },
    {
      tableName: "WebPromotions",
      timestamps: false
    }
  );
};
