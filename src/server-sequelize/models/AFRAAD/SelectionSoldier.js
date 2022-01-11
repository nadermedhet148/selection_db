/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "selectionSoldier",
    {
      serialNo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "SerialNo"
      },
      recommenderA: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "RecommenderA"
      },
      recommenderB: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "RecommenderB"
      },
      recommenderC: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "RecommenderC"
      },
      certificator: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Certificator"
      },
      recoDegree: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "RecoDegree"
      },
      recoAWeaponId: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "RecoAWeaponID"
      },
      recoBWeaponId: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "RecoBWeaponID"
      },
      recommdationText: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "RecommdationText"
      },
      recommenderUnit: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "RecommenderUnit"
      },
      finalDegree: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "FinalDegree"
      },
      finalWeaponId: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "FinalWeaponID"
      },
      matching: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Matching"
      },
      idKey: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "IDKey"
      },
      notes: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Notes"
      },
      selectionId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "SelectionID"
      },
      finalResult: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "FinalResult"
      },
      sendingDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: "SendingDate"
      },
      acceptance: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        field: "Acceptance"
      },
      soldierRecuStage: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "SoldierRecuStage"
      }
    },
    {
      tableName: "SelectionSoldier",
      timestamps: false
    }
  );
};
