/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "messengerCalls",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "Id"
      },
      date: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "Date"
      },
      users: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Users"
      },
      callType: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "CallType"
      },
      path: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Path"
      },
      deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        field: "Deleted"
      },
      deleteTime: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "DeleteTime"
      }
    },
    {
      tableName: "MessengerCalls",
      timestamps: false
    }
  );
};
