/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "followerrateb",
    {
      id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        field: "ID"
      },
      orderoffolwer: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "Orderoffolwer"
      },
      followplace: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "followplace"
      },
      workplace: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "workplace"
      },
      suputer: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "Suputer"
      },
      notes: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "notes"
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
      }
    },
    {
      tableName: "Followerrateb",
      timestamps: false
    }
  );
};
