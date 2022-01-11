/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "unitJobs",
    {
      unitId: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Unit_ID"
      },
      unitName: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "UNIT_NAME"
      },
      gehatEmdad: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Gehat_Emdad"
      },
      khedmaType: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Khedma_Type"
      },
      feaaCode: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Feaa_Code"
      },
      gehaName: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Geha_Name"
      },
      gehaId: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Geha_ID"
      },
      job: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Job"
      },
      darga: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Darga"
      },
      khedmaDargaType: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Khedma_Darga_Type"
      },
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "ID"
      }
    },
    {
      tableName: "Unit_Jobs",
      timestamps: false
    }
  );
};
