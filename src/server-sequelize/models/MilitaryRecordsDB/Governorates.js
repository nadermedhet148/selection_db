/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "governorates",
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
      areaId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "MobilizationAreas",
          key: "AreaId"
        },
        field: "AreaId"
      }
    },
    {
      tableName: "Governorates",
      timestamps: false
    }
  );
};
