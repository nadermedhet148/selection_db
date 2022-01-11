/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "partResponsibles",
    {
      partId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "PartId"
      },
      partName: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "PartName"
      }
    },
    {
      tableName: "PartResponsibles",
      timestamps: false
    }
  );
};
