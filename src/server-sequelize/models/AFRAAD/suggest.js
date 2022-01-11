/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "suggest",
    {
      unitId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: "Unit",
          key: "UnitID"
        },
        field: "UnitID"
      },
      recuStage: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "RecuStage"
      },
      payWar: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "PayWar"
      },
      payPolitics: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "PayPolitics"
      },
      existWithoutHighPay: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "ExistWithoutHighPay"
      },
      releasedOne: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "ReleasedOne"
      },
      totalAfterRelease: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "TotalAfterRelease"
      },
      nWarOne: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "NWarOne"
      },
      nPoliticsOne: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "NPoliticsOne"
      },
      high: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "High"
      },
      aboveAvg: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "AboveAvg"
      },
      avg: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Avg"
      },
      normal: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Normal"
      },
      total: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Total"
      },
      afterSupply: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "AfterSupply"
      },
      nwarTwo: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "NwarTwo"
      },
      nPoliticsTwo: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "NPoliticsTwo"
      }
    },
    {
      tableName: "suggest",
      timestamps: false
    }
  );
};
