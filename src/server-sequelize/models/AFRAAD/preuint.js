/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "preuint",
    {
      con: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "con"
      },
      id: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "id"
      },
      uintid: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "uintid"
      },
      todam: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: "todam"
      },
      fromdam: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: "fromdam"
      }
    },
    {
      tableName: "preuint",
      timestamps: false
    }
  );
};
