/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "ratebX",
    {
      f1: {
        type: DataTypes.FLOAT,
        allowNull: true,
        field: "F1",
        primaryKey: true
      },
      f2: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "F2"
      },
      f3: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "F3"
      },
      f4: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "F4"
      },
      f5: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "F5"
      },
      f6: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "F6"
      },
      f7: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: "F7"
      },
      f8: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "F8"
      },
      f9: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "F9"
      },
      f10: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "F10"
      },
      f11: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "F11"
      }
    },
    {
      tableName: "RatebX",
      timestamps: false
    }
  );
};
