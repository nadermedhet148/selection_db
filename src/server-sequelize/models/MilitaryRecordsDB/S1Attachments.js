/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "s1Attachments",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "Id"
      },
      group: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "Group"
      },
      text: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Text"
      }
    },
    {
      tableName: "S1Attachments",
      timestamps: false
    }
  );
};
