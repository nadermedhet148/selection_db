/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "recordsPrintVerifies",
    {
      militaryId: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        references: {
          model: "Conscriptes",
          key: "MilitaryId"
        },
        field: "MilitaryId"
      },
      isExisted: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "IsExisted"
      },
      verifiedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Users",
          key: "UserId"
        },
        field: "VerifiedBy"
      },
      confirmedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Users",
          key: "UserId"
        },
        field: "ConfirmedBy"
      },
      unitRevisionIsExisted: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "UnitRevisionIsExisted"
      },
      unitRevisionVerifiedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Users",
          key: "UserId"
        },
        field: "UnitRevisionVerifiedBy"
      },
      unitRevisionConfirmedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Users",
          key: "UserId"
        },
        field: "UnitRevisionConfirmedBy"
      },
      s1ReceptionFromUnitDelegateId: {
        type: DataTypes.STRING,
        allowNull: true,
        references: {
          model: "Conscriptes",
          key: "MilitaryId"
        },
        field: "S1ReceptionFromUnitDelegateId"
      },
      demobilizationGroupId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "DemobilizationGroups",
          key: "Id"
        },
        field: "DemobilizationGroupId"
      },
      returnLostPeriodState: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "ReturnLostPeriodState"
      },
      lostDays: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "LostDays"
      },
      lostMonths: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "LostMonths"
      },
      lostYears: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "LostYears"
      },
      ethicalDegree: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "EthicalDegree"
      },
      unitDemobilizationState: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "UnitDemobilizationState"
      }
    },
    {
      tableName: "RecordsPrintVerifies",
      timestamps: false
    }
  );
};
