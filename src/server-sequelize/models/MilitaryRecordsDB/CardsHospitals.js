module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "cardsHospitals",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: false,
        field: "Id"
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Name"
      }
    },
    {
      tableName: "CardsHospitals",
      timestamps: false
    }
  );
};
