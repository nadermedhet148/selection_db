module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "cardsCertificants",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: false,
        field: "Id"
      },
      displayedText: {
        type: DataTypes.STRING,
        field: "DisplayedText"
      }
    },
    {
      tableName: "CardsCertificants",
      timestamps: false
    }
  );
};
