module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "cardTypes",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        field: "Id"
      },
      typeName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "typeName"
      },
      expirationDateInYears: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "expirationDateInYears"
      }
    },
    {
      tableName: "CardTypes",
      timestamps: false
    }
  );
};
