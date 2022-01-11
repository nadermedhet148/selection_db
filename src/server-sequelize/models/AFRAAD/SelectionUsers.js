/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "selectionUsers",
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "UserID"
      },
      userName: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "UserName"
      },
      userPassword: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "UserPassword"
      }
    },
    {
      tableName: "SelectionUsers",
      timestamps: false
    }
  );
};
