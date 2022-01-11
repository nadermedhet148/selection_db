module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "nationalities",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        field: "Id"
      },
      displayedText: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "DisplayedText"
      },
      nationality: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Nationality"
      }
    },
    {
      tableName: "Nationalities",
      timestamps: false
    }
  );
};
