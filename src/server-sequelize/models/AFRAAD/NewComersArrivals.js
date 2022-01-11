/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "newComersArrivals",
    {
      recuRegion: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        field: "RecuRegion"
      },
      knowledgeLevel: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        field: "KnowledgeLevel"
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        primaryKey: true,
        field: "Date"
      },
      numberofArrivals: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "NumberofArrivals"
      },
      recuStage: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "RecuStage"
      }
    },
    {
      tableName: "NewComersArrivals",
      timestamps: false
    }
  );
};
