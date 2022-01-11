/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "calendars",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "Id"
      },
      typeId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "CalendarTypes",
          key: "Id"
        },
        field: "TypeId"
      },
      degreeId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "CalendarDegrees",
          key: "Id"
        },
        field: "DegreeId"
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Name"
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Description"
      },
      start: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "Start",
        get() {
          return this.getDataValue("start")
            ? this.getDataValue("start")
                .toISOString()
                .split("T")[0]
            : "";
        }
      },
      end: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "End",
        get() {
          return this.getDataValue("end")
            ? this.getDataValue("end")
                .toISOString()
                .split("T")[0]
            : "";
        }
      },
      addedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Users",
          key: "UserId"
        },
        field: "AddedBy"
      },
      sectionId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "SectionId"
      }
    },
    {
      tableName: "Calendars",
      timestamps: false
    }
  );
};
