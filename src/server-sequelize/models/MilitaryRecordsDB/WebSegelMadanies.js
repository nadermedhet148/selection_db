/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "webSegelMadanies",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "Id"
      },
      displayedText: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "DisplayedText"
      },
      webGovernorateId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "WebGovernorates",
          key: "Id"
        },
        field: "WebGovernorateId"
      }
    },
    {
      tableName: "WebSegelMadanies",
      timestamps: false
    }
  );
};
