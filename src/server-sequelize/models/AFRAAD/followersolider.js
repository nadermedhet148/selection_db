/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "followersolider",
    {
      id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        field: "ID"
      },
      orderoffolwer: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Orderoffolwer"
      },
      followplace: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "followplace"
      },
      workplace: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "workplace"
      },
      suputer: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Suputer"
      },
      notes: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "notes"
      },
      stage: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "stage"
      },
      uintid: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "uintid"
      },
      tarekhElhak: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: "TarekhElhak"
      },
      soldierStatus: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "SoldierStatus"
      }
    },
    {
      tableName: "followersolider",
      timestamps: false
    }
  );
};
