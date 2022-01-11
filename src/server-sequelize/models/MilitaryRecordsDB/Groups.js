/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "groups",
    {
      groupId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "GroupId"
      },
      groupName: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "GroupName"
      },
      typeId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "DutyTypes",
          key: "DutyTypeID"
        },
        field: "TypeId"
      },
      afradId: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "AfradId"
      }
    },
    {
      tableName: "Groups",
      timestamps: false
    }
  );
};
