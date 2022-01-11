/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "renameOrders",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "id"
      },
      militaryId: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "MilitaryId"
      },
      oldName: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "OldName"
      },
      newName: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "NewName"
      },
      sendDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "SendDate"
      },
      responseDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "ResponseDate"
      },
      orderNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "orderNumber"
      }
    },
    {
      tableName: "RenameOrders",
      timestamps: false
    }
  );
};
