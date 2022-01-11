/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "conscriptes",
    {
      updatedDegree: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        field: "UpdatedDegree"
      },
      militaryId: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        field: "MilitaryId"
      },
      fullName: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "FullName"
      },
      tripartiteNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "TripartiteNumber"
      },
      conscriptionDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "ConscriptionDate"
      },
      demobilizationDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "DemobilizationDate"
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Address"
      },
      notes: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Notes"
      },
      forceId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Forces",
          key: "ForceId"
        },
        field: "ForceId"
      },
      areaId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "MobilizationAreas",
          key: "AreaId"
        },
        field: "AreaId"
      },
      qualificationId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Qualifications",
          key: "QualificationId"
        },
        field: "QualificationId"
      },
      periodId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Periods",
          key: "Id"
        },
        field: "PeriodId"
      },
      stateId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "DutyStates",
          key: "StateId"
        },
        field: "StateId"
      },
      unitId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "UnitId"
      },
      zoneId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Zones",
          key: "ZoneId"
        },
        field: "ZoneId"
      },
      jobId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Jobs",
          key: "JobId"
        },
        field: "JobId"
      },
      martialStateId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "MartialStates",
          key: "MartialStateId"
        },
        field: "MartialStateId"
      },
      groupId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Groups",
          key: "GroupId"
        },
        field: "GroupId"
      },
      additionalYearStateId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "AdditionalYears",
          key: "AdditionalYearStateId"
        },
        field: "AdditionalYearStateId"
      },
      reductionStateId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "ReductionStates",
          key: "ReductionStateId"
        },
        field: "ReductionStateId"
      },
      licenseId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Licenses",
          key: "LicenseId"
        },
        field: "LicenseId"
      },
      degreeId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Degrees",
          key: "DegreeId"
        },
        field: "DegreeId"
      },
      lostPeriodStateId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "LostPeriodStates",
          key: "StateId"
        },
        field: "LostPeriodStateId"
      },
      endingDutyDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "EndingDutyDate"
      },
      sourceId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "SuplySources",
          key: "SourceID"
        },
        field: "SourceID"
      },
      typeId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "DutyTypes",
          key: "DutyTypeID"
        },
        field: "TypeId"
      },
      ignorantId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Ignorants",
          key: "Id"
        },
        field: "IgnorantId"
      },
      modifiedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Users",
          key: "UserId"
        },
        field: "ModifiedBy"
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        field: "IsVerified"
      },
      verifiedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Users",
          key: "UserId"
        },
        field: "VerifiedBy"
      },
      isConfirmed: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        field: "IsConfirmed"
      },
      confirmedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Users",
          key: "UserId"
        },
        field: "ConfirmedBy"
      },
      lastModifiedDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "LastModifiedDate"
      },
      lastModifiedType: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "LastModifiedType"
      },
      microfilmId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Microfilms",
          key: "MicrofilmId"
        },
        field: "MicrofilmId"
      },
      microfilmSortIndex: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "MicrofilmSortIndex"
      },
      ignorantSupporterPlace: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "IgnorantSupporterPlace"
      },
      attachedUnitId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "AttachedUnits",
          key: "ID"
        },
        field: "AttachedUnit_ID"
      },
      birthDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "BirthDate"
      },
      notesDemobilization: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "NotesDemobilization"
      },
      canRadModa: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        field: "CanRadModa"
      },
      stateIdCurrent: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "DutyCurrentStates",
          key: "StateId"
        },
        field: "StateIdCurrent"
      },
      nationalId: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "NationalId"
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Phone"
      },
      oldNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "OldNumber"
      },
      highSalaryPayingOutDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "HighSalaryPayingOutDate"
      },
      currentPromotionDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "CurrentPromotionDate"
      },
      currentUnitJoiningDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "CurrentUnitJoiningDate"
      },
      wifeCount: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "WifeCount"
      },
      sonsCount: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "SonsCount"
      },
      daughtersCount: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "DaughtersCount"
      },
      checkup40: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "Checkup40"
      },
      medicalLevel: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "MedicalLevel"
      },
      specialization: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "Specialization"
      },
      parents: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "Parents"
      },
      s2Receive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: "0",
        field: "S2Receive"
      },
      idValid: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: "0",
        field: "IdValid"
      },
      idCorrupted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: "0",
        field: "IdCorrupted"
      },
      idLost: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: "0",
        field: "IdLost"
      },
      licenceValid: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: "0",
        field: "licenceValid"
      },
      licenceCorrupted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: "0",
        field: "licenceCorrupted"
      },
      licenceLost: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: "0",
        field: "licenceLost"
      },
      s25Valid: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: "0",
        field: "S25Valid"
      },
      s25Correction: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: "0",
        field: "S25Correction"
      },
      s25YearLost: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: "0",
        field: "S25YearLost"
      },
      confirmationDate40: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "ConfirmationDate40"
      },
      reviewDate40: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "ReviewDate40"
      },
      letterSendingDate40: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "LetterSendingDate40"
      },
      mawqef: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "mawqef"
      },
      ispunished: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        field: "Ispunished"
      },
      modaYear: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "Moda_Year"
      },
      modaMonth: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "Moda_Month"
      },
      modaDay: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "Moda_Day"
      },
      situationId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "SituationId"
      },
      delete: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: "0",
        field: "delete"
      },
      ignorantFollowedAddedDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "IgnorantFollowedAddedDate"
      },
      ignorantFollowedEndedDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "IgnorantFollowedEndedDate"
      },
      oldUnitId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "OldUnits",
          key: "UnitId"
        },
        field: "OldUnitId"
      },
      webPowerId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "WebPowerId"
      },
      webAreaId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "WebMobilizationAreas",
          key: "Id"
        },
        field: "WebAreaId"
      },
      webAdditionalYearId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "WebAdditionalYears",
          key: "Id"
        },
        field: "WebAdditionalYearId"
      },
      webZoneId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "WebZones",
          key: "Id"
        },
        field: "WebZoneId"
      },
      webDutyStateId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "WebDutyStates",
          key: "Id"
        },
        field: "WebDutyStateId"
      },
      webQualificationId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "WebQualifications",
          key: "Id"
        },
        field: "WebQualificationId"
      },
      webJobInArmyId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "WebJobInArmies",
          key: "Id"
        },
        field: "WebJobInArmyId"
      },
      webForceId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "WebForces",
          key: "Id"
        },
        field: "WebForceId"
      },
      webReductionStateId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "WebReductionStates",
          key: "Id"
        },
        field: "WebReductionStateId"
      },
      webCaltureLevelId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "WebCaltureLevelId"
      },
      webMedicalLevelId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "WebMedicalLevels",
          key: "Id"
        },
        field: "WebMedicalLevelId"
      },
      webLastComsionDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "WebLastComsionDate"
      },
      webCivilQualificationId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "WebCivilQualifications",
          key: "Id"
        },
        field: "WebCivilQualificationId"
      },
      webBloodTypeId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "WebBloodTypes",
          key: "Id"
        },
        field: "WebBloodTypeId"
      },
      webReligionId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "WebReligions",
          key: "Id"
        },
        field: "WebReligionId"
      },
      webMaritalStatusId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "WebMaritalStatus",
          key: "Id"
        },
        field: "WebMaritalStatusId"
      },
      webJobBeforeConscriptionId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "WebJobBeforeConscriptions",
          key: "Id"
        },
        field: "WebJobBeforeConscriptionId"
      },
      webRegionId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "WebRegions",
          key: "Id"
        },
        field: "WebRegionId"
      },
      webGovernorateBirthSideId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "WebGovernorates",
          key: "Id"
        },
        field: "WebGovernorateBirthSideId"
      },
      webGovernorateNationalCardSideId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "WebGovernorates",
          key: "Id"
        },
        field: "WebGovernorateNationalCardSideId"
      },
      webQesmId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "WebQesmId"
      },
      webSegelMadanyId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "WebSegelMadanyId"
      },
      webMostRelivantId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "WebMostRelivants",
          key: "Id"
        },
        field: "WebMostRelivantId"
      },
      webUnitId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "WebUnits",
          key: "Id"
        },
        field: "WebUnitId"
      },
      webConscriptionDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "WebConscriptionDate"
      },
      webDemobilizationDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "WebDemobilizationDate"
      },
      webServicePeriod: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "WebServicePeriod"
      },
      webLostPeriod: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "WebLostPeriod"
      },
      webClearServicePeriod: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "WebClearServicePeriod"
      },
      webMoralsDegreeId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "WebMoralsDegrees",
          key: "Id"
        },
        field: "WebMoralsDegreeId"
      },
      isWeb: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: "0",
        field: "IsWeb"
      },
      daftarBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Users",
          key: "UserId"
        },
        field: "DaftarBy"
      },
      daftarNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "DaftarNumber"
      },
      daftarId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "DaftarId"
      },
      webGovernorateId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "WebGovernorates",
          key: "Id"
        },
        field: "WebGovernorate_Id"
      },
      webAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "WebAt"
      },
      unitDaftarTa3Be2A: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "UnitDaftarTa3be2a"
      },
      governorateId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Governorates",
          key: "Id"
        },
        field: "GovernorateId"
      },
      religionId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Religions",
          key: "Id"
        },
        field: "ReligionId"
      },
      bloodTypeId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "BloodTypes",
          key: "Id"
        },
        field: "BloodTypeId"
      },
      localAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "LocalAt"
      },
      demobilizationDateStarter: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "DemobilizationDateStarter"
      },
      powerId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "WebPowers",
          key: "Id"
        },
        field: "PowerId"
      },
      jobInArmyId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "JobInArmies",
          key: "Id"
        },
        field: "JobInArmyId"
      },
      caltureLevelId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "WebCaltureLevels",
          key: "Id"
        },
        field: "CaltureLevelId"
      },
      medicalLevelId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "WebMedicalLevels",
          key: "Id"
        },
        field: "MedicalLevelId"
      },
      lastComsionDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "LastComsionDate"
      },
      civilQualificationId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "WebCivilQualifications",
          key: "Id"
        },
        field: "CivilQualificationId"
      },
      jobBeforeConscriptionId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "WebJobBeforeConscriptions",
          key: "Id"
        },
        field: "JobBeforeConscriptionId"
      },
      regionId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "WebRegions",
          key: "Id"
        },
        field: "RegionId"
      },
      governorateBirthSideId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "WebGovernorates",
          key: "Id"
        },
        field: "GovernorateBirthSideId"
      },
      governorateNationalCardSideId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "WebGovernorates",
          key: "Id"
        },
        field: "GovernorateNationalCardSideId"
      },
      qesmId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "WebQesms",
          key: "Id"
        },
        field: "QesmId"
      },
      segelMadanyId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "WebSegelMadanies",
          key: "Id"
        },
        field: "SegelMadanyId"
      },
      mostRelivantId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "WebMostRelivants",
          key: "Id"
        },
        field: "MostRelivantId"
      },
      servicePeriod: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "ServicePeriod"
      },
      lostPeriod: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "LostPeriod"
      },
      clearServicePeriod: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "ClearServicePeriod"
      },
      moralsDegreeId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "WebMoralsDegrees",
          key: "Id"
        },
        field: "MoralsDegreeId"
      },
      afradAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "AfradAt"
      },
      el7Aq: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        field: "El7aq"
      },
      el7AqUnitId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Units",
          key: "UnitId"
        },
        field: "El7aqUnitId"
      },
      ta7TEltawze3: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        field: "Ta7tEltawze3"
      },
      indexNo: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "IndexNo"
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Image"
      },
      imagePath: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "ImagePath"
      },
      webCaltureLevelId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "WebCaltureLevels",
          key: "Id"
        },
        field: "WebCaltureLevel_Id"
      },
      unitUnitId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Units",
          key: "UnitId"
        },
        field: "Unit_UnitId"
      },
      webQesmId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "WebQesms",
          key: "Id"
        },
        field: "WebQesm_Id"
      },
      webSegelMadanyId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "WebSegelMadanies",
          key: "Id"
        },
        field: "WebSegelMadany_Id"
      },
      // webMedicalLevelId: {
      //   type: DataTypes.INTEGER,
      //   allowNull: true,
      //   references: {
      //     model: "WebMedicalLevels",
      //     key: "Id"
      //   },
      //   field: "WebMedicalLevel_Id"
      // },
      webPower_Id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "WebPowers",
          key: "Id"
        },
        field: "WebPower_Id"
      },
      markazId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Markazs",
          key: "Id"
        },
        field: "MarkazId"
      },
      webDegreeId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "WebDegrees",
          key: "Id"
        },
        field: "WebDegreeId"
      },
      hasImage: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        field: "HasImage"
      },
      daftarAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "DaftarAt"
      },
      arrivalDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "ArrivalDate"
      },
      ignorantSupporterId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "IgnorantSupporters",
          key: "Id"
        },
        field: "IgnorantSupporterId"
      },
      isLamYodraj: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        field: "IsLamYodraj"
      },
      treatmentCardNotes: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: "TreatmentCardNotes"
      },
      isPartInMilitaryOperation: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        field: "IsPartInMilitaryOperation"
      }
    },
    {
      tableName: "Conscriptes",
      timestamps: false
    }
  );
};
