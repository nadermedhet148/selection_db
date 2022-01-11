/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "treatmentKomsoin",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "ID"
      },
      nationalIdExtraMember: {
        type: DataTypes.STRING,
        allowNull: true,
        references: {
          model: "Treatment_ExtraFamilyMembers",
          key: "NationalID"
        },
        field: "NationalIDExtraMember"
      },
      lagnaId: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "LagnaID"
      },
      lagnaDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "LagnaDate"
      },
      tash5Es: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Tash5es"
      },
      lagnaDecision: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "LagnaDecision"
      },
      deserve: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        field: "Deserve"
      },
      picture: {
        type: "VARBINARY",
        allowNull: true,
        field: "Picture"
      }
    },
    {
      tableName: "Treatment_Komsoin",
      timestamps: false
    }
  );
};
