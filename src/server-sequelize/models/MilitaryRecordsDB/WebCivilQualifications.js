/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "webCivilQualifications",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "Id"
      },
      groupId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "WebCivilQualificationGroups",
          key: "Id"
        },
        field: "GroupId"
      },
      displayedText: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "DisplayedText"
      }
    },
    {
      tableName: "WebCivilQualifications",
      timestamps: false
    }
  );
};
