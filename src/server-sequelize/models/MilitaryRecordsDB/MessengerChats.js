/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "messengerChats",
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
      user1: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "User_1"
      },
      user2: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "User_2"
      },
      msg: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Msg"
      },
      sender: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "Sender"
      },
      seen: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        field: "Seen"
      },
      deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        field: "Deleted"
      },
      deleteDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "DeleteDate"
      },
      restoreTime: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "RestoreTime"
      },
      replyOnId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "MessengerChats",
          key: "Id"
        },
        field: "ReplyOnId"
      },
      type: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Type"
      },
      fileSize: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "FileSize"
      },
      path: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Path"
      }
    },
    {
      tableName: "MessengerChats",
      timestamps: false
    }
  );
};
