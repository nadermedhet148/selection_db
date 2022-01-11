<template>
  <div>
    <v-card>
      <v-card-title>
        نقل البيانات من قاعدة بيانات البطاقات العلاجية الى الجنود
      </v-card-title>
      <v-card-text>
        <v-progress-linear
          height="10"
          :value="progress.perc"
        ></v-progress-linear>
        <v-card-actions>
          {{ progress.done }}
          /
          {{ progress.all }}
        </v-card-actions>
      </v-card-text>
      <v-card-text>
        <template v-for="(method, i) in methods">
          <v-btn
            :key="i"
            @click="runFun(`${method}`)"
            color="primary"
            large
            :disabled="progress.start && !progress.finish"
            outlined
            class="px-6 ma-1 text-none"
          >
            {{ method }}
          </v-btn>
        </template>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "TransferCardsDatabase",
  mounted() {
    this.$store.commit(
      "setTcUploadPath",
      "\\\\192.9.201.222\\manzoma\\treatmentCards"
    );
  },
  data: () => ({
    progress: {
      start: false,
      finish: false,
      perc: 0,
      done: 0,
      all: 0
    },
    methods: [
      "certification",
      "conscriptes",
      "conscriptesEndTrmenations",
      "treatmentCardEndTrmnationRegDiv",
      "treatmentCardRegistrationDivision",
      "treatmentRenewalTrackingRegDiv",
      "treatmentRenewalTrackingEndTermRegDiv",
      "treatmentExtraFamilyMembers",
      "treatmentExtraFamilyMembersEndTerm",
      "treatmentEducationEnd",
      "treatmentEducation",
      "treatmentKomsoin",
      "treatmentKomsoinEndTerm"
    ]
  }),
  watch: {
    "progress.done"(v) {
      let perc =
        this.progress.all == 0 ? 0 : Math.floor((v / this.progress.all) * 100);
      this.$set(this.progress, "perc", perc);
    }
  },
  methods: {
    runFun(method) {
      this.resetProgress();
      setTimeout(() => {
        let r = require(`@/components/sections/nozom/operations/TransferCardsDatabase/methods/${method}.js`)(
          this
        );
        console.log(r);
        return "ok";
      }, 200);
    },
    /**
     * mapping oldObj to the newObj according to the dataMap
     * @param dataMap Every key in this object will refer to the same key in the other database
     *    This object contains straight fields
     *    It doesn't include militaryId because we use it as a comparing key
     *    It can be string:string or string:object
     *    case string:string => assumes type as string, integer or boolean
     *    case string:object => can have a custom type
     *    oldDB => newDB
     * @param oldObj
     * @param idMap
     */
    async dataMapping(dataMap, oldObjs, idMap = {}) {
      let newObjs = [];

      for (let i = 0; i < oldObjs.length; i++) {
        let oldObj = oldObjs[i];
        let newObj = {};

        // For Mapping Ids
        Object.keys(idMap).forEach(key => {
          newObj[idMap[key].key] =
            key == null ? null : idMap[key].map[oldObj[key]];
        });

        // For DataMap
        let dataMapKeys = Object.keys(dataMap);
        for (let j = 0; j < dataMapKeys.length; j++) {
          let key = dataMapKeys[j],
            basePath;
          if (typeof dataMap[key] == "object") {
            switch (true) {
              case "value" in dataMap[key]:
                if (key != "isEndTerm") {
                  newObj[dataMap[key].key] = dataMap[key].value.trim();
                }
                break;
              case dataMap[key].type == "number":
                // it's national Id And I wanted to connect to the militaryId
                if (dataMap[key].to == "militaryId") {
                  await this.api(
                    "global/get_one",
                    {
                      table: "conscriptes",
                      where: {
                        nationalId: oldObj[key]
                      }
                    },
                    "tc"
                  ).then(x => {
                    oldObj[key] = x.data.militaryId;
                    newObj[dataMap[key].key] = oldObj[key];
                  });
                } else if (dataMap[key].to == "memberId") {
                  await this.api("global/get_one", {
                    table: "cardsFamilyMembers",
                    where: {
                      nationalId: oldObj[key]
                    }
                  }).then(x => {
                    oldObj["newId"] = x.data != null ? x.data.id : null;
                  });
                  newObj[dataMap[key].key] = ["string", "number"].includes(
                    typeof oldObj["newId"]
                  )
                    ? oldObj["newId"] /*.replace(/\D+/g, "").trim()*/
                    : null;
                } else if (dataMap[key].to == "cardId") {
                  await this.toCardId(dataMap, newObj, oldObj);
                } else {
                  newObj[dataMap[key].key] = oldObj[key];
                }
                break;
              case dataMap[key].type == "date":
                newObj[dataMap[key].key] =
                  oldObj[key] == null
                    ? null
                    : new Date(
                        typeof oldObj[key] == "string"
                          ? oldObj[key].trim()
                          : oldObj[key]
                      )
                        .toISOString()
                        .substr(0, 10);
                break;
              case dataMap[key].type == "base64":
                //basePath = dataMap[key].basePath;
                // It's diagnoses
                if ("lagnaId" in oldObj) {
                  // getting militaryId

                  await this.api("global/get_one", {
                    table: "cardsFamilyMembers",
                    where: {
                      nationalId: oldObj["nationalIdExtraMember"]
                    }
                  })
                    .then(x => {
                      oldObj["militaryId"] =
                        x.data != null && x.data.consMilitaryId
                          ? x.data.consMilitaryId
                          : null;
                    })
                    .catch(err => {
                      console.log(oldObj);
                      console.log(oldObj["nationalIdExtraMember"]);
                      console.log(err);
                    });
                  // nationalId
                  oldObj["nationalId"] = oldObj["nationalIdExtraMember"];
                } else if ("consMilitaryId" in oldObj) {
                  oldObj["militaryId"] = oldObj["consMilitaryId"];
                } else if ("renewalTrackingId" in oldObj) {
                  await this.api("global/get_one", {
                    table: "cards",
                    where: {
                      id: newObj["cardId"]
                    },
                    attrs: ["consMilitaryId"]
                  }).then(x => {
                    oldObj["militaryId"] =
                      x.data && x.data != null ? x.data.consMilitaryId : null;
                  });
                } else if ("consMilitaryId" in newObj) {
                  oldObj["militaryId"] = newObj["consMilitaryId"];
                }

                /**
                 * National not exists for sudanese
                 */
                let nationalId = oldObj["nationalId"]
                  ?.replace(/\D+/g, "")
                  .trim()
                  ? oldObj["nationalId"]?.replace(/\D+/g, "").trim()
                  : "notExist";

                basePath = dataMap[key].basePath
                  .replace(
                    "${militaryId}",
                    oldObj["militaryId"]?.replace(/\D+/g, "").trim()
                  )
                  .replace(
                    "${name}",
                    oldObj["name"]?.replace(/\D+/g, "").trim()
                  )
                  .replace(
                    "${cardNumber}",
                    oldObj["cardNumber"]?.replace(/\D+/g, "").trim()
                  )
                  .replace("${nationalId}", nationalId);

                // if Path has \\ that means there's a variable replaced with nothing
                if (
                  basePath
                    .replace(this.$store.getters.getTcUploadPath, "")
                    .includes("\\\\")
                ) {
                  newObj[dataMap[key].key] = false;
                } else {
                  newObj[dataMap[key].key] =
                    basePath + this.getRandom() + ".jpg";
                }

                break;
            }
          } else {
            newObj[dataMap[key]] =
              typeof oldObj[key] == "string" ? oldObj[key].trim() : oldObj[key];
          }
        }

        newObjs.push(newObj);
      }
      return newObjs;
    },

    async toCardId(dataMap, newObj, oldObj) {
      // get the key and value to get conscripte from new database
      let conscripteKey =
          // in extrafamilyMembers table
          "nationalIdConscripte" in oldObj
            ? "nationalIdConscripte"
            : // in treatmentRenewalTrackingRegDiv table || treatmentRenewalTrackingEndTermRegDiv
            "nationalId" in oldObj
            ? "nationalId"
            : //  in exrafamilyMembersEndTerm table
            "militaryIdConscript" in oldObj
            ? "militaryIdConscript"
            : false,
        isEndTerm = "isEndTerm" in dataMap ? dataMap["isEndTerm"].value : false,
        value = conscripteKey ? oldObj[conscripteKey] : null,
        conscripte = {},
        cardNumber = oldObj["cardNumber"];

      // get the conscripte and his cards

      if (conscripteKey == "nationalId" && isEndTerm) {
        // for treatmentRenewalTrackingEndTermRegDiv
        // the nationalId here is for one of the member
        await this.getConscripteByMember(value).then(x => {
          conscripte = x;
        });

        console.log(conscripte);
      } else if (
        ["nationalId", "nationalIdConscripte"].includes(conscripteKey)
      ) {
        await this.getConscripteByNationalId(value).then(x => {
          conscripte = x;
        });
      } else {
        await this.getConscripteByMilitaryId(value).then(x => {
          conscripte = x;
        });
      }

      let cardId;
      conscripte == null
        ? await this.findCardId(
            {
              cardNumber,
              oldTypeId: oldObj["cardTypeId"],
              isEndTerm
            },
            oldObj
          ).then(x => {
            cardId = x;
          })
        : await this.findCardId(
            {
              cardNumber,
              oldTypeId: oldObj["cardTypeId"],
              isEndTerm,
              cards: conscripte.cards
            },
            oldObj
          ).then(x => {
            cardId = x;
          });
      newObj["cardId"] = cardId;
    },

    /**
     * this function is used only for treatmentRenewalTrackingEndTermRegDiv
     * the nationalId here is for the member
     */
    async getConscripteByMember(nationalId) {
      let militaryId;
      console.log(nationalId);
      await this.api(
        "global/get_one",
        {
          table: "treatmentExtraFamilyMembersEndTerm",
          where: {
            nationalId: nationalId
          },
          attrs: ["militaryIdConscript"]
        },
        "tc"
      )
        .then(x => {
          militaryId =
            x.data && x.data != null ? x.data.militaryIdConscript : null;
        })
        .catch(err => {
          console.log("nationalId :", nationalId);
          console.log(err);
        });

      // maybe it's nationalId (for personal cards)
      militaryId = militaryId == null ? nationalId : militaryId;

      let conscripte;
      await this.api("global/get_one", {
        table: "conscriptes",
        where: {
          militaryId
        }
      })
        .then(x => {
          conscripte = x.data;
        })
        .catch(err => {
          console.log("conscripte with MilitaryID: ", militaryId);
          console.log(err);
        });

      return conscripte;
    },

    /**
     * getting Conscripte from the new DB
     * by the nationalId from the old DB
     * by getting the militaryId from old DB
     * and then get the conscripte by militaryId
     */
    async getConscripteByNationalId(nationalId) {
      let militaryId;
      await this.api(
        "global/get_one",
        {
          table: "conscriptes",
          where: {
            nationalId: nationalId
          }
        },
        "tc"
      ).then(x => {
        militaryId = x.data != null ? x.data.militaryId : null;
      });

      let conscripte;
      await this.getConscripteByMilitaryId(militaryId).then(x => {
        conscripte = x;
      });

      return conscripte;
    },

    /**
     * get conscripte by militaryId from MR
     */
    async getConscripteByMilitaryId(militaryId) {
      if (militaryId == null) {
        return null;
      }
      let conscripte;
      await this.api("global/get_one", {
        table: "conscriptes",
        where: {
          militaryId
        },
        include: [
          {
            model: "cards"
          }
        ]
      }).then(x => {
        conscripte = x.data;
      });
      return conscripte;
    },
    /**
     * finding the cardId
     * there are four tables call this function for
     * 1 - cardTrackingReg
     * 2 - cardTrackingEndTerm
     * 3 - FamilyMembersReg
     * 4 - familyMembersEndTerm
     * @var cardNumber,
     * @var
     */
    async findCardId(
      params = {
        cardNumber: null,
        cards: false,
        oldTypeId: false,
        isEndTerm: false
      },
      oldObj
    ) {
      let cardTypeId;
      if (params.oldTypeId || params.oldTypeId === 0) {
        let types = params.isEndTerm
          ? {
              "0": 1,
              "1": 2, // عائلية معاش
              "2": 4 //والدين
            }
          : {
              "0": 1, // المفروض مش موجودة
              "1": 3,
              "2": 4
            };

        cardTypeId = types[params.oldTypeId];
      } else {
        // this will happen in exrafamilyTables
        // and the cardTypeId will depend on the type of FamilyMember
        cardTypeId = params.isEndTerm
          ? // for endTerm iF family else parent
            [2, 3, 4].includes(oldObj["typeId"])
            ? 2
            : 4
          : // for inDuty
          [2, 3, 4].includes(oldObj["typeId"])
          ? 3
          : 4;
      }
      let card;
      // meaning couldn't find the conscripte to get it's cards
      if (!params.cards) {
        // so get the first card with the card number
        await this.api("global/get_one", {
          table: "cards",
          where: {
            cardNumber: params.cardNumber,
            typeId: cardTypeId
          }
        })
          .then(x => {
            card = x.data;
          })
          .catch(err => {
            console.log("error with cardNumber:", params.cardNumber);
            console.log(err);
          });
      } else {
        card = params.cards.find(card => {
          return (
            card.cardNumber == params.cardNumber && card.typeId == cardTypeId
          );
        });
      }
      let cardId = card && card != null ? card.id : null;
      return cardId;
    },
    loadIdMap(file) {
      return require(`@/components/sections/nozom/operations/TransferCardsDatabase/idMap/${file}.js`)
        .default;
    },
    connectDefaultDevice() {
      this.connectDevice(
        this.$store.getters.getTcUploadPath,
        "manzoma",
        "P@$$w0rd"
      ).catch(err => {
        console.log(err);
      });
    },
    disconnectDefaultDevice() {
      this.disconnectDevice(this.$store.getters.getTcUploadPath).catch(err => {
        console.log(err);
      });
    },
    resetProgress() {
      this.$set(this.progress, "done", 0);
      this.$set(this.progress, "all", 0);
    }
  }
};
</script>
