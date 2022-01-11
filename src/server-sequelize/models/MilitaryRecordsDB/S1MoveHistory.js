/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "s1MoveHistory",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "Id"
      },
      militaryId: {
        type: DataTypes.STRING,
        allowNull: true,
        references: {
          model: "Conscriptes",
          key: "MilitaryId"
        },
        field: "MilitaryId"
      },
      s1MovedFromId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "S1MovedFromId"
      },
      s1MovedToId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "S1MovedToId"
      },
      moveDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "MoveDate"
      },
      moveResoneKey: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "MoveReasons",
          key: "Key"
        },
        field: "MoveResoneKey"
      },
      condition: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "Condition"
      },
      rejectionReason: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "RejectionReason"
      },
      delegateId: {
        type: DataTypes.STRING,
        allowNull: true,
        references: {
          model: "Conscriptes",
          key: "MilitaryId"
        },
        field: "DelegateId"
      },
      conscripteMilitaryId: {
        type: DataTypes.STRING,
        allowNull: true,
        references: {
          model: "Conscriptes",
          key: "MilitaryId"
        },
        field: "Conscripte_MilitaryId"
      },
      dutyMessageDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "DutyMessageDate"
      },
      verifierId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Users",
          key: "UserId"
        },
        field: "VerifierId"
      }
    },
    {
      tableName: "S1MoveHistory",
      timestamps: false
    }
  );
};
