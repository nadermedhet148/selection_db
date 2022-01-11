/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "mkzanMohab",
    {
      id: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "ID",
        primaryKey: true
      },
      akdmia: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "akdmia"
      },
      hafza: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "hafza"
      }
    },
    {
      tableName: "MkzanMohab",
      timestamps: false
    }
  );
};
