/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "tankolat",
    {
      tblId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "TblID"
      },
      id: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "ID"
      },
      daraga: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Daraga"
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Name"
      },
      category: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Category"
      },
      fromUnit: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "FromUnit"
      },
      toUnit: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "ToUnit"
      },
      ketaa: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Ketaa"
      },
      leaveDate: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "LeaveDate"
      },
      note: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Note"
      },
      unitId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "UnitID"
      },
      ketaaId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "KetaaID"
      }
    },
    {
      tableName: "Tankolat",
      timestamps: false
    }
  );
};
