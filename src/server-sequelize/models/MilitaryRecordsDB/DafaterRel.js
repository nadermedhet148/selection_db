/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "dafaterRel",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "Id"
      },
      imageId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "ImageId"
      },
      militaryId: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "MilitaryId"
      },
      note: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Note"
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "UserId"
      },
      dateAdded: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "DateAdded"
      }
    },
    {
      tableName: "DafaterRel",
      timestamps: false
    }
  );
};
