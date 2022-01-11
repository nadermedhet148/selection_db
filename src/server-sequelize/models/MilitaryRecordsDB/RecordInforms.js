/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "recordInforms",
    {
      informid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "informid"
      },
      informType: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "InformType"
      },
      sort: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "Sort"
      },
      informdate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "informdate"
      },
      informtext: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "informtext"
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
      }
    },
    {
      tableName: "RecordInforms",
      timestamps: false
    }
  );
};
