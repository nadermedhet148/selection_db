/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "militaryCardRenews",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "Id"
      },
      militaryId: {
        type: DataTypes.STRING,
        allowNull: true,
        references: {
          model: "NonCommissioneds",
          key: "MilitaryId"
        },
        field: "MilitaryId"
      },
      serviceType: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "ServiceType"
      },
      personalIdExpDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "PersonalIdExpDate"
      },
      paymantDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "PaymantDate"
      },
      isfollowed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: "0",
        field: "Isfollowed"
      }
    },
    {
      tableName: "MilitaryCardRenews",
      timestamps: false
    }
  );
};
