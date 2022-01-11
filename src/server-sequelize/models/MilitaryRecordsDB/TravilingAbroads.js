/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "travilingAbroads",
    {
      travilId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "TravilId"
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
      attachedUnitId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "AttachedUnitId"
      },
      attachDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "AttachDate"
      },
      travilingReassonId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "TravilingReassonID"
      },
      travilDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "TravilDate"
      },
      returnDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "returnDate"
      },
      travilingToId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "TravilingToID"
      },
      returnToCountry: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        field: "ReturnToCountry"
      },
      returnToUnit: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        field: "ReturnToUnit"
      },
      fromDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "FromDate"
      },
      toDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "ToDate"
      },
      bookingNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "BookingNumber"
      },
      notes: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Notes"
      },
      attachedUnit: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "AttachedUnit"
      },
      travilingReasson: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "TravilingReasson"
      },
      travilPlace: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "TravilPlace"
      },
      bookingDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "BookingDate"
      }
    },
    {
      tableName: "TravilingAbroads",
      timestamps: false
    }
  );
};
