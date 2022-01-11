/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "modifications",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "id"
      },
      militaryId: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "MilitaryId"
      },
      fullName: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "FullName"
      },
      unit: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Unit"
      },
      state: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "State"
      },
      personTypeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "PersonTypeId"
      },
      section: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "Section"
      },
      changeType: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "ChangeType"
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "Date"
      },
      modifiedBy: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "ModifiedBy"
      },
      verifierId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Users",
          key: "UserId"
        },
        field: "VerifierId"
      },
      confirmerId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Users",
          key: "UserId"
        },
        field: "ConfirmerId"
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        field: "IsVerified"
      },
      isConfirmed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        field: "IsConfirmed"
      },
      card2SPlace: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "Card2SPlace"
      },
      form: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Form"
      },
      delete: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        field: "delete"
      }
    },
    {
      tableName: "Modifications",
      timestamps: false
    }
  );
};
