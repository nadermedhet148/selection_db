<template>
  <div></div>
</template>

<script>
export default {
  name: "web-child-4",
  data: () => ({
    numbers_passed_conscriptes: 0,
    forceList: []
  }),
  watch: {
    numbers_passed_conscriptes(v) {
      if (v) {
        this.$emit("numbers_passed_conscriptes");
        this.loadDoc(v);
      }
    }
  },
  sockets: {
    gotMyIdData4(x) {
      let { data, id, error } = x;
      if (error) {
        console.log("There was error parsing id: " + id);
        console.log(error);
        this.$emit("pushError", {
          id,
          type: "فرد",
          errors: ["تعذر تحليل ملفه من النود", error]
        });
      } else {
        data.militaryId = id;
        this.fixAndAddConscripte(data);
        console.log("Conscripte: " + id);
      }
      this.$set(
        this,
        "numbers_passed_conscriptes",
        this.numbers_passed_conscriptes + 1
      );
    }
  },
  methods: {
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
        return new Date(str);
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
      let fixedConscripte = {};
      this.checkOrAddConscripte(conscripte.militaryId)
        .then(x => {
          fixedConscripte.isNew = x.created;
          Object.keys(conscripte).forEach(async key => {
            if (
              conscripte[key] &&
              (((typeof conscripte[key] == "string" ||
                Array.isArray(conscripte[key])) &&
                conscripte[key].length > 0) ||
                typeof conscripte[key] == "object")
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
                  break;
                case "zone":
                  fixedConscripte.webZoneId = await this.getMyValue(
                    conscripte[key],
                    "webZones"
                  );
                  break;
                case "dutyState":
                  fixedConscripte.webDutyStateId = await this.getMyValue(
                    conscripte[key],
                    "webDutyStates"
                  );
                  break;
                case "fullName":
                  fixedConscripte.fullName = conscripte[key];
                  break;
                case "qualification":
                  fixedConscripte.webQualificationId = await this.getMyValue(
                    conscripte[key],
                    "webQualifications"
                  );
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
                  break;
                case "webConscriptionDate":
                  fixedConscripte.webConscriptionDate = this.dateIfExists(
                    conscripte[key]
                  );
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
                  break;
                case "bloodType":
                  fixedConscripte.webBloodTypeId = await this.getMyValue(
                    conscripte[key],
                    "webBloodTypes"
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
                  conscripte.units.forEach(async (unit, i) => {
                    let unitObject = {};
                    unitObject.id = await this.getMyObjectValue(
                      {
                        displayedText: unit,
                        ta3Be2A: 0
                      },
                      "webUnits"
                    );
                    if (i == conscripte.units.length - 1) {
                      unitObject.webZoneId = fixedConscripte.webZoneId;
                      unitObject.leaderId = leaderId;
                      fixedConscripte.webUnitId = unitObject.id;
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
            if (conExists && conExists.data && conExists.data.militaryId) {
              // Exists - Just update it
              this.api("global/update_one", {
                table: "conscriptes",
                where: {
                  militaryId: fixedConscripte.militaryId
                },
                update: fixedConscripte
              })
                .then(x => {
                  // Ok
                })
                .catch(err => {
                  this.$emit("pushError", {
                    id: fixedConscripte.militaryId,
                    type: "فرد " + conscripte.isSoldier ? "جندي" : "ضابط صف",
                    errors: ["لم يتم تحديثه بقاعدة البيانات", err.data]
                  });
                });
            } else {
              // Create it
              this.api("global/create_one", {
                table: "conscriptes",
                where: fixedConscripte
              })
                .then(x => {
                  // Ok
                })
                .catch(err => {
                  this.$emit("pushError", {
                    id: fixedConscripte.militaryId,
                    type: "فرد " + conscripte.isSoldier ? "جندي" : "ضابط صف",
                    errors: ["لم تتم إضافته بقاعدة البيانات", err.data]
                  });
                });
              // console.log(create);
            }
            clearInterval(intVal);
          }, 2000);
        })
        .catch(error => {
          this.$emit("pushError", {
            id: fixedConscripte.militaryId,
            type: "فرد " + conscripte.isSoldier ? "جندي" : "ضابط صف",
            errors: ["لم تتم إضافته بقاعدة البيانات", err.data]
          });
        });
    },
    setNewForceList(list = []) {
      if (list.length == 0) {
        this.$emit("newListIsEmpty");
      } else {
        this.$set(this, "numbers_passed_conscriptes", 0);
        this.$set(this, "forceList", list);
        this.beginTransaction();
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
      let xhttp = new XMLHttpRequest(),
        that = this,
        length = this.forceList.length,
        id = this.forceList[index];
      if (index == length) {
        // Done with this unit
      } else {
        xhttp.responseType = "blob";
        xhttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
            console.log("ID: " + id);
            console.log(this.response);
            that.getMyIdData(this.response, id);
            that.$nextTick(() => {
              let intVal = setInterval(() => {
                that.$nextTick(() => {
                  xhttp = null;
                });
                clearInterval(intVal);
              }, 2000);
            });
          }
        };
        xhttp.onerror = function(error) {
          console.log("Error");
          console.log(error);
          that.showError("تعذر الإتصال بالشبكة العسكرية");
          that.passConscripte();
          that.$emit("pushError", {
            id,
            type: "",
            errors: ["الشبكة العسكرية هنجت هنا", error]
          });
        };
        xhttp.ontimeout = function(error) {
          console.log("Timeout");
          console.log(error);
          that.passConscripte();
          that.$emit("pushError", {
            id,
            type: "",
            errors: ["غالباً الشبكة العسكرية فصلت", error]
          });
        };
        xhttp.open(
          "post",
          "http://1.33.1.150/segelat/OneSeenDocument/OneSeenData",
          true
        );
        xhttp.setRequestHeader(
          "Content-type",
          "application/x-www-form-urlencoded"
        );
        xhttp.send("milNo=" + id);
      }
    },
    async getMyIdData(blob, id) {
      blob
        .arrayBuffer()
        .then(buffer => {
          this.$socket.client.emit("getMyIdData", {
            buffer,
            id,
            child: "4"
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
            errors: ["تعذر تحليل ملفه من الفيو", err]
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
