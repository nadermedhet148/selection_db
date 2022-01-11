/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "selectionType",
    {
      selectionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        field: "SelectionID"
      },
      selection: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Selection"
      }
    },
    {
      tableName: "SelectionType",
      timestamps: false
    }
  );
};
