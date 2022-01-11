/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "recommendations",
    {
      id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        field: "ID"
      },
      unitId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "UnitID"
      },
      recommender: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "Recommender"
      },
      certificator: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "Certificator"
      },
      notes: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Notes"
      },
      unitDirection: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "UnitDirection"
      },
      soldierDirection: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "soldierDirection"
      },
      certification: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        field: "Certification"
      },
      matching: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "Matching"
      },
      countRecommendations: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "CountRecommendations"
      },
      degree: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Degree"
      }
    },
    {
      tableName: "Recommendations",
      timestamps: false
    }
  );
};
