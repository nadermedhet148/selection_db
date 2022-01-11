/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "services",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "id"
      },
      title: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "title"
      },
      desc: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "title"
      },
      typeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "typeId"
      }
    },
    {
      tableName: "Services",
      timestamps: false
    }
  );
};
