/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "errandsGroups",
    {
      errandsDateId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "ErrandsDateId"
      },
      errandsDate: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "ErrandsDate"
      },
      militaryId: {
        type: DataTypes.STRING,
        allowNull: true,
        references: {
          model: "Conscriptes",
          key: "MilitaryId"
        },
        field: "MilitaryId"
      }
    },
    {
      tableName: "ErrandsGroups",
      timestamps: false
    }
  );
};
