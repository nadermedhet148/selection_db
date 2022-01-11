/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "mo5Tasen",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "ID"
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Name"
      },
      daraga: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Daraga"
      },
      rakmAskry: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "RakmAskry"
      },
      e5Tsas: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "E5tsas"
      },
      mola7Zat: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Mola7zat"
      },
      kesmId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Aksams",
          key: "ID"
        },
        field: "Kesm_ID"
      }
    },
    {
      tableName: "Mo5tasen",
      timestamps: false
    }
  );
};
