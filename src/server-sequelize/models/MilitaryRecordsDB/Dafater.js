/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "dafater",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "id"
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "name"
      },
      code: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "code",
        unique: false
      },
      filmNumber: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "filmNumber",
        unique: true
      },
      dafterIndex: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "dafterIndex",
        unique: true
      },
      assignedTo: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "assignedTo",
        unique: false
      },
      count: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "count",
        unique: false
      },
      mohafzaId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "mohafzaId",
        unique: false
      }
    },
    {
      tableName: "Dafater",
      timestamps: false
    }
  );
};
