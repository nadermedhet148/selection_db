const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "Employes",
    {
      EmployeeID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      EmployeeName: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "Employes",
      schema: "dbo",
      timestamps: false
      // indexes: [
      //   {
      //     name: "PK_Employes",
      //     unique: true,
      //     fields: [
      //       { name: "EmployeeID" },
      //     ]
      //   },
      // ]
    }
  );
};
