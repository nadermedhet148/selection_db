/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "tasreeh",
    {
      date: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "Date",
        primaryKey: true
      },
      unit: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "Unit"
      },
      supp: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "Supp"
      }
    },
    {
      tableName: "Tasreeh",
      timestamps: false
    }
  );
};
