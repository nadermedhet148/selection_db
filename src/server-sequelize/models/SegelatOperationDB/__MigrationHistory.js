/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "migrationHistory",
    {
      migrationId: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        field: "MigrationId"
      },
      contextKey: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        field: "ContextKey"
      },
      model: {
        type: "VARBINARY",
        allowNull: false,
        field: "Model"
      },
      productVersion: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "ProductVersion"
      }
    },
    {
      tableName: "__MigrationHistory",
      timestamps: false
    }
  );
};
