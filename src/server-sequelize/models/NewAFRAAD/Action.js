const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "Action",
    {
      actionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      noteId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      takedAction: {
        type: DataTypes.STRING(20),
        allowNull: true
      },
      result: {
        type: DataTypes.STRING(12),
        allowNull: true
      },
      file: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      dueDate: {
        type: DataTypes.DATE,
        allowNull: true
      },
      createdTime: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      isDone: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "Action",
      schema: "dbo",
      timestamps: false
    }
  );
};
