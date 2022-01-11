/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "webUnitLeaders",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "Id"
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Name"
      },
      degreeId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "WebDegrees",
          key: "Id"
        },
        field: "DegreeId"
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Phone"
      },
      cdm: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "cdm"
      }
    },
    {
      tableName: "WebUnitLeaders",
      timestamps: false
    }
  );
};
