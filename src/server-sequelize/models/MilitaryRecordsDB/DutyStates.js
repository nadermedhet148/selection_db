/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "dutyStates",
    {
      stateId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        field: "StateId"
      },
      text: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Text"
      },
      dutyTypeDutyTypeId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "DutyTypes",
          key: "DutyTypeID"
        },
        field: "DutyType_DutyTypeID"
      },
      afradId: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "AfradId"
      }
    },
    {
      tableName: "DutyStates",
      timestamps: false
    }
  );
};
