/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "procedures",
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
      sort: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "Sort"
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
      accidentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Accidents",
          key: "AccidentId"
        },
        field: "AccidentId"
      },
      injurytId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Injuries",
          key: "InjuryId"
        },
        field: "InjurytId"
      },
      courtId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Courts",
          key: "CourtId"
        },
        field: "CourtId"
      },
      exemptionId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Exemptions",
          key: "ExemptionId"
        },
        field: "ExemptionId"
      },
      travilingAbroadTravilId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "TravilingAbroads",
          key: "TravilId"
        },
        field: "TravilingAbroad_TravilId"
      }
    },
    {
      tableName: "Procedures",
      timestamps: false
    }
  );
};
