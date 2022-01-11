let all_relationships = [
  ["aksams", "tasks", "hasMany", "kesmId"],
  ["tasks", "aksams", "belongsTo", "kesmId"],

  ["requesterTypes", "tasks", "hasMany", "typeId"],
  ["tasks", "requesterTypes", "belongsTo", "typeId"],

  ["requesterTypes", "blackLists", "hasMany", "typeId"],
  ["blackLists", "requesterTypes", "belongsTo", "typeId"],

  ["termReasons", "tasks", "hasMany", "termReasonId"],
  ["tasks", "termReasons", "belongsTo", "termReasonId"],

  ["taskDegrees", "tasks", "hasMany", "taskDegreeId"],
  ["tasks", "taskDegrees", "belongsTo", "taskDegreeId"],

  ["mo5Tasen", "tasks", "hasMany", "mo5TasId"],
  ["tasks", "mo5Tasen", "belongsTo", "mo5TasId"],

  ["degrees", "tasks", "hasMany", "degreeId"],
  ["tasks", "degrees", "belongsTo", "degreeId"],

  ["units", "tasks", "hasMany", "wehdaId"],
  ["tasks", "units", "belongsTo", "wehdaId"],

  ["units", "blackLists", "hasMany", "wehdaId"],
  ["blackLists", "units", "belongsTo", "wehdaId"]
];
module.exports = () => all_relationships;
