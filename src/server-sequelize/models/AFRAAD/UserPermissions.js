/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "userPermissions",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "ID"
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "MyUsers",
          key: "ID"
        },
        field: "UserId"
      },
      permId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Permissions",
          key: "ID"
        },
        field: "PermId"
      }
    },
    {
      tableName: "UserPermissions",
      timestamps: false
    }
  );
};
