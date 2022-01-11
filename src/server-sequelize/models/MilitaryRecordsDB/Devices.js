/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "devices",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "Id"
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Name"
      },
      mac: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Mac"
      }
    },
    {
      tableName: "Devices",
      timestamps: false
    }
  );
};
