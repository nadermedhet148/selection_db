/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "sysdiagrams",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "name"
      },
      principalId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "principal_id"
      },
      diagramId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "diagram_id"
      },
      version: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "version"
      },
      definition: {
        type: "VARBINARY",
        allowNull: true,
        field: "definition"
      }
    },
    {
      tableName: "sysdiagrams",
      timestamps: false
    }
  );
};
