var DataTypes = require("sequelize").DataTypes;
var _Brothers = require("./Brothers");
var _Centre = require("./Centre");
var _City = require("./City");
var _Direction = require("./Direction");
var _DiscountTime = require("./DiscountTime");
var _DistributionSuggestion = require("./DistributionSuggestion");
var _DriversArrival = require("./DriversArrival");
var _Duty = require("./Duty");
var _Employes = require("./Employes");
var _EndingCause = require("./EndingCause");
var _Family = require("./Family");
var _Followerrateb = require("./Followerrateb");
var _Followers = require("./Followers");
var _FollowingNos = require("./FollowingNos");
var _FollowingRigion = require("./FollowingRigion");
var _Grade = require("./Grade");
var _MkzanMohab = require("./MkzanMohab");
var _Mosarah = require("./Mosarah");
var _Motabaa = require("./Motabaa");
var _Moving = require("./Moving");
var _MyUsers = require("./MyUsers");
var _Neshan = require("./Neshan");
var _NewComersArrivals = require("./NewComersArrivals");
var _NewComersTimeline = require("./NewComersTimeline");
var _OldFollowersNo = require("./OldFollowersNo");
var _Password = require("./Password");
var _Permissions = require("./Permissions");
var _Rateb = require("./Rateb");
var _RatebX = require("./RatebX");
var _Ratebzzz = require("./Ratebzzz");
var _Recommendations = require("./Recommendations");
var _RegisterationEssurance = require("./RegisterationEssurance");
var _SMDriversSuggestion = require("./SMDriversSuggestion");
var _SMSoldier = require("./SMSoldier");
var _SelectionSoldier = require("./SelectionSoldier");
var _SelectionType = require("./SelectionType");
var _SelectionUsers = require("./SelectionUsers");
var _Selections = require("./Selections");
var _SituationDecision = require("./SituationDecision");
var _SituationStates = require("./SituationStates");
var _Situations = require("./Situations");
var _Soldier = require("./Soldier");
var _SpareSoldiers = require("./SpareSoldiers");
var _Tankolat = require("./Tankolat");
var _Tasreeh = require("./Tasreeh");
var _TravalTable = require("./TravalTable");
var _Twsiat = require("./Twsiat");
var _Unit = require("./Unit");
var _UnitEngineersPlan = require("./UnitEngineersPlan");
var _UnitSelect = require("./UnitSelect");
var _Unit_Jobs = require("./Unit_Jobs");
var _UserPermissions = require("./UserPermissions");
var _Users = require("./Users");
var _Weapon = require("./Weapon");
var _carruntlevel = require("./carruntlevel");
var _chat = require("./chat");
var _followersolider = require("./followersolider");
var _followerwork = require("./followerwork");
var _makhzan = require("./makhzan");
var _preuint = require("./preuint");
var _prevlevelup = require("./prevlevelup");
var _punshments = require("./punshments");
var _security = require("./security");
var _shakawi = require("./shakawi");
var _suggest = require("./suggest");
var _tagdidMohab = require("./tagdidMohab");
var _tagdidrevsioin = require("./tagdidrevsioin");
var _tahel = require("./tahel");
var _tasgiltag = require("./tasgiltag");
var _Conscriptes = require("./Conscriptes");

