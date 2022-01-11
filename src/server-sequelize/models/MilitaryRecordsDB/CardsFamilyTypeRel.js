module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "cardsFamilyTypeRel",
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
      relation: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Relation"
      }
    },
    {
      tableName: "CardsFamilyTypeRel",
      timestamps: false
    }
  );
};
