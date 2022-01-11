/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "rateb",
    {
      id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        field: "ID"
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Name"
      },
      tripleNo: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "TripleNo"
      },
      ratebCategory: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "RatebCategory"
      },
      ratebLevel: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "RatebLevel"
      },
      weaponId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "WeaponID"
      },
      unitId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "UnitID"
      },
      dutyId: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "DutyID"
      },
      supplyingRigion: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "SupplyingRigion"
      },
      directionforunit: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Directionforunit"
      },
      ratebState: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "RatebState"
      },
      serviceStyle: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "ServiceStyle"
      },
      satrtingSarefRateb: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "SatrtingSarefRateb"
      },
      volunteeringDate: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "VolunteeringDate"
      },
      olderindNo: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "OlderindNo"
      },
      fileNo: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "FileNo"
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "image"
      },
      identityNo: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "IdentityNo"
      },
      birthDate: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "BirthDate"
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Address"
      },
      centreId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "CentreID"
      },
      cityId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "CityID"
      },
      qualification: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Qualification"
      },
      soldierTele: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "SoldierTELE"
      },
      relevantTele: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "RelevantTELE"
      },
      religion: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Religion"
      },
      bloodType: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "BloodType"
      },
      notes: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Notes"
      },
      namat: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Namat"
      },
      knowLevel: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "KnowLevel"
      },
      taskeen: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Taskeen"
      },
      tahtElTawze3: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "TahtElTawze3"
      },
      dof3ANum: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Dof3aNum"
      },
      jobBefore: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "JobBefore"
      },
      unitJob: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "UnitJob"
      },
      martialStatus: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "MartialStatus"
      },
      numOfChilds: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "NumOfChilds"
      },
      unitJoinDate: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "UnitJoinDate"
      },
      ratebCategoryFari: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "RatebCategoryFari"
      },
      revision: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        field: "Revision"
      }
    },
    {
      tableName: "Rateb",
      timestamps: false
    }
  );
};
