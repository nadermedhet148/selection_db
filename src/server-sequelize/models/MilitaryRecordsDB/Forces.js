/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "forces",
    {
      forceId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        field: "ForceId"
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Name"
      },
      shortName: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "ShortName"
      },
      lastUpdate: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "LastUpdate"
      },
      afradId: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "AfradId"
      }
    },
    {
      tableName: "Forces",
      timestamps: false
    }
  );
};
