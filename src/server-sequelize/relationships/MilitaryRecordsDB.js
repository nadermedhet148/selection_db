/*
  The " hasManyConscriptes " is created to make it easier.
  TODO:: Add WebDegreeId to get the current degree from the military website.
*/
let hasManyConscriptes = [
    ["units", "UnitId"],
    ["ignorantSupporters", "ignorantSupporterId"],
    ["dutyCurrentStates", "StateIdCurrent"],
    ["mobilizationAreas", "AreaId"],
    ["zones", "ZoneId"],
    ["additionalYears", "AdditionalYearStateId"],
    ["dutyStates", "StateId"],
    ["qualifications", "QualificationId"],
    ["forces", "ForceId"],
    ["reductionStates", "ReductionStateId"],
    ["religions", "ReligionId"],
    ["bloodTypes", "BloodTypeId"],
    ["martialStates", "MartialStateId"],
    ["governorates", "GovernorateId"],
    ["dutyStates", "StateId"],
    ["ignorants", "IgnorantId"],
    ["groups", "GroupId"],
    ["degrees", "DegreeId"],
    ["microfilms", "MicrofilmId"],

    // Web
    ["webAdditionalYears", "WebAdditionalYearId"],
    ["webBloodTypes", "WebBloodTypeId"],
    ["webCaltureLevels", "WebCaltureLevelId"],
    ["webCivilQualifications", "WebCivilQualificationId"],
    ["webDegrees", "webDegreeId"],
    ["webUnits", "WebUnitId"],
    // ["webDegrees", "WebDegreeId"],
    ["webDutyStates", "WebDutyStateId"],
    ["webForces", "WebForceId"],
    ["webGovernorates", "webGovernorateBirthSideId"],
    ["webGovernorates", "webGovernorateNationalCardSideId"], // This will work
    ["webJobBeforeConscriptions", "WebJobBeforeConscriptionId"],
    ["webJobInArmies", "WebJobInArmyId"],
    ["webMaritalStatus", "WebMaritalStatusId"],
    ["webMedicalLevels", "WebMedicalLevelId"],
    ["webMobilizationAreas", "WebAreaId"],
    ["webMoralsDegrees", "WebMoralsDegreeId"], // Next
    ["webMostRelivants", "WebMostRelivantId"],
    ["webPowers", "WebPower_Id"],
    ["webQesms", "WebQesmId"],
    ["webQualifications", "WebQualificationId"],
    ["webReductionStates", "WebReductionStateId"],
    ["webRegions", "WebRegionId"],
    ["webReligions", "WebReligionId"],
    ["webSegelMadanies", "WebSegelMadanyId"],
    ["webUnits", "WebUnitId"],
    ["webZones", "WebZoneId"]
  ],
  old_relationships = [
    ["conscriptes", "dutyTerminations", "hasOne", "MilitaryId"],
    ["dutyTerminations", "conscriptes", "belongsTo", "MilitaryId"],
    ["conscriptes", "promotions", "hasMany", "MilitaryId"],
    ["promotions", "conscriptes", "belongsTo", "MilitaryId"],
    ["conscriptes", "penalties", "hasMany", "MilitaryId"],
    ["penalties", "conscriptes", "belongsTo", "MilitaryId"],
    ["penaltyTypes", "penalties", "hasMany", "penaltyTypeId"],
    ["penalties", "penaltyTypes", "belongsTo", "penaltyTypeId"],
    ["conscriptes", "failureSessions", "hasMany", "milId"],
    ["failureSessions", "conscriptes", "belongsTo", "milId"],

    [
      "committeeCivilans",
      "medicalCommitteeCivilians",
      "hasMany",
      "comitDecisionId"
    ],
    [
      "medicalCommitteeCivilians",
      "committeeCivilans",
      "belongsTo",
      "comitDecisionId"
    ],

    ["zones", "units", "hasMany", "zoneId"],
    ["units", "zones", "belongsTo", "zoneId"],

    ["units", "correspondences", "hasMany", "UnitId"],
    ["correspondences", "units", "belongsTo", "UnitId"],

    ["conscriptes", "fugitives", "hasMany", "MilitaryId"],
    ["fugitives", "conscriptes", "belongsTo", "MilitaryId"],

    ["conscriptes", "injuries", "hasMany", "MilitaryId"],
    ["injuries", "conscriptes", "belongsTo", "MilitaryId"],

    ["conscriptes", "courts", "hasMany", "MilitaryId"],
    ["courts", "conscriptes", "belongsTo", "MilitaryId"],

    ["courts", "procedures", "hasMany", "CourtId"],
    ["procedures", "courts", "belongsTo", "CourtId"],

    ["injuries", "procedures", "hasMany", "injurytId"],
    ["procedures", "injuries", "belongsTo", "injurytId"],

    ["exemptions", "procedures", "hasMany", "ExemptionId"],
    ["procedures", "exemptions", "belongsTo", "ExemptionId"],

    ["accidents", "procedures", "hasMany", "AccidentId"],
    ["procedures", "accidents", "belongsTo", "AccidentId"],

    ["travilingAbroads", "procedures", "hasMany", "TravilingAbroad_TravilId"],
    ["procedures", "travilingAbroads", "belongsTo", "TravilingAbroad_TravilId"],

    ["conscriptes", "medicalCommittees", "hasMany", "MilitaryId"],
    ["medicalCommittees", "conscriptes", "belongsTo", "MilitaryId"],

    ["conscriptes", "prevPeriod", "hasOne", "militaryId"],
    ["prevPeriod", "conscriptes", "belongsTo", "militaryId"],

    ["mokatabas", "mokatabas", "hasMany", "ConnectedMokatabaId"],
    ["mokatabas", "mokatabas", "belongsTo", "ConnectedMokatabaId"],

    ["messengerChats", "messengerChats", "hasOne", "ReplyOnId"],
    ["messengerChats", "messengerChats", "belongsTo", "ReplyOnId"],

    [
      "medicalCommitteeTypes",
      "medicalCommittees",
      "hasMany",
      "MedicalCommitteeTypeID"
    ],
    [
      "medicalCommittees",
      "medicalCommitteeTypes",
      "belongsTo",
      "MedicalCommitteeTypeID"
    ],

    ["committees", "medicalCommittees", "hasMany", "comitDecisionId"],
    ["medicalCommittees", "committees", "belongsTo", "comitDecisionId"],

    // Injuries can Exist without a MedicalCommittee,
    // So I added the forign key in MedicalCommittees
    ["injuries", "medicalCommittees", "hasOne", "InjuryId"],
    ["medicalCommittees", "injuries", "belongsTo", "InjuryId"],

    ["healingReports", "injuries", "hasMany", "healingReportId"],
    ["injuries", "healingReports", "belongsTo", "healingReportId"],

    [
      "medicalCommitteeTypes",
      "medicalCommitteeCivilians",
      "hasMany",
      "MedicalCommitteeTypeID"
    ],
    [
      "medicalCommitteeCivilians",
      "medicalCommitteeTypes",
      "belongsTo",
      "MedicalCommitteeTypeID"
    ],

    [
      "committeeCivilans",
      "medicalCommitteeCivilians",
      "hasMany",
      "comitDecisionId"
    ],
    [
      "committeeCivilans",
      "medicalCommitteeTypes",
      "belongsTo",
      "comitDecisionId"
    ],

    // Calendars
    ["calendarDegrees", "calendars", "hasMany", "DegreeId"],
    ["calendars", "calendarDegrees", "belongsTo", "DegreeId"],

    ["calendarTypes", "calendars", "hasMany", "TypeId"],
    ["calendars", "calendarTypes", "belongsTo", "TypeId"],

    ["users", "calendars", "hasMany", "AddedBy"],
    ["calendars", "users", "belongsTo", "AddedBy"],

    ["calendarAlarms", "calendars", "hasMany", "AddedBy"],
    ["calendars", "calendarAlarms", "belongsTo", "AddedBy"],

    ["sections", "calendars", "hasMany", "SectionId"],
    ["calendars", "sections", "belongsTo", "SectionId"],

    //////////////////
    // treatment cards
    //////////////////
    ["conscriptes", "cards", "hasMany", "consMilitaryId"],
    ["cards", "conscriptes", "belongsTo", "consMilitaryId"],

    ["cards", "cardsTracking", "hasMany", "cardId", "CASCADE"],
    ["cardsTracking", "cards", "belongsTo", "cardId"],

    ["cardTypes", "cards", "hasMany", "typeId"],
    ["cards", "cardTypes", "belongsTo", "typeId"],

    ["cardsHospitals", "cardsTracking", "hasMany", "hospitalId"],
    ["cardsTracking", "cardsHospitals", "belongsTo", "hospitalId"],

    ["users", "cardsTracking", "hasMany", "referenceId"],
    ["cardsTracking", "users", "belongsTo", "referenceId"],

    ["offices", "cardsTracking", "hasMany", "officeId"],
    ["cardsTracking", "offices", "belongsTo", "officeId"],

    ["conscriptes", "cardsFamilyMembers", "hasMany", "consMilitaryId"],
    ["cardsFamilyMembers", "conscriptes", "belongsTo", "consMilitaryId"],

    ["cardsFamilyTypeRel", "cardsFamilyMembers", "hasMany", "familyTypeRelId"],
    [
      "cardsFamilyMembers",
      "cardsFamilyTypeRel",
      "belongsTo",
      "familyTypeRelId"
    ],

    ["religions", "cardsFamilyMembers", "hasMany", "religionId"],
    ["cardsFamilyMembers", "religions", "belongsTo", "religionId"],

    ["nationalities", "cardsFamilyMembers", "hasMany", "nationalityId"],
    ["cardsFamilyMembers", "nationalities", "belongsTo", "nationalityId"],

    ["governorates", "cardsFamilyMembers", "hasMany", "governorateId"],
    ["cardsFamilyMembers", "governorates", "belongsTo", "governorateId"],

    ["cards", "cardsFamilyMembers", "hasMany", "cardId", "SET NULL"],
    ["cardsFamilyMembers", "cards", "belongsTo", "cardId"],

    ["cardsFamilyMembers", "cardsDiagnoses", "hasMany", "memberId", "CASCADE"],
    ["cardsDiagnoses", "cardsFamilyMembers", "belongsTo", "memberId"],

    ["cardsFamilyMembers", "cardsEducations", "hasOne", "memberId", "CASCADE"],
    ["cardsEducations", "cardsFamilyMembers", "belongsTo", "memberId"],

    ["cardsCertificants", "cardsTracking", "hasMany", "certificantId"],
    ["cardsTracking", "cardsCertificants", "belongsTo", "certificantId"]
  ],
  web_relationships = [
    [
      "webCivilQualificationGroups",
      "webCivilQualifications",
      "hasMany",
      "groupId"
    ],
    [
      "webCivilQualifications",
      "webCivilQualificationGroups",
      "belongsTo",
      "groupId"
    ],
    // فيهم كلام
    ["webUnits", "webConscripteUnits", "hasMany", "WebUnitId"],
    ["webConscripteUnits", "webUnits", "belongsTo", "WebUnitId"],
    ["conscriptes", "webConscripteUnits", "hasMany", "MilitaryId"],
    ["webConscripteUnits", "conscriptes", "belongsTo", "MilitaryId"],
    ["units", "webUnits", "hasMany", "unitId"],
    ["webUnits", "units", "belongsTo", "unitId"],
    // ليه اللي فوق فيهم كلام؟
    // عشان العلاقة اللي بينهم
    // belongsToMany
    // ودي لسة متعلمتهاش كويس
    // ["webUnits", "webUnitLeaders", "hasOne", "Leader_Id"],
    // ["webUnitLeaders", "webUnits", "belongsTo", "Leader_Id"],

    ["webCourtPlaces", "webPenalities", "hasMany", "CourtPlaceId"],
    ["webPenalities", "webCourtPlaces", "belongsTo", "CourtPlaceId"],
    ["webPenalityKinds", "webPenalities", "hasMany", "KindId"],
    ["webPenalities", "webPenalityKinds", "belongsTo", "KindId"],
    ["webPenalityOrderers", "webPenalities", "hasMany", "OrdererId"],
    ["webPenalities", "webPenalityOrderers", "belongsTo", "OrdererId"],
    ["webPenalityTypes", "webPenalities", "hasMany", "TypeId"],
    ["webPenalities", "webPenalityTypes", "belongsTo", "TypeId"],
    ["conscriptes", "webPenalities", "hasMany", "MilitaryId"],
    ["webPenalities", "conscriptes", "belongsTo", "MilitaryId"],

    ["conscriptes", "webChipsFollowups", "hasMany", "MilitaryId"],
    ["webChipsFollowups", "conscriptes", "belongsTo", "MilitaryId"],

    ["webPromotionTypes", "webPromotions", "hasMany", "TypeId"],
    ["webPromotions", "webPromotionTypes", "belongsTo", "TypeId"],
    ["webDegrees", "webPromotions", "hasMany", "DegreeId"],
    ["webPromotions", "webDegrees", "belongsTo", "DegreeId"],
    ["conscriptes", "webPromotions", "hasMany", "MilitaryId"],
    ["webPromotions", "conscriptes", "belongsTo", "MilitaryId"],

    ["webTa3Be2AType", "webTa3Be2A", "hasMany", "TypeId"],
    ["webTa3Be2A", "webTa3Be2AType", "belongsTo", "TypeId"],
    ["conscriptes", "webTa3Be2A", "hasMany", "MilitaryId"],
    ["webTa3Be2A", "conscriptes", "belongsTo", "MilitaryId"],

    ["webDegrees", "webUnitLeaders", "hasMany", "DegreeId"],
    ["webUnitLeaders", "webDegrees", "belongsTo", "DegreeId"],

    ["webLicenceTypes", "webLicences", "hasMany", "TypeId"],
    ["webLicences", "webLicenceTypes", "belongsTo", "TypeId"],
    ["conscriptes", "webLicences", "hasMany", "MilitaryId"],
    ["webLicences", "conscriptes", "belongsTo", "MilitaryId"],

    ["webGovernorates", "webQesms", "hasMany", "webGovernorateId"],
    ["webQesms", "webGovernorates", "belongsTo", "webGovernorateId"],

    ["webGovernorates", "webSegelMadanies", "hasMany", "webGovernorateId"],
    ["webSegelMadanies", "webGovernorates", "belongsTo", "webGovernorateId"],

    ["webZones", "webUnits", "hasMany", "WebZoneId"],
    ["webUnits", "webZones", "belongsTo", "WebZoneId"],

    ["webOperations", "webOperationHistories", "hasMany", "webOperationId"],
    ["webOperationHistories", "webOperations", "belongsTo", "webOperationId"],

    ["webOperations", "webOperationErrors", "hasMany", "webOperationId"],
    ["webOperationErrors", "webOperations", "belongsTo", "webOperationId"],

    [
      "webOperationHistories",
      "webOperationErrors",
      "hasMany",
      "webOperationHistoryId"
    ],
    [
      "webOperationErrors",
      "webOperationHistories",
      "belongsTo",
      "webOperationHistoryId"
    ],
    ["users", "dafaterRel", "hasMany", "userId"],
    ["dafaterRel", "users", "belongsTo", "userId"],
    ["conscriptes", "dafaterRel", "hasMany", "MilitaryId"],
    ["dafaterRel", "conscriptes", "belongsTo", "MilitaryId"],
    ["dafaterImages", "dafaterRel", "hasMany", "ImageId"],
    ["dafaterRel", "dafaterImages", "belongsTo", "ImageId"],
    ["dafater", "dafaterImages", "hasMany", "DafaterId"],
    ["dafaterImages", "dafater", "belongsTo", "DafaterId"],
    ["users", "dafater", "hasMany", "assignedTo"],
    ["dafater", "users", "belongsTo", "assignedTo"],
    ["webS2Cards", "webS2Okobat", "hasMany", "cardId"],
    ["webS2Okobat", "webS2Cards", "belongsTo", "cardId"],

    ["webMobilizationAreas", "dafater", "hasMany", "mohafzaId"],
    ["dafater", "webMobilizationAreas", "belongsTo", "mohafzaId"]
  ],
  cons_relationships = [
    ["conscriptes", "militaryOperationParticipants", "hasMany", "militaryId"],
    [
      "militaryOperationParticipants",
      "militaryOperations",
      "belongsTo",
      "militaryOperationId"
    ],
    [
      "militaryOperations",
      "militaryOperationParticipants",
      "hasMany",
      "militaryOperationId"
    ]
  ];

hasManyConscriptes.forEach(arr => {
  if (arr[0] && arr[1]) {
    let source = [arr[0], "conscriptes", "hasMany", arr[1]];
    cons_relationships.push(source);
    let distination = ["conscriptes", arr[0], "belongsTo", arr[1]];
    cons_relationships.push(distination);
  }
});

let all_relationships = [
  ...old_relationships,
  ...web_relationships,
  ...cons_relationships
];

module.exports = () => all_relationships;
