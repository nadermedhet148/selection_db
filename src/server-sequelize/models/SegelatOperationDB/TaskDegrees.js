module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "taskDegrees",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "ID"
      },
      displayedText: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "DisplayedText"
      }
    },
    {
      tableName: "TaskDegrees",
      timestamps: false
    }
  );
};
