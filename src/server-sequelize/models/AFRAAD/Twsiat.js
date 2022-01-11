/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "twsiat",
    {
      code: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "Code"
      },
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
      name: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Name"
      },
      tripleNo: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "TripleNo"
      },
      knowledgeLevel: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "KnowledgeLevel"
      },
      college: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "College"
      },
      city: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "City"
      },
      unit: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "Unit"
      },
      recuRegion: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "RecuRegion"
      },
      direction: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Direction"
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
      tripleNo1: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "TripleNo1"
      },
      tripleNo2: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "TripleNo2"
      },
      tripleNo3: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "TripleNo3"
      },
      certification: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Certification"
      },
      matching: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Matching"
      }
    },
    {
      tableName: "Twsiat",
      timestamps: false
    }
  );
};
