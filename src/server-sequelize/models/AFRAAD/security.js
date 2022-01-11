/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "security",
    {
      id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        field: "id"
      },
      security: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "security"
      },
      decision: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "decision"
      }
    },
    {
      tableName: "security",
      timestamps: false
    }
  );
};
