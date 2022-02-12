const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "Rateb",
    {
      ID: {
        type: DataTypes.STRING(100),
        allowNull: false,
        primaryKey: true
      },
      Name: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      TripleNo: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      RatebCategory: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      RatebLevel: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      WeaponID: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      UnitID: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      DutyID: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      SupplyingRigion: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      Directionforunit: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      RatebState: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      ServiceStyle: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      SatrtingSarefRateb: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      VolunteeringDate: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      OlderindNo: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      FileNo: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      image: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      IdentityNo: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      BirthDate: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      Address: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      CentreID: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      CityID: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      Qualification: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      SoldierTELE: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      RelevantTELE: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      Religion: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      BloodType: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      Notes: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      Namat: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      KnowledgeLevel: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      Taskeen: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      TahtElTawze3: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      Dof3aNum: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      JobBefore: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      UnitJob: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      MartialStatus: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      NumOfChilds: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      UnitJoinDate: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      RatebCategoryFari: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      Revision: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "Rateb",
      schema: "dbo",
      timestamps: false
      // indexes: [
      //   {
      //     name: "PK_Rateb",
      //     unique: true,
      //     fields: [
      //       { name: "ID" },
      //     ]
      //   },
      // ]
    }
  );
};
