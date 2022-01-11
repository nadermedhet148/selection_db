/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "weapon",
    {
      weaponId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        field: "WeaponID"
      },
      weapon: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Weapon"
      },
      markezTadreb: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Markez_Tadreb"
      }
    },
    {
      tableName: "Weapon",
      timestamps: false
    }
  );
};
