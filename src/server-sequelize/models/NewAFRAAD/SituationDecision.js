const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "SituationDecision",
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
      SituationDecision: {
        type: DataTypes.STRING(300),
        allowNull: false,
        primaryKey: true
      },
      SituationDecisionOwner: {
        type: DataTypes.TEXT,
        allowNull: true
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
      SituationDate: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      SerialNo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true
      }
    },
    {
      sequelize,
      tableName: "SituationDecision",
      schema: "dbo",
      timestamps: true
      // indexes: [
      //   {
      //     name: "PK_SituationDecision_1",
      //     unique: true,
      //     fields: [
      //       { name: "ID" },
      //       { name: "SituationDecision" },
      //       { name: "SituationID" },
      //     ]
      //   },
      // ]
    }
  );
};
