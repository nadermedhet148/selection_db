/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "direction",
    {
      directionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        field: "Direction_ID"
      },
      knowledgeLevel: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "KnowledgeLevel"
      },
      city: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "City"
      },
      direction: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Direction"
      },
      recuRegion: {
        type: "NCHAR",
        allowNull: true,
        field: "RecuRegion"
      }
    },
    {
      tableName: "Direction",
      timestamps: false
    }
  );
};
