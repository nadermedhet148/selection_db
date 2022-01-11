module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "offices",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: false,
        field: "Id"
      },
      name: {
        type: DataTypes.STRING,
        field: "Name"
      }
    },
    {
      tableName: "Offices",
      timestamps: false
    }
  );
};
