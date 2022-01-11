/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "suplySources",
    {
      sourceId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "SourceID"
      },
      sourceName: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "SourceName"
      },
      afradId: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "AfradId"
      }
    },
    {
      tableName: "SuplySources",
      timestamps: false
    }
  );
};
