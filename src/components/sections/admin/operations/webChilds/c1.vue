<template>
  <div></div>
</template>

<script>
export default {
  name: "web-child-1",
  props: {
    currentUnitId: {
      type: Number,
      default: 0
    },
    currentCons: {
      type: Array,
      default: () => {
        return [];
      }
    },
    controlOp: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data: () => ({
    numbers_passed_conscriptes: 0,
    forceList: [],
    stopOperationOk: false,
    segelatWeb: false,
    dateFormat: "DDMMYYYY",
    xhttp: null
  }),
  watch: {
    numbers_passed_conscriptes(v) {
      if (!this.stopOperationOk) {
        if (v && v > 0) {
          this.$emit("numbers_passed_conscriptes");
          // if (v < this.forceList) {
          this.loadDoc(v);
          // }
        }
      }
    }
  },
  sockets: {
    gotMyIdData1(x) {
      let { data, id, error } = x;
      console.log("ID : " + id);
      if (error) {
        console.log("There was error parsing id: " + id);
        console.log(error);
        this.$emit("pushError", {
          id,
          type: "فرد",
          errors: ["تعذر تحليل ملفه من النود", error],
          segelatWeb: this.segelatWeb
        });
        this.addPrimaryData(id);
      } else {
        this.$emit("removeError", {
          id,
          type: "فرد",
          errors: ["تعذر تحليل ملفه من النود"],
          segelatWeb: this.segelatWeb
        });
        data.militaryId = id;
        this.fixAndAddConscripte(data);
      }
      this.$set(
        this,
        "numbers_passed_conscriptes",
        this.numbers_passed_conscriptes + 1
      );
    }
  },
  methods: {
    stopOperation() {
      //
    },
    getValues(table, where = {}) {
      return this.api("global/get_all", {
        table,
        where
      })
        .then(x => {
          return x.data;
        })
        .catch(err => {
          console.log("getValues Error:");
          console.log(err);
          // this.showError(err);
          return null;
        });
    },
    getOneValue(table, where = {}) {
      return this.api("global/get_one", {
        table,
        where
      })
        .then(x => {
          return x.data;
        })
        .catch(err => {
          if (err.data) {
            console.log("getOneValue Error:");
            console.log(err);
            // this.showError(err);
          }
          return null;
        });
    },
    setOneValue(table, where = {}, returner = "id") {
      return this.api("global/create_one", {
        table,
        where,
        returner
      })
        .then(x => {
          return x.data;
        })
        .catch(err => {
          console.log({
            table,
            where,
            returner
          });
          console.log(err);
          // this.showError(err);
          return null;
        });
    },
    setValues(table, wheres = [], nodes = [], dates = [], returner = "id") {
      wheres.forEach(async (where, i) => {
        dates.forEach(date => {
          where[date] = this.dateIfExists(where[date]);
        });
        where = await this.fixBeforeSet(where, nodes);
        await this.setOneValue(table, where, returner);
      });
      return true;
    },
    fixBeforeSet(where, nodes) {
      return new Promise((success, failure) => {
        if (nodes.length > 0) {
          let counter = 0;
          nodes.forEach(async node => {
            where[node.dbKey] = await this.getMyValue(
              where[node.key],
              node.table
            );
            counter++;
            if (counter == nodes.length) {
              success(where);
            }
          });
        } else {
          success(where);
        }
      });
    },
    getMyOldValue(
      table = "",
      neededKey = "",
      suppliedKey = "",
      suppliedValue = ""
    ) {
      return new Promise((success, failure) => {
        return !suppliedValue
          ? success(null)
          : this.getOneValue(table, {
              [suppliedKey]: suppliedValue
            })
              .then(x => {
                if (x && x[neededKey]) {
                  return success(x[neededKey]);
                } else {
                  return success(null);
                }
              })
              .catch(err => {
                failure(err);
              });
      });
    },
    getMyValue(
      val,
      table,
      id = "id",
      dbKey = "displayedText",
      link = {
        val: "",
        table: "",
        id: "id",
        key: "typeId",
        dbKey: "displayedText"
      }
    ) {
      return new Promise((success, failure) => {
        return !val
          ? success(null)
          : this.getOneValue(table, {
              [dbKey]: val
            })
              .then(x => {
                if (x && x[id]) {
                  return success(x[id]);
                } else {
                  if (
                    link.table &&
                    link.id &&
                    link.val &&
                    link.val.length > 0
                  ) {
                    let setter = {
                      [dbKey]: val
                    };
                    this.getOneValue(link.table, {
                      [link.dbKey]: link.val
                    }).then(async linkx => {
                      if (linkx && linkx[link.id]) {
                        setter[link.key] = linkx[link.id];
                        return this.setOneValue(table, setter)
                          .then(xx => {
                            success(xx);
                          })
                          .catch(error => {
                            failure(error);
                          });
                      } else {
                        setter[link.key] = await this.setOneValue(link.table, {
                          [link.dbKey]: link.val
                        });
                        return this.setOneValue(table, setter)
                          .then(xx => {
                            success(xx);
                          })
                          .catch(error => {
                            failure(error);
                          });
                      }
                    });
                  } else {
                    return this.setOneValue(table, {
                      [dbKey]: val
                    })
                      .then(xx => {
                        success(xx);
                      })
                      .catch(error => {
                        failure(error);
                      });
                  }
                }
              })
              .catch(err => {
                failure(err);
              });
      });
    },
    async getMyObjectValue(obj = {}, table = "", uniqueKey = "id") {
      return new Promise((success, failure) => {
        return this.getOneValue(table, obj)
          .then(x => {
            if (x && x[uniqueKey]) {
              success(x[uniqueKey]);
            } else {
              if (
                Object.values(obj).filter(v => v && v.length > 0).length == 0
              ) {
                return success(null);
              } else {
                obj.createdAt = new Date();
                return this.setOneValue(table, obj)
                  .then(xx => {
                    success(xx);
                  })
                  .catch(error => {
                    failure(error);
                  });
              }
            }
          })
          .catch(err => {
            failure(err);
          });
      });
    },
    deleteMyValues(table, where) {
      // console.log("Tring To Delete");
      // console.log({
      //   [table]: where
      // });
      return new Promise((success, failure) => {
        return this.api("global/delete_all", {
          table,
          where
        })
          .then(x => {
            success(x.data);
          })
          .catch(err => {
            failure(err.data);
          });
      });
    },
    dateIfExists(str) {
      if (str && str.length > 0) {
        if (this.dateFormat == "MMDDYYYY") {
          return new Date(str) == "Invalid Date" ? null : new Date(str);
        } else {
          let strSplitted = str.split("-");
          let reformattedDate = new Date(
            strSplitted[1] + "-" + strSplitted[0] + "-" + strSplitted[2]
          );
          return reformattedDate == "Invalid Date" ? null : reformattedDate;
        }
      }
      return null;
    },
    checkOrAddConscripte(militaryId) {
      return new Promise((success, failure) => {
        return this.api("global/get_one", {
          table: "conscriptes",
          where: {
            militaryId
          },
          attrs: ["militaryId"]
        })
          .then(x => {
            //
            if (x.data && x.data.militaryId) {
              success({
                created: false,
                found: true
              });
            } else {
              this.api("global/create_one", {
                table: "conscriptes",
                where: {
                  militaryId
                }
              })
                .then(x => {
                  // Ok
                  success({
                    created: true,
                    found: true
                  });
                })
                .catch(err => {
                  failure(err);
                });
            }
          })
          .catch(err => {
            this.api("global/create_one", {
              table: "conscriptes",
              where: {
                militaryId
              }
            })
              .then(x => {
                // Ok
                success({
                  created: true,
                  found: false
                });
              })
              .catch(err => {
                failure(err);
              });
          });
      });
    },
    async fixAndAddConscripte(conscripte) {
      //console.log('conscripte : ',conscripte);
      this.dateFormat = this.getDateFormat(
        conscripte.nationalId,
        conscripte.birthDate
      );
      let fixedConscripte = {};

      // ! NEXT LINES ARE TEMPORARY, WILL BE REMOVED SOON
      // let webCon = await this.api("global/get_or_create", {
      //     table: "webConscriptes",
      //     where: {
      //       militaryId: conscripte.militaryId
      //     }
      //   }),
      //   updateWebCon = await this.api("global/update_one", {
      //     table: "webConscriptes",
      //     where: {
      //       militaryId: conscripte.militaryId
      //     },
      //     update: conscripte
      //   });
      // return;
      // ! PREVIOUS LINES ARE TEMPORARY, WILL BE REMOVED SOON
      this.checkOrAddConscripte(conscripte.militaryId)
        .then(async x => {
          fixedConscripte.isNew = x.created;
          let idetifier =
              conscripte.militaryId.length == 13
                ? conscripte.militaryId.slice(6, 8)
                : null,
            whiteList = ["52", "18", "66", "04", "77", "88"];
          // 66 سائق
          // كاتب
          // مشاه اجهزه قياده
          // ٨٨ ظابط احتياط
          // ١٨ سواق راتب عالي
          fixedConscripte.isHodod = idetifier && whiteList.includes(idetifier);
          fixedConscripte.groupId =
            idetifier == "66"
              ? 2
              : idetifier == "04"
              ? 3
              : idetifier == "88"
              ? 4
              : 1;
          if (idetifier == "77") {
            fixedConscripte.forceId = 77;
          }
          fixedConscripte.webAt = conscripte.webAt;
          fixedConscripte.unitId = this.currentUnitId;
          Object.keys(conscripte).forEach(async key => {
            // conscripte[key] &&
            //   (((typeof conscripte[key] == "string" ||
            //     Array.isArray(conscripte[key])) &&
            //     conscripte[key].length > 0) ||
            //     typeof conscripte[key] == "object")
            if (
              conscripte[key] !== null &&
              typeof conscripte[key] !== "undefined" &&
              conscripte[key] !== undefined
            )
              switch (key) {
                case "militaryId":
                  fixedConscripte.militaryId = conscripte[key];
                  break;
                case "tripartiteNumber":
                  fixedConscripte.tripartiteNumber = conscripte[key];
                  break;
                case "area":
                  fixedConscripte.webAreaId = await this.getMyValue(
                    conscripte[key],
                    "webMobilizationAreas"
                  );
                  let areaId = await this.getMyOldValue(
                    "mobilizationAreas",
                    "areaId",
                    "name",
                    conscripte[key]
                  );
                  if (areaId) {
                    fixedConscripte.areaId = areaId;
                  }
                  break;
                case "powers":
                  fixedConscripte.webPower_Id = await this.getMyValue(
                    conscripte[key],
                    "webPowers"
                  );
                  break;
                case "additionalYear":
                  fixedConscripte.webAdditionalYearId = await this.getMyValue(
                    conscripte[key],
                    "webAdditionalYears"
                  );
                  let additionalYearStateId = await this.getMyOldValue(
                    "additionalYears",
                    "additionalYearStateId",
                    "state",
                    conscripte[key]
                  );
                  if (additionalYearStateId) {
                    fixedConscripte.additionalYearStateId = additionalYearStateId;
                  }
                  break;
                case "zone":
                  fixedConscripte.webZoneId = await this.getMyValue(
                    conscripte[key],
                    "webZones"
                  );
                  let zoneId = await this.getMyOldValue(
                    "zones",
                    "zoneId",
                    "zoneText",
                    conscripte[key]
                  );
                  if (zoneId) {
                    fixedConscripte.zoneId = zoneId;
                  }
                  break;
                case "dutyState":
                  fixedConscripte.webDutyStateId = await this.getMyValue(
                    conscripte[key],
                    "webDutyStates"
                  );
                  // let stateIdCurrent = await this.getMyOldValue(
                  //   "dutyCurrentStates",
                  //   "stateId",
                  //   "text",
                  //   conscripte[key]
                  // );
                  // if (!conscripte.isHodod) {
                  //   fixedConscripte.stateIdCurrent = stateIdCurrent
                  //     ? stateIdCurrent
                  //     : conscripte[key] == "هارب"
                  //     ? 1
                  //     : 2;
                  // }
                  break;
                case "fullName":
                  fixedConscripte.fullName = conscripte[key];
                  break;
                case "qualification":
                  fixedConscripte.webQualificationId = await this.getMyValue(
                    conscripte[key],
                    "webQualifications"
                  );
                  let qualificationId = await this.getMyOldValue(
                      "qualifications",
                      "qualificationId",
                      "name",
                      conscripte[key]
                    ),
                    other3ada = [
                      "أمى",
                      "إبتدائية ازهرية",
                      "إعدادية",
                      "إبتدائية"
                    ];
                  if (qualificationId || other3ada.includes(conscripte[key])) {
                    fixedConscripte.qualificationId = qualificationId
                      ? qualificationId
                      : "0";
                  }
                  break;
                case "jobInArmy":
                  fixedConscripte.webJobInArmyId = await this.getMyValue(
                    conscripte[key],
                    "webJobInArmies"
                  );
                  break;
                case "force":
                  fixedConscripte.webForceId = await this.getMyValue(
                    conscripte[key],
                    "webForces"
                  );
                  let forceId = await this.getMyOldValue(
                    "forces",
                    "forceId",
                    "name",
                    conscripte[key]
                  );
                  if (forceId) {
                    fixedConscripte.forceId = forceId;
                  }
                  break;
                case "webConscriptionDate":
                  fixedConscripte.webConscriptionDate = this.dateIfExists(
                    conscripte[key]
                  );
                  if (fixedConscripte.webConscriptionDate) {
                    fixedConscripte.conscriptionDate =
                      fixedConscripte.webConscriptionDate;
                  }
                  break;
                case "licences":
                  await this.deleteMyValues("webLicences", {
                    militaryId: conscripte.militaryId
                  });
                  await this.setValues(
                    "webLicences",
                    conscripte[key],
                    [
                      {
                        key: "type",
                        dbKey: "typeId",
                        table: "webLicenceTypes"
                      }
                    ],
                    ["date"]
                  );
                  break;
                case "reductionState":
                  fixedConscripte.webReductionStateId = await this.getMyValue(
                    conscripte[key],
                    "webReductionStates"
                  );
                  let reductionStateId = await this.getMyOldValue(
                    "reductionStates",
                    "reductionStateId",
                    "state",
                    conscripte[key]
                  );
                  if (reductionStateId) {
                    fixedConscripte.reductionStateId = reductionStateId;
                  }
                  break;
                case "webLastComsionDate":
                  fixedConscripte.webLastComsionDate = this.dateIfExists(
                    conscripte[key]
                  );
                  break;
                case "medicalLevel":
                  fixedConscripte.webMedicalLevelId = await this.getMyValue(
                    conscripte[key],
                    "webMedicalLevels"
                  );
                  break;
                case "caltureLevel":
                  fixedConscripte.webCaltureLevelId = await this.getMyValue(
                    conscripte[key],
                    "webCaltureLevels"
                  );
                  break;
                case "ta3be2as":
                  await this.deleteMyValues("webTa3Be2A", {
                    militaryId: conscripte.militaryId
                  });
                  await this.setValues(
                    "webTa3Be2A",
                    conscripte[key],
                    [
                      {
                        key: "type",
                        dbKey: "typeId",
                        table: "webTa3Be2AType"
                      }
                    ],
                    ["date"]
                  );
                  break;
                case "civilQualification":
                  fixedConscripte.webCivilQualificationId = await this.getMyValue(
                    conscripte[key],
                    "webCivilQualifications",
                    "id",
                    "displayedText",
                    {
                      val: conscripte.civilQualificationGroup,
                      table: "webCivilQualificationGroups",
                      id: "id",
                      key: "groupId",
                      dbKey: "displayedText"
                    }
                  );
                  break;
                case "religion":
                  fixedConscripte.webReligionId = await this.getMyValue(
                    conscripte[key],
                    "webReligions"
                  );
                  let religionId = await this.getMyOldValue(
                    "religions",
                    "id",
                    "displayedText",
                    conscripte[key]
                  );
                  if (religionId) {
                    fixedConscripte.religionId = religionId;
                  }
                  break;
                case "bloodType":
                  fixedConscripte.webBloodTypeId = await this.getMyValue(
                    conscripte[key],
                    "webBloodTypes"
                  );
                  let bloodTypeId = await this.getMyOldValue("");
                  fixedConscripte.bloodTypeId = await this.getMyValue(
                    conscripte[key],
                    "bloodTypes"
                  );
                  break;
                case "maritalStatus":
                  fixedConscripte.webMaritalStatusId = await this.getMyValue(
                    conscripte[key],
                    "webMaritalStatus"
                  );
                  break;
                case "birthDate":
                  fixedConscripte.birthDate = this.dateIfExists(
                    conscripte[key]
                  );
                  break;
                case "jobBeforeConscription":
                  fixedConscripte.webJobBeforeConscriptionId = await this.getMyValue(
                    conscripte[key],
                    "webJobBeforeConscriptions"
                  );
                  break;
                case "phone":
                  fixedConscripte.phone = conscripte[key];
                  break;
                case "governorateBirthSide":
                  fixedConscripte.webGovernorateBirthSideId = await this.getMyValue(
                    conscripte[key],
                    "webGovernorates"
                  );
                  break;
                case "qesm":
                  fixedConscripte.webQesmId = await this.getMyValue(
                    conscripte[key],
                    "webQesms",
                    "id",
                    "displayedText",
                    {
                      val:
                        conscripte.governorateBirthSide ||
                        conscripte.governorateNationalCardSide,
                      table: "webGovernorates",
                      id: "id",
                      key: "webGovernorateId",
                      dbKey: "displayedText"
                    }
                  );
                  break;
                case "region":
                  fixedConscripte.webRegionId = await this.getMyValue(
                    conscripte[key],
                    "webRegions"
                  );
                  break;
                case "governorateNationalCardSide":
                  fixedConscripte.webGovernorateNationalCardSideId = await this.getMyValue(
                    conscripte[key],
                    "webGovernorates"
                  );
                  break;
                case "segelMadany":
                  fixedConscripte.webSegelMadanyId = await this.getMyValue(
                    conscripte[key],
                    "webSegelMadanies",
                    "id",
                    "displayedText",
                    {
                      val:
                        conscripte.governorateBirthSide ||
                        conscripte.governorateNationalCardSide,
                      table: "webGovernorates",
                      id: "id",
                      key: "webGovernorateId",
                      dbKey: "displayedText"
                    }
                  );
                  break;
                case "nationalId":
                  fixedConscripte.nationalId = conscripte[key];
                  break;
                case "address":
                  fixedConscripte.address = conscripte[key];
                  break;
                case "mostRelivant":
                  fixedConscripte.webMostRelivantId = await this.getMyObjectValue(
                    conscripte[key],
                    "webMostRelivants"
                  );
                  break;
                case "promotions":
                  await this.deleteMyValues("webPromotions", {
                    militaryId: conscripte.militaryId
                  });
                  await this.setValues(
                    "webPromotions",
                    conscripte[key],
                    [
                      {
                        key: "type",
                        dbKey: "typeId",
                        table: "webPromotionTypes"
                      },
                      {
                        key: "degree",
                        dbKey: "degreeId",
                        table: "webDegrees"
                      }
                    ],
                    ["date"]
                  );
                  break;
                case "currentUnitLeader":
                  // Check if has a degree
                  let degreeId = await this.getMyValue(
                      conscripte[key].degree,
                      "webDegrees"
                    ),
                    leaderId = await this.getMyObjectValue(
                      {
                        name: conscripte[key].name,
                        degreeId
                      },
                      "webUnitLeaders"
                    ),
                    units = [];
                  //console.log('conscripte.units' , conscripte.units);
                  conscripte.units.forEach(async (unit, i) => {
                    let unitObject = {};
                    unitObject.id = await this.getMyObjectValue(
                      {
                        displayedText: unit
                        //unitId: fixedConscripte.unitId
                      },
                      "webUnits"
                    );

                    // for the last unit
                    if (i == conscripte.units.length - 1) {
                      unitObject.webZoneId = fixedConscripte.webZoneId;
                      unitObject.leaderId = leaderId;
                      fixedConscripte.webUnitId = unitObject.id;
                      let allWebUnits = await this.api("global/get_all", {
                        table: "webUnits",
                        where: {
                          id: unitObject.id
                        },
                        include: [
                          {
                            model: "units",
                            required: true
                          }
                        ]
                      });
                      fixedConscripte.unitId =
                        allWebUnits.data && allWebUnits.data.length
                          ? allWebUnits.data[0].unitId
                          : fixedConscripte.unitId
                          ? fixedConscripte.unitId
                          : null;

                      // no relations between units and webunits
                      // although there's a unitId so relate between them.
                      if (!allWebUnits.data.length && fixedConscripte.unitId) {
                        unitObject.unitId = fixedConscripte.unitId;
                      }
                    }
                    let updateUnit = await this.api("global/update_one", {
                      table: "webUnits",
                      where: {
                        id: unitObject.id
                      },
                      update: unitObject
                    });

                    let conscripteUnitId = await this.getMyObjectValue(
                      {
                        militaryId: conscripte.militaryId,
                        webUnitId: unitObject.id
                      },
                      "webConscripteUnits"
                    );
                  });
                  break;
                case "units":
                  //console.log('conscripte.units' , conscripte.units);
                  conscripte.units.forEach(async (unit, i) => {
                    let unitObject = {};
                    unitObject.id = await this.getMyObjectValue(
                      {
                        displayedText: unit
                        //unitId: fixedConscripte.unitId
                      },
                      "webUnits"
                    );

                    // for the last unit
                    if (i == conscripte.units.length - 1) {
                      unitObject.webZoneId = fixedConscripte.webZoneId;
                      unitObject.leaderId = leaderId;
                      fixedConscripte.webUnitId = unitObject.id;
                      let allWebUnits = await this.api("global/get_all", {
                        table: "webUnits",
                        where: {
                          id: unitObject.id
                        },
                        include: [
                          {
                            model: "units",
                            required: true
                          }
                        ]
                      });
                      fixedConscripte.unitId =
                        allWebUnits.data && allWebUnits.data.length
                          ? allWebUnits.data[0].unitId
                          : fixedConscripte.unitId
                          ? fixedConscripte.unitId
                          : null;
                      //console.log("allWebUnits.data:",allWebUnits.data,unitObject.id);
                      // no relations between units and webunits
                      // although there's a unitId so relate between them.
                      if (!allWebUnits.data.length && fixedConscripte.unitId) {
                        unitObject.unitId = fixedConscripte.unitId;
                      }
                    }
                    let updateUnit = await this.api("global/update_one", {
                      table: "webUnits",
                      where: {
                        id: unitObject.id
                      },
                      update: unitObject
                    });
                    // console.log( 'u' , {              militaryId: conscripte.militaryId,
                    //     webUnitId: unitObject.id});
                    let conscripteUnitId = await this.getMyObjectValue(
                      {
                        militaryId: conscripte.militaryId,
                        webUnitId: unitObject.id
                      },
                      "webConscripteUnits"
                    );
                  });
                  break;
                case "webDemobilizationDate":
                  fixedConscripte.webDemobilizationDate = this.dateIfExists(
                    conscripte[key]
                  );
                  break;
                case "webServicePeriod":
                  fixedConscripte.webServicePeriod = conscripte[key];
                  break;
                case "webLostPeriod":
                  fixedConscripte.webLostPeriod = conscripte[key];
                  break;
                case "webClearServicePeriod":
                  fixedConscripte.webClearServicePeriod = conscripte[key];
                  break;
                case "webMoralsDegree":
                  fixedConscripte.webMoralsDegreeId = await this.getMyValue(
                    conscripte[key],
                    "webMoralsDegrees"
                  );
                  break;
                case "penalities":
                  await this.deleteMyValues("webPenalities", {
                    militaryId: conscripte.militaryId
                  });
                  await this.setValues(
                    "webPenalities",
                    conscripte[key],
                    [
                      {
                        key: "orderer",
                        dbKey: "ordererId",
                        table: "webPenalityOrderers"
                      },
                      {
                        key: "kind",
                        dbKey: "kindId",
                        table: "webPenalityKinds"
                      },
                      {
                        key: "type",
                        dbKey: "typeId",
                        table: "webPenalityTypes"
                      },
                      {
                        key: "courtPlace",
                        dbKey: "courtPlaceId",
                        table: "webCourtPlaces"
                      }
                    ],
                    [
                      "date",
                      "crimeFromDate",
                      "crimeToDate",
                      "orderDate",
                      "fromDate",
                      "toDate",
                      "courtDate"
                    ]
                  );
                  break;
                case "periodText":
                  let periodId = await this.api("global/get_one", {
                    table: "periods",
                    where: {
                      periodText: conscripte[key]
                    }
                  });
                  if (periodId && periodId.ok && periodId.data) {
                    fixedConscripte.periodId = periodId.data.id;
                  }
                  break;
                case "webNotes":
                  let notes = this.api("global/get_one", {
                    table: "conscriptes",
                    where: {
                      militaryId: conscripte.militaryId
                    },
                    attrs: ["notes"]
                  })
                    .then(x => {
                      fixedConscripte.notes =
                        x.data && x.data.notes ? x.data.notes : "";
                      conscripte[key].forEach(note => {
                        let hasWebNotes =
                          x.data && x.data.notes && x.data.notes.includes(note);
                        if (!hasWebNotes) {
                          fixedConscripte.notes += " - " + note;
                        }
                      });
                    })
                    .catch(err => {
                      fixedConscripte.notes = conscripte[key].join(" - ");
                      console.log("Error 2");
                      console.log(err);
                    });
                  break;
              }
          });
          let intVal = setInterval(async () => {
            fixedConscripte.isWeb = true;
            let conExists = await this.api("global/get_one", {
              table: "conscriptes",
              where: {
                militaryId: fixedConscripte.militaryId
              },
              attrs: ["militaryId"]
            });

            // for soldiers
            fixedConscripte.degreeId = conscripte.isSoldier ? 2 : null;

            // for Saff
            if (fixedConscripte.isHodod && conscripte.firstDegree) {
              let webDegree = await this.api("global/get_one", {
                  table: "webDegrees",
                  where: {
                    displayedText: conscripte.firstDegree
                  }
                }),
                webDegreeId = webDegree.data.id,
                degreeId = this.mapWebDegree()[webDegreeId];
              // console.log("milNo: ", fixedConscripte.militaryId);
              // console.log("firstDegree: ", conscripte.firstDegree);
              // console.log("webDegreeId: ", webDegreeId);
              // console.log("degreeId: ", degreeId);
              if (degreeId)
                fixedConscripte.degreeId = conscripte.isSoldier ? 2 : degreeId;
            } else {
              // console.log("milNo: ", fixedConscripte.militaryId);
              // console.log("firstDegree: ", conscripte.firstDegree);
              // console.log("conscripte", conscripte);
            }

            // add
            let webStateId, stateIdCurrent, stateId;
            if (fixedConscripte.isNew) {
              webStateId = fixedConscripte.webDutyStateId;
              stateIdCurrent =
                webStateId == 1
                  ? 1
                  : webStateId == 2
                  ? 4
                  : webStateId == 3
                  ? 3
                  : webStateId == 4
                  ? 2
                  : null;
              stateId = stateIdCurrent == 1 ? 101 : null;
              fixedConscripte.stateIdCurrent = stateIdCurrent;
              fixedConscripte.stateId = stateId;
            }
            console.log("fixedConscripte", fixedConscripte);
            if (conExists && conExists.data && conExists.data.militaryId) {
              // Exists - Just update it
              this.api("global/update_one", {
                table: "conscriptes",
                where: {
                  militaryId: fixedConscripte.militaryId
                },
                update: {
                  ...fixedConscripte,
                  typeId: conscripte.isSoldier ? 1 : 2
                }
              })
                .then(x => {
                  this.$emit("removeError", {
                    id: fixedConscripte.militaryId,
                    type: "فرد",
                    errors: ["لم يتم تحديثه بقاعدة البيانات"],
                    segelatWeb: this.segelatWeb
                  });
                  // Ok
                })
                .catch(err => {
                  this.$emit("pushError", {
                    id: fixedConscripte.militaryId,
                    type: "فرد",
                    errors: ["لم يتم تحديثه بقاعدة البيانات", err.data],
                    segelatWeb: this.segelatWeb
                  });
                });
            } else {
              // Create it
              this.api("global/create_one", {
                table: "conscriptes",
                where: {
                  ...fixedConscripte,
                  typeId: conscripte.isSoldier ? 1 : 2,
                  stateId: stateId,
                  stateIdCurrent: stateIdCurrent
                }
              })
                .then(x => {
                  // Ok
                  this.$emit("removeError", {
                    id: fixedConscripte.militaryId,
                    type: "فرد",
                    errors: ["لم تتم إضافته بقاعدة البيانات"],
                    segelatWeb: this.segelatWeb
                  });
                })
                .catch(err => {
                  this.$emit("pushError", {
                    id: fixedConscripte.militaryId,
                    type: "فرد",
                    errors: ["لم تتم إضافته بقاعدة البيانات", err.data],
                    segelatWeb: this.segelatWeb
                  });
                });
              // console.log(create);
            }
            clearInterval(intVal);
          }, 2000);
        })
        .catch(err => {
          this.$emit("pushError", {
            id: fixedConscripte.militaryId,
            type: "فرد",
            errors: ["لم تتم إضافته بقاعدة البيانات", err.data],
            segelatWeb: this.segelatWeb
          });
        });
    },
    async addPrimaryData(militaryId) {
      let conscripte = this.currentCons.find(
        con => con.militaryId == militaryId
      );
      if (!conscripte) {
        return;
      }

      conscripte.unitId = this.currentUnitId;

      let isConExists = await this.api("global/get_one", {
        table: "conscriptes",
        where: {
          militaryId
        }
      });

      if (isConExists && isConExists.data && isConExists.data.militaryId) {
        this.api("global/update_one", {
          table: "conscriptes",
          where: {
            militaryId
          },
          update: conscripte
        });
      } else {
        this.api("global/create_one", {
          table: "conscriptes",
          where: conscripte
        });
      }
    },
    mapWebDegree() {
      return {
        1: 25, // مقدم
        2: 2, // جندي
        3: 3, //عريف
        4: 30, // لواء أح
        5: 24, // رائد
        6: 23, // نقيب
        7: 26, //عقيد
        8: 5, // رقيب
        9: 27, // عميد
        10: 28, // عميد أح
        11: 13, // ملازم
        12: 22, // ملازم أول
        13: 14, // طالب
        16: 17, // رقيب أول
        17: 17, // رقيب أول
        21: 18, // مساعد
        23: 19 // مساعد أول
      };
    },
    setNewForceList(list = [], segelatWeb = false) {
      this.$set(this, "segelatWeb", segelatWeb);
      if (list.length == 0) {
        console.log("New list is empty");
        this.$emit("newListIsEmpty");
      } else {
        console.log("list: ");
        console.log(list);
        this.$set(this, "stopOperationOk", false);
        this.$set(this, "numbers_passed_conscriptes", 0);
        this.$set(this, "forceList", list);
        let intVal = setInterval(() => {
          this.beginTransaction();
          clearInterval(intVal);
        }, 1000);
      }
    },
    beginTransaction() {
      this.loadDoc(0);
    },
    passConscripte() {
      this.$set(
        this,
        "numbers_passed_conscriptes",
        this.numbers_passed_conscriptes + 1
      );
    },
    loadDoc(index) {
      this.controlOp.functions.setCurrentOp(
        `تحميل الملف الخاص بالفرد رقم: ${index}. 
        ورقم عسكري : ${this.forceList[index]} `,
        this.loadDoc,
        arguments
      );
      if (this.controlOp.functions.isStopped()) {
        this.xhttp = null;
        return;
      }

      this.xhttp = new XMLHttpRequest();
      let that = this,
        length = this.forceList.length,
        id = this.forceList[index];
      if (index == length) {
        // Done with this unit
        this.$set(this, "numbers_passed_conscriptes", 0);
        this.$set(this, "forceList", []);
      } else {
        this.xhttp.responseType = "blob";
        this.xhttp.onreadystatechange = async function() {
          if (this.readyState == 4 && this.status == 200) {
            // console.log("ID: " + id);
            // console.log(this.response);
            // if (id == "2020101201694") {
            //   console.log(this.response);
            // }
            that.$emit("removeError", {
              id,
              type: "",
              errors: [
                "الشبكة العسكرية هنجت هنا",
                "غالباً الشبكة العسكرية فصلت"
              ],
              segelatWeb: that.segelatWeb
            });
            let responseType = this.response.type,
              responseText = responseType.includes("html")
                ? await this.response.text()
                : "";
            if (responseText.includes("سلاح تسريحه ليس سلاحك")) {
              that.$emit("pushError", {
                id,
                type: "فرد",
                errors: ["سلاح تسريحه ليس حدود"],
                segelatWeb: that.segelatWeb
              });
              that.$set(
                that,
                "numbers_passed_conscriptes",
                that.numbers_passed_conscriptes + 1
              );
            } else {
              that.getMyIdData(this.response, id);
            }
            that.$nextTick(() => {
              let intVal = setInterval(() => {
                that.$nextTick(() => {
                  this.xhttp = null;
                });
                clearInterval(intVal);
              }, 2000);
            });
          }
        };
        this.xhttp.onerror = function(error) {
          console.log("Error");
          console.log(error);
          //that.showError("تعذر الإتصال بالشبكة العسكرية");

          // Don't pass the conscripte
          // that.passConscripte();

          // repeate the same process after 5000 sec
          that.controlOp.functions.repeatCurrentOpAfter(5000);

          that.$emit("pushError", {
            id,
            type: "",
            errors: ["الشبكة العسكرية هنجت هنا", error],
            segelatWeb: that.segelatWeb
          });
        };
        this.xhttp.timeout = 50000;
        this.xhttp.ontimeout = function(error) {
          console.log("Timeout");
          console.log(error);

          // Don't pass the conscripte
          // that.passConscripte();

          // repeate the same process after 5000 sec
          that.controlOp.functions.repeatCurrentOpAfter(2000);

          that.$emit("pushError", {
            id,
            type: "",
            errors: ["غالباً الشبكة العسكرية فصلت", error],
            segelatWeb: that.segelatWeb
          });
        };
        this.xhttp.open(
          "post",
          "http://1.33.1.150/segelat/OneSeenDocument/OneSeenData",
          true
        );
        this.xhttp.setRequestHeader(
          "Content-type",
          "application/x-www-form-urlencoded"
        );
        this.xhttp.send("milNo=" + id);
      }
    },
    async getMyIdData(blob, id) {
      // console.log(blob);
      blob
        .arrayBuffer()
        .then(buffer => {
          this.$socket.client.emit("getMyIdData", {
            buffer,
            id,
            child: "1"
          });
          this.$nextTick(() => {
            let intVal = setInterval(() => {
              this.$nextTick(() => {
                buffer = null;
                blob = null;
              });
              clearInterval(intVal);
            }, 2000);
          });
        })
        .catch(err => {
          console.log(err);
          this.$emit("pushError", {
            id,
            type: "",
            errors: ["تعذر تحليل ملفه من الفيو", err],
            segelatWeb: this.segelatWeb
          });
        });
    }
  }
};

`
1. run stater function
2. getToken(0)          -- can passUnit()
3. login(0)             -- can passUnit()
4. loadUnit(0)          -- can passUnit()
5. getUnitsForceList()
    - Analyzing unit force list in node.js
    - returned by socket gotUnitsForceList()

-- Start Playing with Nodes --

$node.setNewForceList()

`;
</script>
