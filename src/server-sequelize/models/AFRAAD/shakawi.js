/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "shakawi",
    {
      con: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "con",
        primaryKey: true
      },
      id: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "ID"
      },
      typeShakwa: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "type_shakwa"
      },
      shakwaDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: "shakwa_date"
      },
      moawkfShakwa: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "moawkf_shakwa"
      },
      notes: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "notes"
      }
    },
    {
      tableName: "shakawi",
      timestamps: false
    }
  );
};
