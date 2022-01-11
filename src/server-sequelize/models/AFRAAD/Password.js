/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "password",
    {
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        field: "Password"
      }
    },
    {
      tableName: "Password",
      timestamps: false
    }
  );
};
