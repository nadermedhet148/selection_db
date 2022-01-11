/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "appConfig",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "Id"
      },
      property: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Property"
      },
      value: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Value"
      },
      defaultValue: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "DefaultValue"
      }
    },
    {
      tableName: "AppConfig",
      timestamps: false
    }
  );
};
