/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "conscripteUnits",
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
      unitId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Units",
          key: "UnitId"
        },
        field: "UnitId"
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "CreatedAt"
      }
    },
    {
      tableName: "ConscripteUnits",
      timestamps: false
    }
  );
};
