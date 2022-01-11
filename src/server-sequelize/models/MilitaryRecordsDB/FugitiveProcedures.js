/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "fugitiveProcedures",
    {
      procedureId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "ProcedureId"
      },
      procedureType: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "ProcedureType"
      },
      serial: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "Serial"
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
      fugitiveId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Fugitives",
          key: "id"
        },
        field: "FugitiveId"
      },
      fugitiveLogId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "FugitiveLogs",
          key: "Id"
        },
        field: "FugitiveLog_id"
      }
    },
    {
      tableName: "FugitiveProcedures",
      timestamps: false
    }
  );
};
