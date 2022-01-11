/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "driversArrival",
    {
      knowledgeLevel: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "KnowledgeLevel",
        primaryKey: true
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        field: "Date"
      },
      numberofArrivals: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "NumberofArrivals"
      },
      planned: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "Planned"
      },
      recuStage: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "RecuStage"
      }
    },
    {
      tableName: "DriversArrival",
      timestamps: false
    }
  );
};