function initModels(sequelize) {
  var security = _security(sequelize, DataTypes);
  var RegisterationEssurance = _RegisterationEssurance(sequelize, DataTypes);
  var shakawi = _shakawi(sequelize, DataTypes);
  var SelectionUsers = _SelectionUsers(sequelize, DataTypes);
  var SelectionType = _SelectionType(sequelize, DataTypes);
  var SelectionSoldier = _SelectionSoldier(sequelize, DataTypes);
  var carruntlevel = _carruntlevel(sequelize, DataTypes);
  var followerwork = _followerwork(sequelize, DataTypes);
  var followersolider = _followersolider(sequelize, DataTypes);
  var NewComersTimeline = _NewComersTimeline(sequelize, DataTypes);
  var NewComersArrivals = _NewComersArrivals(sequelize, DataTypes);
  var Neshan = _Neshan(sequelize, DataTypes);
  var MyUsers = _MyUsers(sequelize, DataTypes);
  var Recommendations = _Recommendations(sequelize, DataTypes);
  var Ratebzzz = _Ratebzzz(sequelize, DataTypes);
  var RatebX = _RatebX(sequelize, DataTypes);
  var Rateb = _Rateb(sequelize, DataTypes);
  var punshments = _punshments(sequelize, DataTypes);
  var prevlevelup = _prevlevelup(sequelize, DataTypes);
  var preuint = _preuint(sequelize, DataTypes);
  var Permissions = _Permissions(sequelize, DataTypes);
  var Password = _Password(sequelize, DataTypes);
  var Followerrateb = _Followerrateb(sequelize, DataTypes);
  var Family = _Family(sequelize, DataTypes);
  var EndingCause = _EndingCause(sequelize, DataTypes);
  var Employes = _Employes(sequelize, DataTypes);
  var Duty = _Duty(sequelize, DataTypes);
  var DriversArrival = _DriversArrival(sequelize, DataTypes);
  var Motabaa = _Motabaa(sequelize, DataTypes);
  var Mosarah = _Mosarah(sequelize, DataTypes);
  var MkzanMohab = _MkzanMohab(sequelize, DataTypes);
  var makhzan = _makhzan(sequelize, DataTypes);
  var Grade = _Grade(sequelize, DataTypes);
  var FollowingRigion = _FollowingRigion(sequelize, DataTypes);
  var DiscountTime = _DiscountTime(sequelize, DataTypes);
  var Direction = _Direction(sequelize, DataTypes);

  var City = _City(sequelize, DataTypes);
  var chat = _chat(sequelize, DataTypes);
  var Weapon = _Weapon(sequelize, DataTypes);
  var Users = _Users(sequelize, DataTypes);
  var UnitSelect = _UnitSelect(sequelize, DataTypes);
  var UnitEngineersPlan = _UnitEngineersPlan(sequelize, DataTypes);
  var Unit_Jobs = _Unit_Jobs(sequelize, DataTypes);
  var Unit = _Unit(sequelize, DataTypes);
  var SpareSoldiers = _SpareSoldiers(sequelize, DataTypes);
  var SMDriversSuggestion = _SMDriversSuggestion(sequelize, DataTypes);
  var SituationStates = _SituationStates(sequelize, DataTypes);
  var TravalTable = _TravalTable(sequelize, DataTypes);
  var Tasreeh = _Tasreeh(sequelize, DataTypes);
  var tasgiltag = _tasgiltag(sequelize, DataTypes);
  var Tankolat = _Tankolat(sequelize, DataTypes);
  var tahel = _tahel(sequelize, DataTypes);
  var tagdidrevsioin = _tagdidrevsioin(sequelize, DataTypes);
  var tagdidMohab = _tagdidMohab(sequelize, DataTypes);
  var suggest = _suggest(sequelize, DataTypes);
  var UserPermissions = _UserPermissions(sequelize, DataTypes);

  var Centre = _Centre(sequelize, DataTypes);
  var FollowingNos = _FollowingNos(sequelize, DataTypes);
  var OldFollowersNo = _OldFollowersNo(sequelize, DataTypes);
  var Selections = _Selections(sequelize, DataTypes);
  var Soldier = _Soldier(sequelize, DataTypes);
  var SMSoldier = _SMSoldier(sequelize, DataTypes);
  var Conscriptes = _Conscriptes(sequelize, DataTypes);

  var Followers = _Followers(sequelize, DataTypes);

  var Brothers = _Brothers(sequelize, DataTypes);
  var Twsiat = _Twsiat(sequelize, DataTypes);
  var Situations = _Situations(sequelize, DataTypes);
  var SituationDecision = _SituationDecision(sequelize, DataTypes);
  var DistributionSuggestion = _DistributionSuggestion(sequelize, DataTypes);
  var Moving = _Moving(sequelize, DataTypes);

  FollowingRigion.belongsToMany(Soldier, {
    as: "ID_Soldiers",
    through: Followers,
    foreignKey: "FollowRigionID",
    otherKey: "ID"
  });
  SituationStates.belongsToMany(Soldier, {
    as: "ID_Soldier_SituationDecisions",
    through: SituationDecision,
    foreignKey: "SituationID",
    otherKey: "ID"
  });
  SituationStates.belongsToMany(Soldier, {
    as: "ID_Soldier_Situations",
    through: Situations,
    foreignKey: "SituationID",
    otherKey: "ID"
  });
  Soldier.belongsToMany(FollowingRigion, {
    as: "FollowRigionID_FollowingRigions",
    through: Followers,
    foreignKey: "ID",
    otherKey: "FollowRigionID"
  });
  Soldier.belongsToMany(SituationStates, {
    as: "SituationID_SituationStates",
    through: SituationDecision,
    foreignKey: "ID",
    otherKey: "SituationID"
  });
  Soldier.belongsToMany(SituationStates, {
    as: "SituationID_SituationStates_Situations",
    through: Situations,
    foreignKey: "ID",
    otherKey: "SituationID"
  });
  SMSoldier.belongsTo(Centre, { as: "Centre", foreignKey: "CentreID" });
  Centre.hasMany(SMSoldier, { as: "SMSoldiers", foreignKey: "CentreID" });
  Soldier.belongsTo(Centre, { as: "Centre", foreignKey: "CentreID" });
  Centre.hasMany(Soldier, { as: "Soldiers", foreignKey: "CentreID" });
  Centre.belongsTo(City, { as: "City", foreignKey: "CityID" });
  City.hasMany(Centre, { as: "Centres", foreignKey: "CityID" });
  SMSoldier.belongsTo(City, { as: "City", foreignKey: "CityID" });
  City.hasMany(SMSoldier, { as: "SMSoldiers", foreignKey: "CityID" });
  Soldier.belongsTo(City, { as: "City", foreignKey: "CityID" });
  City.hasMany(Soldier, { as: "Soldiers", foreignKey: "CityID" });
  Soldier.belongsTo(Duty, { as: "Duty", foreignKey: "DutyID" });
  Duty.hasMany(Soldier, { as: "Soldiers", foreignKey: "DutyID" });
  Followers.belongsTo(FollowingRigion, {
    as: "FollowRigion",
    foreignKey: "FollowRigionID"
  });
  // FollowingRigion.hasMany(Followers, {
  //   as: "Followers",
  //   foreignKey: "FollowRigionID"
  // });
  FollowingNos.belongsTo(FollowingRigion, {
    as: "FollowRigion",
    foreignKey: "FollowRigionID"
  });
  FollowingRigion.hasMany(FollowingNos, {
    as: "FollowingNos",
    foreignKey: "FollowRigionID"
  });
  UserPermissions.belongsTo(MyUsers, { as: "User", foreignKey: "UserId" });
  MyUsers.hasMany(UserPermissions, {
    as: "UserPermissions",
    foreignKey: "UserId"
  });
  UserPermissions.belongsTo(Permissions, { as: "Perm", foreignKey: "PermId" });
  Permissions.hasMany(UserPermissions, {
    as: "UserPermissions",
    foreignKey: "PermId"
  });
  Selections.belongsTo(SelectionType, {
    as: "Selection",
    foreignKey: "SelectionID"
  });
  SelectionType.hasMany(Selections, {
    as: "Selections",
    foreignKey: "SelectionID"
  });
  SituationDecision.belongsTo(SituationStates, {
    as: "Situation",
    foreignKey: "SituationID"
  });
  SituationStates.hasMany(SituationDecision, {
    as: "SituationDecisions",
    foreignKey: "SituationID"
  });
  Situations.belongsTo(SituationStates, {
    as: "Situation",
    foreignKey: "SituationID"
  });
  // SituationStates.hasMany(Situations, {
  //   as: "Situations",
  //   foreignKey: "SituationID"
  // });
  Brothers.belongsTo(Soldier, { as: "ID_Soldier", foreignKey: "ID" });
  Soldier.hasOne(Brothers, { as: "Brother", foreignKey: "ID" });
  Followers.belongsTo(Soldier, { as: "ID_Soldier", foreignKey: "ID" });
  // Soldier.hasMany(Followers, { as: "Followers", foreignKey: "ID" });
  SituationDecision.belongsTo(Soldier, { as: "ID_Soldier", foreignKey: "ID" });
  Soldier.hasMany(SituationDecision, {
    as: "SituationDecisions",
    foreignKey: "ID"
  });
  Situations.belongsTo(Soldier, { as: "ID_Soldier", foreignKey: "ID" });
  Soldier.hasMany(Situations, { as: "Situations", foreignKey: "ID" });
  Soldier.belongsTo(Soldier, { as: "ID_Soldier_Soldier", foreignKey: "ID" });
  Soldier.hasOne(Soldier, { as: "Soldier", foreignKey: "ID" });
  Twsiat.belongsTo(Soldier, { as: "ID_Soldier", foreignKey: "ID" });
  Soldier.hasMany(Twsiat, { as: "Twsiats", foreignKey: "ID" });
  DistributionSuggestion.belongsTo(Unit, { as: "Unit", foreignKey: "UnitID" });
  Unit.hasMany(DistributionSuggestion, {
    as: "DistributionSuggestions",
    foreignKey: "UnitID"
  });
  Moving.belongsTo(Unit, { as: "Unit", foreignKey: "UnitID" });
  Unit.hasMany(Moving, { as: "Movings", foreignKey: "UnitID" });
  OldFollowersNo.belongsTo(Unit, { as: "Unit", foreignKey: "UnitID" });
  Unit.hasMany(OldFollowersNo, { as: "OldFollowersNos", foreignKey: "UnitID" });
  SMSoldier.belongsTo(Unit, { as: "Unit", foreignKey: "UnitID" });
  Unit.hasMany(SMSoldier, { as: "SMSoldiers", foreignKey: "UnitID" });
  Soldier.belongsTo(Unit, { as: "Unit", foreignKey: "UnitID" });
  Unit.hasMany(Soldier, { as: "Soldiers", foreignKey: "UnitID" });
  suggest.belongsTo(Unit, { as: "Unit", foreignKey: "UnitID" });
  Unit.hasMany(suggest, { as: "suggests", foreignKey: "UnitID" });
  SMSoldier.belongsTo(Weapon, { as: "Weapon", foreignKey: "WeaponID" });
  Weapon.hasMany(SMSoldier, { as: "SMSoldiers", foreignKey: "WeaponID" });
  Soldier.belongsTo(Weapon, { as: "Weapon", foreignKey: "WeaponID" });
  Weapon.hasMany(Soldier, { as: "Soldiers", foreignKey: "WeaponID" });

  return {
    Brothers,
    Centre,
    City,
    Direction,
    DiscountTime,
    DistributionSuggestion,
    DriversArrival,
    Duty,
    Employes,
    EndingCause,
    Family,
    Followerrateb,
    Followers,
    FollowingNos,
    FollowingRigion,
    Grade,
    MkzanMohab,
    Mosarah,
    Motabaa,
    Moving,
    MyUsers,
    Neshan,
    NewComersArrivals,
    NewComersTimeline,
    OldFollowersNo,
    Password,
    Permissions,
    Rateb,
    RatebX,
    Ratebzzz,
    Recommendations,
    RegisterationEssurance,
    SMDriversSuggestion,
    SMSoldier,
    SelectionSoldier,
    SelectionType,
    SelectionUsers,
    Selections,
    SituationDecision,
    SituationStates,
    Situations,
    Soldier,
    SpareSoldiers,
    Tankolat,
    Tasreeh,
    TravalTable,
    Twsiat,
    Unit,
    UnitEngineersPlan,
    UnitSelect,
    Unit_Jobs,
    UserPermissions,
    users: Users,
    Weapon,
    carruntlevel,
    chat,
    followersolider,
    followerwork,
    makhzan,
    preuint,
    prevlevelup,
    punshments,
    security,
    shakawi,
    suggest,
    tagdidMohab,
    tagdidrevsioin,
    tahel,
    tasgiltag
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
