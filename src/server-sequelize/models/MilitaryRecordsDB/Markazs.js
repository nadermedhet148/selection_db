/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "markazs",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        field: "Id"
      },
      displayedText: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "DisplayedText"
      },
      afradId: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "AfradId"
      },
      governorateId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Governorates",
          key: "Id"
        },
        field: "GovernorateId"
      }
    },
    {
      tableName: "Markazs",
      timestamps: false
    }
  );
};
