/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "moving",
    {
      unitId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: "Unit",
          key: "UnitID"
        },
        field: "UnitID"
      },
      recuStage: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "RecuStage"
      },
      moved: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "Moved"
      },
      notes: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Notes"
      }
    },
    {
      tableName: "Moving",
      timestamps: false
    }
  );
};
