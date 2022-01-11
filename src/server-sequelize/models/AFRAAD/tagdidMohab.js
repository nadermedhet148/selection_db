/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "tagdidMohab",
    {
      id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        field: "ID"
      },
      tareekh1: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "tareekh1"
      },
      layakon: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        field: "layakon"
      },
      date2: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "date2"
      },
      tareekh3: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "tareekh3"
      },
      type: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "type"
      },
      weaponId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "WeaponID"
      },
      weapon: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Weapon"
      }
    },
    {
      tableName: "tagdidMohab",
      timestamps: false
    }
  );
};
