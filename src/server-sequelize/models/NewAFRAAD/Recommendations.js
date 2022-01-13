const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "Recommendations",
    {
      ID: {
        type: DataTypes.STRING(13),
        allowNull: false,
        primaryKey: true
      },
      UnitID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      Recommender: {
        type: DataTypes.STRING(100),
        allowNull: false,
        primaryKey: true
      },
      Certificator: {
        type: DataTypes.STRING(100),
        allowNull: false,
        primaryKey: true
      },
      Notes: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      UnitDirection: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      soldierDirection: {
        type: DataTypes.STRING(7),
        allowNull: true
      },
      Certification: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      Matching: {
        type: DataTypes.STRING(10),
        allowNull: false
      },
      CountRecommendations: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      Degree: {
        type: DataTypes.STRING(1),
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "Recommendations",
      schema: "dbo",
      timestamps: false
      // indexes: [
      //   {
      //     name: "PK_Revommendations",
      //     unique: true,
      //     fields: [
      //       { name: "ID" },
      //       { name: "UnitID" },
      //       { name: "Recommender" },
      //       { name: "Certificator" },
      //     ]
      //   },
      // ]
    }
  );
};
