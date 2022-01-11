/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "travilingReassons",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "ID"
      },
      text: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Text"
      }
    },
    {
      tableName: "TravilingReassons",
      timestamps: false
    }
  );
};
