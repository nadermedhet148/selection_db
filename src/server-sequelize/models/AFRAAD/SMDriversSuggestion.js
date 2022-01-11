/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "smDriversSuggestion",
    {
      unitId: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "UnitID",
        primaryKey: true
      },
      rFardi: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "((0))",
        field: "RFardi"
      },
      rGmai: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "((0))",
        field: "RGmai"
      },
      sha: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "((0))",
        field: "SHA"
      },
      qtal: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "((0))",
        field: "Qtal"
      },
      t2Meen: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "((0))",
        field: "T2meen"
      },
      as3Af: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "((0))",
        field: "As3af"
      },
      warsha: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "((0))",
        field: "Warsha"
      },
      nagda: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "((0))",
        field: "Nagda"
      },
      itfaa: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "((0))",
        field: "Itfaa"
      },
      hamr: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "((0))",
        field: "Hamr"
      },
      moghaza: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "((0))",
        field: "Moghaza"
      },
      modr3A: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "((0))",
        field: "Modr3a"
      },
      totalHamar: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "((0))",
        field: "TotalHamar"
      },
      total3Agl: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "((0))",
        field: "Total3agl"
      },
      total: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "((0))",
        field: "Total"
      },
      imdadHamar: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "((0))",
        field: "ImdadHamar"
      },
      imdad3Agl: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "((0))",
        field: "Imdad3agl"
      },
      imdadTotal: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "((0))",
        field: "ImdadTotal"
      },
      recuStage: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "RecuStage"
      }
    },
    {
      tableName: "SMDriversSuggestion",
      timestamps: false
    }
  );
};
