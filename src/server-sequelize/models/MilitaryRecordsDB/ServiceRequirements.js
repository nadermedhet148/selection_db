/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "serviceRequirements",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "id"
      },
      title: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "title"
      },
      desc: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "desc"
      },
      isRequired: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        field: "isRequired"
      },
      serviceId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "serviceId"
      }
    },
    {
      tableName: "ServiceRequirements",
      timestamps: false
    }
  );
};
