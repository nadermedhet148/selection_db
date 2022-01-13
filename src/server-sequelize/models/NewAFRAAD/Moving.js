const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "Moving",
    {
      UnitID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: "Unit",
          key: "UnitID"
        }
      },
      RecuStage: {
        type: DataTypes.STRING(50),
        allowNull: false,
        primaryKey: true
      },
      Moved: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      Notes: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "Moving",
      schema: "dbo",
      timestamps: false
      // indexes: [
      //   {
      //     name: "PK_Moving_1",
      //     unique: true,
      //     fields: [
      //       { name: "UnitID" },
      //       { name: "RecuStage" },
      //     ]
      //   },
      // ]
    }
  );
};
