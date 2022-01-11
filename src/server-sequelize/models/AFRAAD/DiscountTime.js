/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "discountTime",
    {
      id: {
        primaryKey: true,
        type: DataTypes.STRING,
        allowNull: true,
        field: "ID"
      },
      timeDiscount: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "TimeDiscount"
      },
      dateTimeBefore: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "DateTimeBefore"
      },
      dataTimeAfter: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "DataTimeAfter"
      }
    },
    {
      tableName: "DiscountTime",
      timestamps: false
    }
  );
};
