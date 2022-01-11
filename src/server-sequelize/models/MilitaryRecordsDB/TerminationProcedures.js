/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "terminationProcedures",
    {
      procedureId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "ProcedureId"
      },
      index: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "Index"
      },
      militaryId: {
        type: DataTypes.STRING,
        allowNull: true,
        references: {
          model: "Conscriptes",
          key: "MilitaryId"
        },
        field: "MilitaryId"
      },
      procedureDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "ProcedureDate"
      },
      procedureText: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "ProcedureText"
      },
      canPrint: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        field: "CanPrint"
      },
      procedureType: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "ProcedureType"
      }
    },
    {
      tableName: "TerminationProcedures",
      timestamps: false
    }
  );
};
