const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "Situations",
    {
      ID: {
        type: DataTypes.STRING(13),
        allowNull: false,
        primaryKey: true,
        references: {
          model: "Soldier",
          key: "ID"
        }
      },
      SituationID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: "SituationStates",
          key: "SituationID"
        }
      },
      SituationNotes: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      Contnuity: {
        type: DataTypes.STRING(50),
        allowNull: false
      }
    },
    {
      sequelize,
      tableName: "Situations",
      schema: "dbo",
      timestamps: true
      // indexes: [
      //   {
      //     name: "PK_Situations_1",
      //     unique: true,
      //     fields: [
      //       { name: "ID" },
      //       { name: "SituationID" },
      //     ]
      //   },
      // ]
    }
  );
};
