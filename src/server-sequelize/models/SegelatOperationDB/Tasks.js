/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "tasks",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "ID"
      },
      type: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Type"
      },
      typeId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "RequesterTypes",
          key: "Id"
        },
        field: "TypeId"
      },
      termReasonId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "TermReasons",
          key: "Id"
        },
        field: "TermReasonId"
      },
      taskDegreeId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "TaskDegrees",
          key: "Id"
        },
        field: "TaskDegreeId"
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Name"
      },
      mostafedName: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "MostafedName"
      },
      kawmy: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Kawmy"
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Phone"
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Address"
      },
      khedma: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Khedma"
      },
      rakmAskrt: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "RakmAskrt"
      },
      wehdaId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Units",
          key: "UnitID"
        },
        field: "WehdaID"
      },
      kesmId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Aksams",
          key: "ID"
        },
        field: "Kesm_ID"
      },
      mo5TasId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Mo5tasen",
          key: "ID"
        },
        field: "Mo5tas_ID"
      },
      degreeId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Degrees",
          key: "DegreeID"
        },
        field: "DegreeID"
      },
      matam: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Matam"
      },
      ahmeya: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Ahmeya"
      },
      notes: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Notes"
      },
      motab3A: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        field: "Motab3a"
      },
      enha2: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Enha2"
      },
      montahy: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        field: "Montahy"
      },
      geha: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "Geha"
      },
      accept: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        field: "Accept"
      },
      timeEnter: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "TimeEnter"
      },
      timeAccept: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "TimeAccept"
      },
      timeEnha2: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "TimeEnha2"
      },
      timestamp: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "timestamp"
      }
    },
    {
      tableName: "Tasks",
      timestamps: false
    }
  );
};
