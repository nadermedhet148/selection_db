/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "chat",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "ID"
      },
      sender: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Sender"
      },
      message: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Message"
      },
      dateOfMessage: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "DateOfMessage"
      }
    },
    {
      tableName: "chat",
      timestamps: false
    }
  );
};
