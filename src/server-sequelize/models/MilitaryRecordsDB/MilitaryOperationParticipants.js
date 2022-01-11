/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "militaryOperationParticipants",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: "Id"
      },
      militaryOperationId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "militaryOperationId"
      },
      militaryId: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "militaryId"
      }
    },
    {
      tableName: "MilitaryOperationParticipants",
      timestamps: false
    }
  );
};
