/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "correspondences",
    {
      corresId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "CorresId"
      },
      date: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "Date"
      },
      corresNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "CorresNumber"
      },
      branch: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Branch"
      },
      direction: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Direction"
      },
      subject: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Subject"
      },
      branchSuperiorDecision: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "BranchSuperiorDecision"
      },
      procedure: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Procedure"
      },
      isFollowed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        field: "IsFollowed"
      },
      unitId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Units",
          key: "UnitID"
        },
        field: "UnitId"
      },
      kesmId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Aksams",
          key: "ID"
        },
        field: "Kesm_ID"
      },
      mo5TasId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Mo5tasen",
          key: "ID"
        },
        field: "Mo5tas_ID"
      },
      ahmeya: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Ahmeya"
      },
      geha: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "Geha"
      },
      timestamp: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "timestamp"
      }
    },
    {
      tableName: "Correspondences",
      timestamps: false
    }
  );
};
