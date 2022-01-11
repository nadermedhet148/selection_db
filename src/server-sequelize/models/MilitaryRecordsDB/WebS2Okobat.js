module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "webS2Okobat",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: "Id"
      },
      militaryId: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "MilitaryId"
      },
      degree: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Degree"
      },
      fullName: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "FullName"
      },
      itemDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: "ItemDate"
      },
      itemNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "ItemNumber"
      },
      statement: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Statement"
      },
      punishType: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "PunishType"
      },
      punishPeriod: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "PunishPeriod"
      },
      type: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Type"
      },
      crimeFrom: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: "CrimeFrom"
      },
      crimeTo: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: "CrimeTo"
      },
      crimeDesc: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "CrimeDesc"
      },
      cardId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "WebS2Cards",
          key: "Id"
        },
        field: "CardId"
      }
    },
    {
      tableName: "WebS2Okobat",
      timestamps: false
    }
  );
};
