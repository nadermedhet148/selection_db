/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "mokatabas",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "Id"
      },
      type: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Type"
      },
      number: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Number"
      },
      mokatabaDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "MokatabaDate"
      },
      createDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "CreateDate"
      },
      editDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "EditDate"
      },
      sendTo: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "SendTo"
      },
      recievedFrom: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "RecievedFrom"
      },
      procedures: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Procedures"
      },
      subject: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Subject"
      },
      gotFeedback: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        field: "GotFeedback"
      },
      connectedMokatabaId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Mokatabas",
          key: "Id"
        },
        field: "ConnectedMokatabaId"
      },
      connectedMokatabas: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "ConnectedMokatabas"
      },
      fileNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "FileNumber"
      }
    },
    {
      tableName: "Mokatabas",
      timestamps: false
    }
  );
};
