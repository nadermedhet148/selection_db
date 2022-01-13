const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "NewComersTimeline",
    {
      ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      Reason: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      fromDate: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      toDate: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      RecuStage: {
        type: DataTypes.STRING(50),
        allowNull: false,
        primaryKey: true
      }
    },
    {
      sequelize,
      tableName: "NewComersTimeline",
      schema: "dbo",
      timestamps: false
      // indexes: [
      //   {
      //     name: "PK_NewComersTimeline",
      //     unique: true,
      //     fields: [
      //       { name: "ID" },
      //       { name: "RecuStage" },
      //     ]
      //   },
      // ]
    }
  );
};
