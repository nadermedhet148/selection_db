/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "blackLists",
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
      rakmAskrt: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "RakmAskrt"
      },
      notes: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Notes"
      },
      wehdaId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Units",
          key: "UnitID"
        },
        field: "WehdaID"
      }
    },
    {
      tableName: "BlackLists",
      timestamps: false
    }
  );
};
