const constants = require("../../Constant").default;

const SelectionsSoldiersSelects = {
  SoldierLevel: {
    text: "text",
    value: "text",
    data: constants.SoldierLevel.data
  },
  KnowledgeLevel: {
    text: "text",
    value: "text",
    data: constants.KnowledgeLevel.data
  },
  Religion: {
    text: "text",
    value: "text",
    data: constants.Religion.data
  },
  RecuTreat: {
    text: "text",
    value: "text",
    data: constants.RecuTreat.data
  },
  SoldierCategory: {
    text: "text",
    value: "text",
    data: constants.SoldierCategory.data
  },
  BloodType: {
    text: "text",
    value: "text",
    data: constants.BloodType.data
  },
  RecuRegion: {
    text: "text",
    value: "text",
    data: constants.RecuRegion.data
  },
  RecuStage: {
    text: "text",
    value: "text",
    data: constants.RecuStage.data
  },
  SoldierStatus: {
    text: "text",
    value: "text",
    data: constants.SoldierStatus.data
  },
  College: {
    text: "text",
    value: "text",
    data: constants.College.data
  },
  Direction: {
    text: "text",
    value: "text",
    data: constants.Direction.data
  },
  CityID: {
    table: "City",
    text: "City",
    value: "CityID"
  },
  CentreID: {
    table: "Centre",
    text: "Centre",
    value: "CentreID"
  },
  DutyID: {
    table: "Duty",
    text: "Duty",
    value: "DutyID"
  },
  periodId: {
    table: "periods",
    text: "periodText",
    value: "id"
  },
  microfilmId: {
    table: "microfilms",
    text: "microfilmId",
    value: "microfilmId"
  },
  ignorantId: {
    table: "ignorants",
    text: "displayedText",
    value: "id"
  },
  ignorantSupporterId: {
    value: "id",
    text: "displayedText",
    table: "ignorantSupporters"
  },

  groupId: {
    table: "groups",
    text: "groupName",
    value: "groupId"
  },
  stateIdCurrent: {
    table: "dutyCurrentStates",
    text: "text",
    value: "stateId"
  },
  sourceId: {
    table: "suplySources",
    text: "sourceName",
    value: "sourceId"
  },
  martialStateId: {
    table: "martialStates",
    text: "state",
    value: "martialStateId"
  },
  WeaponID: {
    table: "Weapon",
    text: "Weapon",
    value: "WeaponID"
  },
  reductionStateId: {
    table: "reductionStates",
    text: "state",
    value: "reductionStateId"
  },
  zoneId: {
    table: "zones",
    text: "zoneText",
    value: "zoneId"
  },
  additionalYearStateId: {
    table: "additionalYears",
    text: "state",
    value: "additionalYearStateId"
  },

  UnitID: {
    table: "Unit",
    value: "UnitID",
    text: "Unit"
    // attrs: ["zoneId"]
  },
  licenseId: {
    table: "licenses",
    value: "licenseId",
    text: "licenseType"
  }
};

export default SelectionsSoldiersSelects;
