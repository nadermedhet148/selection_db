/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "employes",
    {
      employeeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        field: "EmployeeID"
      },
      employeeName: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "EmployeeName"
      }
    },
    {
      tableName: "Employes",
      timestamps: false
    }
  );
};
