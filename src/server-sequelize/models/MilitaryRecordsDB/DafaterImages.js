/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "dafaterImages",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "Id"
      },
      imgPath: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "ImgPath"
      },
      dafaterId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "DafaterId"
      }
    },
    {
      tableName: "DafaterImages",
      timestamps: false
    }
  );
};
