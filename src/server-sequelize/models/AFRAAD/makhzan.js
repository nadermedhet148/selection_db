/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "makhzan",
    {
      id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        field: "id"
      },
      dateSend: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: "date_send"
      },
      recipient: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "recipient"
      },
      mostalm: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "mostalm"
      },
      reason: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "reason"
      },
      dateReceive: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: "date_receive"
      },
      cardRecipient: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "card_recipient"
      },
      tm: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "tm"
      }
    },
    {
      tableName: "makhzan",
      timestamps: false
    }
  );
};
