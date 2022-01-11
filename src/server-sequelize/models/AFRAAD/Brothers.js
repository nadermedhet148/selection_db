/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "brothers",
    {
      id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        references: {
          model: "Soldier",
          key: "ID"
        },
        field: "ID"
      },
      brothers: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Brothers"
      },
      bNotes: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "BNotes"
      }
    },
    {
      tableName: "Brothers",
      timestamps: false
    }
  );
};
