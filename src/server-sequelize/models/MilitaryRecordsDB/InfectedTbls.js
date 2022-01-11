/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "infectedTbls",
    {
      militaryId: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        field: "MilitaryId"
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Name"
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Address"
      },
      telephone: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Telephone"
      },
      lastDateTransactionRecords: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "LastDateTransactionRecords"
      },
      infectedDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "InfectedDate"
      },
      nots: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Nots"
      },
      decisionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "DecisionOfCausalities",
          key: "DecisionId"
        },
        field: "DecisionId"
      },
      degreeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Degrees",
          key: "DegreeId"
        },
        field: "DegreeId"
      },
      dutyTypeId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "DutyTypes",
          key: "DutyTypeID"
        },
        field: "DutyTypeID"
      },
      resonToEndService: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "ResonToEndService"
      },
      elHarbId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "ElHarbs",
          key: "ElHarbId"
        },
        field: "ElHarbId"
      },
      deficit: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Deficit"
      },
      degreeOfTheDeficit: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "DegreeOfTheDeficit"
      },
      dateOfTheCommission: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "DateOfTheCommission"
      },
      cardDatePersonalety: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "CardDatePersonalety"
      },
      cardNumPersonalety: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "CardNumPersonalety"
      },
      newDatePersonalety: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "NewDatePersonalety"
      },
      cardDateFamly: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "CardDateFamly"
      },
      cardNumFamly: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "CardNumFamly"
      },
      newDateFamly: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "NewDateFamly"
      },
      cardDateParents: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "CardDateParents"
      },
      cardNumParents: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "CardNumParents"
      },
      newDateParents: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "NewDateParents"
      },
      gotTheCardPersonalety: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        field: "GotTheCardPersonalety"
      },
      gotTheCardFamly: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        field: "GotTheCardFamly"
      },
      gotTheCardParents: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        field: "GotTheCardParents"
      },
      unitId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: "((0))",
        references: {
          model: "Units",
          key: "UnitId"
        },
        field: "UnitId"
      },
      acceDetailes: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "acceDetailes"
      }
    },
    {
      tableName: "InfectedTbls",
      timestamps: false
    }
  );
};
