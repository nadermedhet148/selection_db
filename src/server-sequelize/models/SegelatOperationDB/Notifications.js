/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "notifications",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "ID"
      },
      text: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Text"
      },
      seen: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        field: "Seen"
      },
      toKesm: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Aksams",
          key: "ID"
        },
        field: "ToKesm"
      },
      timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "timestamp"
      },
      generalType: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "GeneralType"
      },
      notifType: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "NotifType"
      },
      taskCoresId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "Task_Cores_ID"
      }
    },
    {
      tableName: "Notifications",
      timestamps: false
    }
  );
};
