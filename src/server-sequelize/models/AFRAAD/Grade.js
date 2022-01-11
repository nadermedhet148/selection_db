/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "grade",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "ID"
      },
      soliderId: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "SoliderID"
      },
      year: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Year"
      },
      nesbaNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Nesba_Number"
      },
      fromDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: "From_Date"
      },
      toDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: "To_Date"
      },
      note: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Note"
      },
      gradeText: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Grade_Text"
      },
      mosdak: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Mosdak"
      }
    },
    {
      tableName: "Grade",
      timestamps: false
    }
  );
};
