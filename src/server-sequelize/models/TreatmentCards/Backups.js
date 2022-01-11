/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "backups",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "Id"
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "Date"
      },
      path: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Path"
      }
    },
    {
      tableName: "Backups",
      timestamps: false
    }
  );
};
