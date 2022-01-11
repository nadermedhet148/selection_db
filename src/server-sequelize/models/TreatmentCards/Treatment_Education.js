/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "treatmentEducation",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "ID"
      },
      nationalIdExtraMember: {
        type: DataTypes.STRING,
        allowNull: true,
        references: {
          model: "Treatment_ExtraFamilyMembers",
          key: "NationalID"
        },
        field: "NationalIDExtraMember"
      },
      level: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "level"
      },
      schoolName: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "SchoolName"
      },
      applyDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "ApplyDate"
      }
    },
    {
      tableName: "Treatment_Education",
      timestamps: false
    }
  );
};
