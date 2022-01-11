/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "errandServices",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "Id"
      },
      theServiceId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "TheServiceID"
      },
      theService: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "TheService"
      },
      officeId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "OfficeId"
      }
    },
    {
      tableName: "ErrandServices",
      timestamps: false
    }
  );
};
