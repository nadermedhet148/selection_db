/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "adminRequests",
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
      type: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Type"
      },
      militaryId: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "MilitaryId"
      },
      newMilitaryId: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "NewMilitaryId"
      },
      userNotes: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "UserNotes"
      },
      adminNotes: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "AdminNotes"
      },
      senderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "UserId"
        },
        field: "SenderId"
      },
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        field: "Status"
      }
    },
    {
      tableName: "AdminRequests",
      timestamps: false
    }
  );
};
