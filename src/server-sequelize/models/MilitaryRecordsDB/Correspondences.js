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
          key: "UnitId"
        },
        field: "UnitId"
      },
      partId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "PartResponsibles",
          key: "PartId"
        },
        field: "PartId"
      },
      isApproved: {
        type: DataTypes.BOOLEAN
      },
      notApprovedReason: {
        type: DataTypes.STRING
      },
      createdBy: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "CreatedBy"
      },
      modifiedBy: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "ModifiedBy"
      }
    },
    {
      tableName: "Correspondences",
      timestamps: false
    }
  );
};
