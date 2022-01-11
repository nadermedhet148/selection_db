/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "moveReasons",
    {
      key: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "Key"
      },
      value: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Value"
      },
      afradId: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "AfradId"
      }
    },
    {
      tableName: "MoveReasons",
      timestamps: false
    }
  );
};
