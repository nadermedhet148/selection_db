const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "Ratebzzz",
    {
      ID: {
        type: DataTypes.STRING(100),
        allowNull: false,
        primaryKey: true
      },
      RatebLevel: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      Name: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      UnitID: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      VolunteeringDate: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      SatrtingSarefRateb: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      F7: {
        type: DataTypes.DATE,
        allowNull: true
      },
      F8: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      Address: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      DutyID: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      RatebCategory: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      SupplyingRigion: {
        type: DataTypes.STRING(100),
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "Ratebzzz",
      schema: "dbo",
      timestamps: false
      // indexes: [
      //   {
      //     name: "PK_Ratebzzz",
      //     unique: true,
      //     fields: [
      //       { name: "ID" },
      //     ]
      //   },
      // ]
    }
  );
};
