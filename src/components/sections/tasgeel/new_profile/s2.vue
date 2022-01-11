<template>
  <div>
    <v-card class="mb-6" tile flat>
      <v-card-text>
        <v-row>
          <v-col>
            <v-card
              :disabled="!c.image"
              @click="c.image ? lightbox([base64ToImg(c.image)]) : () => {}"
              width="125"
              height="125"
              color="white"
              elevation="4"
            >
              <v-layout
                fill-height
                align-center
                align-content-center
                justify-center
              >
                <v-avatar size="120" rounded color="secondary">
                  <v-img
                    :src="
                      c.image
                        ? base64ToImg(c.image)
                        : require('@/assets/inapp/user-placeholder.jpg')
                    "
                  >
                    <template v-slot:placeholder>
                      <v-layout
                        align-center
                        align-content-center
                        justify-center
                        fill-height
                        style="background-color: rgba(0,0,0,.5)"
                      >
                        <v-progress-circular
                          color="white"
                          size="30"
                          indeterminate
                        ></v-progress-circular>
                      </v-layout>
                    </template>
                  </v-img>
                </v-avatar>
              </v-layout>
            </v-card>
          </v-col>
          <!-- <v-col class="text-center align-self-end">
            <v-menu transition="slide-y-transition">
              <template v-slot:activator="{ on }">
                <v-btn v-on="on">
                  عرض التعديلات
                  {{ c.isWeb ? "الآلية" : "اليدوية" }}
                  <v-icon class="ms-2">mdi-chevron-down</v-icon>
                </v-btn>
              </template>
              <v-list min-width="200">
                <v-list-item-group mandatory v-model="c.isWeb">
                  <template v-for="(t, i) in isWebTypes">
                    <v-list-item :key="i" :value="t.value">
                      <v-list-item-content>
                        <v-list-item-title v-text="t.title"></v-list-item-title>
                        <v-list-item-subtitle
                          v-text="t.desc"
                        ></v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                  </template>
                </v-list-item-group>
              </v-list>
            </v-menu>
          </v-col> -->
          <!-- <v-col class="text-center align-self-end">
            <span>
              آخر تعديل آلي:
              <span v-if="c.webAt">
                {{ new Date(c.webAt) | moment("from", "now") }}
              </span>
              <span v-else>
                لا يوجد
              </span>
            </span>
          </v-col> -->
          <v-col class="text-center align-self-end">
            <span>
              آخر تعديل:
              <span v-if="c.localAt">
                {{ new Date(c.localAt) | moment("from", "now") }}
              </span>
              <span v-else>
                لا يوجد
              </span>
            </span>
          </v-col>
          <v-col
            class="text-center align-self-end"
            v-if="$store.state.allowConscripteEdit"
          >
            <v-btn class="px-6" color="primary" @click="saveEverything()">
              حفظ التعديلات
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <template v-for="(card, ci) in ccards">
      <v-card class="mb-6" :key="ci">
        <v-card-title class="color_moqadem white--text">
          <!-- style="background-color: rgb(116, 9, 183) !important" -->
          {{ card.title }}
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text
          :class="`borders py-1 card-${$vuetify.theme.dark ? 'dark' : 'light'}`"
        >
          <template v-for="(row, i) in card.rows">
            <v-row :key="i">
              <template v-for="(f, ii) in row">
                <v-col
                  v-if="f.hasOwnProperty('key')"
                  :key="'k_' + ii"
                  class="key font-weight-bold sidenav pa-0"
                  :cols="f.colsObj && f.colsObj.key ? f.colsObj.key : f.cols"
                >
                  <v-hover>
                    <template v-slot:default="{ hover }">
                      <v-layout
                        :class="`py-2 ${hover}`"
                        align-center
                        align-content-center
                        justify-center
                        fill-height
                        style="color: inherit !important"
                      >
                        {{ f.key }}
                        <!-- <v-btn
                          v-if="
                            !c.isWeb &&
                              Object.keys(f).includes('localVal') &&
                              f.lvkey !== 'militaryId'
                          "
                          icon
                          dark
                          :style="`opacity: ${hover ? '1' : '0'}`"
                          @click="
                            editMe(
                              f.key,
                              c.isWeb ? f.vkey : f.lvkey,
                              c.isWeb ? f.val : f.localVal
                            )
                          "
                        >
                          <v-icon color="white">mdi-pencil</v-icon>
                        </v-btn> -->
                      </v-layout>
                    </template>
                  </v-hover>
                </v-col>
                <v-col
                  :class="$store.state.allowConscripteEdit ? 'pa-0' : ''"
                  v-if="f.hasOwnProperty('val') || f.hasOwnProperty('localVal')"
                  :key="'v_' + ii"
                  :cols="f.colsObj && f.colsObj.val ? f.colsObj.val : f.cols"
                >
                  <v-layout
                    align-center
                    align-content-center
                    justify-center
                    fill-height
                    style="color: inherit !important"
                    :class="$store.state.allowConscripteEdit ? 'pa-0' : ''"
                  >
                    <template
                      v-if="
                        $store.state.allowConscripteEdit &&
                          Object.keys(cc_types).includes(f.lvkey)
                      "
                    >
                      <div style="width: 100%">
                        <v-text-field
                          v-if="['text', 'date'].includes(cc_types[f.lvkey])"
                          full-width
                          v-model="cc[f.lvkey]"
                          filled
                          :type="cc_types[f.lvkey]"
                          hide-details
                          dense
                        ></v-text-field>
                        <v-textarea
                          v-else-if="cc_types[f.lvkey] == 'textarea'"
                          full-width
                          v-model="cc[f.lvkey]"
                          filled
                          :type="cc_types[f.lvkey]"
                          hide-details
                          dense
                        ></v-textarea>
                        <v-autocomplete
                          v-else-if="cc_types[f.lvkey] == 'select'"
                          full-width
                          v-model="cc[f.lvkey]"
                          filled
                          :items="
                            selects && selects[f.lvkey]
                              ? selects[f.lvkey].data
                              : []
                          "
                          :item-text="
                            selects && selects[f.lvkey]
                              ? selects[f.lvkey].text
                              : 'text'
                          "
                          :item-value="
                            selects && selects[f.lvkey]
                              ? selects[f.lvkey].value
                              : 'value'
                          "
                          hide-details
                          dense
                        ></v-autocomplete>
                      </div>
                    </template>
                    <template v-else>
                      <div v-if="!f.type || f.type == 'text'">
                        <span v-text="c.isWeb ? f.val : f.localVal"></span>
                      </div>
                      <v-row v-if="c.isWeb && f.val && f.type == 'split'">
                        <template
                          v-for="(n, iii) in f.val
                            .split(f.splitWithUse)
                            .reverse()"
                        >
                          <v-col class="my-0 py-0" :key="iii">
                            {{ n }}
                          </v-col>
                        </template>
                      </v-row>
                      <v-row v-if="!c.isWeb && f.localVal && f.type == 'split'">
                        <template
                          v-for="(n, iii) in f.localVal
                            .split(f.splitWithUse)
                            .reverse()"
                        >
                          <v-col class="my-0 py-0" :key="iii">
                            {{ n }}
                          </v-col>
                        </template>
                      </v-row>
                    </template>
                  </v-layout>
                </v-col>
              </template>
            </v-row>
          </template>
        </v-card-text>
      </v-card>
    </template>
  </div>
</template>

<style lang="scss" scoped>
$border-color: lighten(grey, 30%) !important;
$border-width: 2px;
.borders {
  &.card-light {
    * {
      color: darken(grey, 30%);
    }
  }
  & > .row {
    &:not(:first-of-type) {
      & > .col {
        border-top: $border-width solid $border-color;
      }
    }
    &:not(:last-of-type) {
      & > .col {
        &:odd {
          border-bottom: $border-width solid $border-color;
        }
      }
    }
    & > .col {
      &.key {
        // font-weight: 600;
        // background-color: rgba(darken(blue, 40%), 0.6);
        // background-color: rgba(0, 176, 240);
        color: white;
      }
      text-align: center;
      &:not(:last-of-type) {
        border-left: $border-width solid $border-color;
      }
    }
  }
}
</style>

<script>
export default {
  name: "s2",
  props: {
    c: {
      type: Object,
      default: () => {}
    }
  },
  mounted() {
    this.init();
    // this.getConscripteImage();
    // console.log(this.c);
    this.$set(this.c, "isWeb", false);
    this.$set(this, "cc", { ...this.c });
    this.$set(this.$store.state, "allowConscripteEdit", false);
  },
  methods: {
    // async getConscripteImage() {
    //   let id = this.c.militaryId,
    //     conscriptes_afrad = await this.afraadConscripte({
    //       where: { id },
    //       attrs: ["image", "relevantTele"]
    //     });
    //   if (conscriptes_afrad && conscriptes_afrad.length > 0) {
    //     let c_afrad = conscriptes_afrad[0];
    //     // c_afrad.image = this.base64ToImg(c_afrad.image);
    //     // c_afrad.phoneNumber = c_afrad.relevantTele
    //     //   ? c_afrad.relevantTele
    //     //       .split("")
    //     //       .filter(r => Number(r) == r)
    //     //       .join("")
    //     //   : "";
    //     // this.$set(this, "c_afrad", c_afrad);
    //     this.$set(this, "imageLoading", false);
    //     if (c_afrad.image) {
    //       this.$set(this.c, "image", this.base64ToImg(c_afrad.image));
    //     }
    //   }
    // },
    async saveEverything() {
      let data = this.cc,
        militaryId = data.militaryId;
      delete data.image;
      delete data.militaryId;
      Object.keys(data).forEach(key => {
        if (
          key[0] === key[0].toUpperCase() ||
          [
            "webServicePeriod",
            "webLostPeriod",
            "webClearServicePeriod",
            "servicePeriod",
            "lostPeriod",
            "clearServicePeriod"
          ].includes(key)
        ) {
          delete data[key];
        } else {
          if (key.includes("date") || key.includes("Date")) {
            data[key] == new Date(data[key]);
          }
        }
      });
      let updateCon = await this.api("global/update_one", {
        table: "conscriptes",
        where: {
          militaryId
        },
        update: data
      });
      this.goThere("/soldiers_plus");
      let intVal = setInterval(() => {
        this.goThere(`/soldiers_plus/${militaryId}`);
        clearInterval(intVal);
      }, 500);
      this.$set(this.$store.state, "allowConscripteEdit", false);
    },
    init() {
      // Get selects
      Object.keys(this.selects).forEach(key => {
        let { table, text, value } = this.selects[key];
        if (table) {
          this.$set(this.selects[key], "loading", true);
          this.api("global/get_all", {
            table,
            attrs: [text, value]
          })
            .then(x => {
              this.$set(this.selects[key], "data", x.data);
            })
            .catch(error => {
              console.log(error);
              console.log(table);
              this.$set(
                this.selects[key],
                "error",
                "حدث خطأ أثناء استدعاء الداتا من قاعدة البيانات"
              );
            })
            .finally(() => {
              this.$set(this.selects[key], "loading", false);
            });
        }
      });
    }
  },
  computed: {
    ccards() {
      let cards = this.cards,
        conscripte = this.c;
      cards.forEach((card, ci) => {
        card.rows.forEach((row, i) => {
          if (row[0].loop && row[0].loop.length > 0) {
            let loop = row[0].loop,
              loopers = conscripte[loop];
            if (loopers && loopers.length > 0) {
              let rowsVals = [];
              for (let li = 0; li < loopers.length; li++) {
                let vals = row[0].vals;
                let rowVals = [];
                vals.forEach(val => {
                  let newVal = `${loop}.${li}.${val}`;
                  let pushVal = conscripte;
                  if (newVal && newVal.includes(".")) {
                    let vals_f = newVal.split(".");
                    vals_f.forEach(val_f => {
                      if (val_f == Number(val_f)) {
                        pushVal = pushVal[Number(val_f)]
                          ? pushVal[Number(val_f)]
                          : "";
                      } else {
                        pushVal = pushVal[val_f] ? pushVal[val_f] : "";
                      }
                    });
                  } else {
                    pushVal = conscripte[newVal];
                  }
                  let objToUse = {
                    val: pushVal
                  };
                  if (
                    row[0].colsObj &&
                    Object.keys(row[0].colsObj).includes(val)
                  ) {
                    objToUse.cols = row[0].colsObj[val];
                  }
                  rowVals.push(objToUse);
                });
                rowsVals.push(rowVals);
              }
              rowsVals.forEach(el => {
                cards[ci].rows.push(el);
              });
            }
          }
          // local Loopers
          if (row[0].localLoop && row[0].localLoop.length > 0) {
            let loop = row[0].localLoop,
              loopers = conscripte[loop];
            if (loopers && loopers.length > 0) {
              let rowsVals = [];
              for (let li = 0; li < loopers.length; li++) {
                let localVals = row[0].localVals;
                let rowLocalVals = [];
                localVals.forEach(val => {
                  let newVal = `${loop}.${li}.${val}`;
                  let pushVal = conscripte;
                  if (newVal && newVal.includes(".")) {
                    let vals_f = newVal.split(".");
                    vals_f.forEach(val_f => {
                      if (val_f == Number(val_f)) {
                        pushVal = pushVal[Number(val_f)]
                          ? pushVal[Number(val_f)]
                          : "";
                      } else {
                        pushVal = pushVal[val_f] ? pushVal[val_f] : "";
                      }
                    });
                  } else {
                    pushVal = conscripte[newVal];
                  }
                  let objToUse = {
                    localVal: pushVal
                  };
                  if (
                    row[0].colsObj &&
                    Object.keys(row[0].colsObj).includes(val)
                  ) {
                    objToUse.cols = row[0].colsObj[val];
                  }
                  rowLocalVals.push(objToUse);
                });
                rowsVals.push(rowLocalVals);
              }
              rowsVals.forEach(el => {
                cards[ci].rows.push(el);
              });
            }
          }
          // Val
          row.forEach((f, ii) => {
            if (f.val) {
              cards[ci].rows[i][ii].vkey = f.dbkey ? f.dbkey : f.val;
              if (!f.fixedVal) {
                if (f.val && f.val.includes(".")) {
                  let vals = f.val.split("."),
                    element = conscripte;
                  vals.forEach(val => {
                    if (val == Number(val)) {
                      element = element[Number(val)]
                        ? element[Number(val)]
                        : "";
                    } else {
                      element = element[val] ? element[val] : "";
                    }
                  });
                  cards[ci].rows[i][ii].val = element;
                } else {
                  cards[ci].rows[i][ii].val = conscripte[f.val];
                }
              }
              if (f.type == "split") {
                f.splitWith.forEach(w => {
                  if (f.val && f.val.includes(w)) {
                    cards[ci].rows[i][ii].splitWithUse = w;
                  }
                });
              }
            }
            if (f.localVal) {
              cards[ci].rows[i][ii].lvkey = f.dbkey ? f.dbkey : f.localVal;
              if (!f.fixedVal) {
                if (f.localVal && f.localVal.includes(".")) {
                  let vals = f.localVal.split("."),
                    element = conscripte;
                  vals.forEach(val => {
                    if (val == Number(val)) {
                      element = element[Number(val)]
                        ? element[Number(val)]
                        : "";
                    } else {
                      element = element[val] ? element[val] : "";
                    }
                  });
                  cards[ci].rows[i][ii].localVal = element;
                } else {
                  cards[ci].rows[i][ii].localVal = conscripte[f.localVal];
                }
              }
              if (f.type == "split") {
                f.splitWith.forEach(w => {
                  if (f.localVal && f.localVal.includes(w)) {
                    cards[ci].rows[i][ii].splitWithUse = w;
                  }
                });
              }
            }
          });
        });
      });
      return cards;
    }
  },
  data: () => ({
    imageLoading: false,
    cc: {},
    selects: {
      areaId: {
        table: "mobilizationAreas",
        text: "name",
        value: "areaId"
      },
      webPower_Id: {
        table: "webPowers",
        text: "displayedText",
        value: "id"
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
      stateId: {
        table: "dutyStates",
        text: "text",
        value: "stateId"
      },
      webJobInArmyId: {
        table: "webJobInArmies",
        text: "displayedText",
        value: "id"
      },
      qualificationId: {
        table: "qualifications",
        text: "name",
        value: "qualificationId"
      },
      forceId: {
        table: "forces",
        text: "name",
        value: "forceId"
      },
      reductionStateId: {
        table: "reductionStates",
        text: "state",
        value: "reductionStateId"
      },
      webCaltureLevelId: {
        table: "webCaltureLevels",
        text: "displayedText",
        value: "id"
      },
      webMedicalLevelId: {
        table: "webMedicalLevels",
        text: "displayedText",
        value: "id"
      },
      webCivilQualificationId: {
        table: "webCivilQualifications",
        text: "displayedText",
        value: "id"
      },
      religionId: {
        table: "religions",
        text: "displayedText",
        value: "id"
      },
      bloodTypeId: {
        table: "bloodTypes",
        text: "displayedText",
        value: "id"
      },
      martialStateId: {
        table: "martialStates",
        text: "state",
        value: "martialStateId"
      },
      webJobBeforeConscriptionId: {
        table: "webJobBeforeConscriptions",
        text: "displayedText",
        value: "id"
      },
      governorateId: {
        table: "governorates",
        text: "displayedText",
        value: "id"
      },
      webQesmId: {
        table: "webQesms",
        text: "displayedText",
        value: "id"
      },
      webRegionId: {
        table: "webRegions",
        text: "displayedText",
        value: "id"
      },
      webSegelMadanyId: {
        table: "webSegelMadanies",
        text: "displayedText",
        value: "id"
      },
      webMoralsDegreeId: {
        table: "webMoralsDegrees",
        text: "displayedText",
        value: "id"
      }
    },
    cc_types: {
      tripartiteNumber: "text",
      areaId: "select",
      webPower_Id: "select",
      zoneId: "select",
      additionalYearStateId: "select",
      fullName: "text",
      stateId: "select",
      webJobInArmyId: "select",
      qualificationId: "select",
      conscriptionDate: "date",
      forceId: "select",
      reductionStateId: "select",
      webCaltureLevelId: "select",
      webLastComsionDate: "date",
      webMedicalLevelId: "select",
      webCivilQualificationId: "select",
      religionId: "select",
      bloodTypeId: "select",
      martialStateId: "select",
      birthDate: "date",
      webJobBeforeConscriptionId: "select",
      phone: "text",
      governorateId: "select",
      webQesmId: "select",
      webRegionId: "select",
      webSegelMadanyId: "select",
      nationalId: "text",
      address: "text",
      webMoralsDegreeId: "select",
      notes: "textarea"
      // demobilizationDate: "date"
    },
    isWebTypes: [
      {
        title: "عرض التعديلات الآلية",
        value: true
      },
      {
        title: "عرض التعديلات اليدوية",
        value: false
      }
    ],
    cards: [
      {
        title: "بيانات تجنيدية",
        rows: [
          [
            {
              key: "الرقم العسكري",
              val: "militaryId",
              localVal: "militaryId"
            },
            {
              key: "الرقم الثلاثي",
              val: "tripartiteNumber",
              localVal: "tripartiteNumber",
              type: "split",
              splitWith: ["-", "/"]
            }
          ],
          [
            {
              key: "منطقة التجنيد",
              val: "webMobilizationArea.displayedText",
              localVal: "mobilizationArea.name",
              dbkey: "areaId"
            },
            {
              key: "القوات",
              val: "webPower.displayedText",
              localVal: "webPower.displayedText",
              dbkey: "webPower_Id"
              // No localVal
            }
          ],
          [
            {
              key: "التمركز",
              val: "webZone.displayedText",
              localVal: "zone.zoneText",
              dbkey: "zoneId"
            },
            {
              key: "نوع التجنيد",
              val: "webAdditionalYear.displayedText",
              localVal: "additionalYear.state",
              dbkey: "additionalYearStateId"
            }
          ],
          [
            {
              key: "الإسم",
              val: "fullName",
              localVal: "fullName"
            },
            {
              key: "الحالة",
              val: "webDutyState.displayedText",
              localVal: "dutyState.text",
              dbkey: "stateId"
            }
          ],
          [
            {
              key: "التخصص",
              val: "webJobInArmy.displayedText",
              localVal: "webJobInArmy.displayedText",
              dbkey: "webJobInArmyId"
              // No localVal
            },
            {
              key: "المؤهل",
              val: "webQualification.displayedText",
              localVal: "qualification.name", // still
              dbkey: "qualificationId"
            }
          ],
          [
            {
              key: "تاريخ الإلحاق",
              val: "webConscriptionDate",
              localVal: "conscriptionDate"
            },
            {
              key: "السلاح",
              val: "webForce.displayedText",
              localVal: "force.name", // still
              dbkey: "forceId"
            }
          ],
          [
            {
              key: "رقم الرخصة الأولى",
              val: "webLicences.0.number"
            },
            {
              key: "تاريخ الرخصة الأولى",
              val: "webLicences.0.date"
            }
          ],
          [
            {
              key: "رقم الرخصة الثانية",
              val: "webLicences.1.number"
            },
            {
              key: "تاريخ الرخصة الثانية",
              val: "webLicences.1.date"
            }
          ],
          [
            {
              key: "قرار التخفيض",
              val: "webReductionState.displayedText",
              localVal: "reductionState.state", // still
              dbkey: "reductionStateId"
            },
            {
              key: "المستوى الثقافي",
              val: "webCaltureLevel.displayedText",
              localVal: "webCaltureLevel.displayedText",
              dbkey: "webCaltureLevelId"
              // No localVal
            }
          ],
          [
            {
              key: "تاريخ آخر كومسيون",
              val: "webLastComsionDate",
              localVal: "webLastComsionDate"
              // No localVal
            },
            {
              key: "المستوى الطبي",
              val: "webMedicalLevel.displayedText",
              localVal: "webMedicalLevel.displayedText",
              dbkey: "webMedicalLevelId"
              // No localVal
            }
          ],
          [
            {
              key: "نوع التعبئة"
            },
            {
              key: "رقم التعبئة"
            },
            {
              key: "مكتب التعبئة"
            },
            {
              key: "تاريخ التعبئة"
            },
            {
              key: "رقم التليفون"
            }
          ],
          [
            {
              loop: "webTa3Be2A",
              vals: [
                "webTa3Be2AType.displayedText",
                "number",
                "office",
                "date",
                "phone"
              ]
            }
          ]
        ]
      },
      {
        title: "بيانات شخصية",
        rows: [
          [
            {
              key: "المؤهل المدني",
              val: "webCivilQualification.displayedText",
              dbkey: "webCivilQualificationId",
              // No localVal
              colsObj: {
                val: "5"
              }
            },
            {
              key: "الديانة",
              val: "webReligion.displayedText",
              localVal: "religion.displayedText",
              dbkey: "religionId",
              cols: "1"
            },
            {
              key: "فصيلة الدم",
              val: "webBloodType.displayedText",
              localVal: "bloodType.displayedText",
              dbkey: "bloodTypeId",
              cols: "1"
            }
          ],
          [
            {
              key: "الحالة الإجتماعية",
              val: "webMaritalStatus.displayedText",
              localVal: "martialState.state",
              dbkey: "martialStateId"
            },
            {
              key: "تاريخ الميلاد",
              val: "birthDate",
              localVal: "birthDate"
            }
          ],
          [
            {
              key: "المهنة قبل التجنيد",
              val: "webJobBeforeConscription.displayedText",
              localVal: "webJobBeforeConscription.displayedText",
              dbkey: "webJobBeforeConscriptionId"
              // No localVal
            },
            {
              key: "التليفون",
              val: "phone",
              localVal: "phone"
            }
          ],
          [
            {
              key: "جهة الميلاد"
            }
          ],
          [
            {
              key: "محافظة",
              val: "webGovernorate.displayedText",
              localVal: "governorate.displayedText",
              dbkey: "governorateId"
            },
            {
              key: "القسم / المركز",
              val: "webQesm.displayedText",
              localVal: "webQesm.displayedText",
              dbkey: "webQesmId"
            },
            {
              key: "الحي / البلد",
              val: "webRegion.displayedText",
              localVal: "webRegion.displayedText",
              dbkey: "webRegionId"
            }
          ],
          [
            {
              key: "بيانات بطاقة الرقم القومي"
            }
          ],
          [
            {
              key: "محافظة",
              val: "webGovernorate.displayedText",
              localVal: "governorate.displayedText",
              dbkey: "governorateId"
            },
            {
              key: "سجل مدني",
              val: "webSegelMadany.displayedText",
              localVal: "webSegelMadany.displayedText",
              dbkey: "webSegelMadanyId"
            },
            {
              key: "الرقم القومي",
              val: "nationalId",
              localVal: "nationalId"
            }
          ],
          [
            {
              key: "العنوان",
              val: "address",
              localVal: "address",
              colsObj: {
                val: "10"
              }
            }
          ],
          [
            {
              key: "بيانات أقرب الأقارب"
            }
          ],
          [
            {
              key: "درجة القرابة",
              val: "webMostRelivant.degree"
            },
            {
              key: "الإسم",
              val: "webMostRelivant.name"
            }
          ],
          [
            {
              key: "رقم التليفون",
              val: "webMostRelivant.phone"
            },
            {
              key: "العنوان",
              val: "webMostRelivant.address"
            }
          ]
        ]
      },
      {
        title: "القسم الأول : الترقي والعزل",
        rows: [
          [
            {
              key: "ترقي / عزل"
            },
            {
              key: "الدرجة"
            },
            {
              key: "التاريخ"
            },
            {
              key: "رقم بند الأوامر"
            },
            {
              key: "تاريخ بند الأوامر"
            },
            {
              key: "ملاحظات"
            }
          ],
          [
            {
              loop: "webPromotions",
              vals: [
                "webPromotionType.displayedText",
                "webDegree.displayedText",
                "date",
                "orderNumber",
                "orderDate",
                "notes"
              ],
              localLoop: "promotions",
              localVals: [
                "promotionType.displayedText",
                "to",
                "date",
                "order",
                "orderDate",
                "notes"
              ]
            }
          ]
        ]
      },
      {
        title: "القسم الثاني : الوحدات وجهات الخدمة",
        rows: [
          [
            {
              key: "الوحدة",
              cols: "5"
            },
            {
              key: "تاريخ الضم"
            },
            {
              key: "رقم بند الأوامر"
            },
            {
              key: "تاريخ بند الأوامر"
            }
          ],
          [
            {
              loop: "webUnits",
              vals: [
                "webUnit.displayedText",
                "webUnit.joinDate",
                "webUnit.orderNumber",
                "webUnit.orderDate"
              ],
              colsObj: {
                "webUnit.displayedText": "5",
                aliasText: "5"
              },
              localLoop: "units",
              localVals: ["aliasText", "joinDate", "orderNumber", "orderDate"]
            }
          ]
        ]
      },
      {
        title: "القسم الثالث : الفرق التعليمية",
        rows: [
          [
            {
              key: "اسم الفرقة / الدورة"
            },
            {
              key: "من"
            },
            {
              key: "الى"
            },
            {
              key: "التقدير العام"
            },
            {
              key: "رقم بند الأوامر"
            },
            {
              key: "تاريخ بند الأوامر"
            }
          ],
          [
            {
              loop: "webClasses",
              vals: []
            }
          ]
        ]
      },
      {
        title: "القسم الرابع : بيانات تكتب عند انتهاء مدة الخدمة",
        rows: [
          [
            {
              key: "بيانات الخدمة",
              val: "سنة-شهر-يوم",
              localVal: "سنة-شهر-يوم",
              type: "split",
              splitWith: ["-", "/"],
              fixedVal: true
            }
          ],
          [
            {
              key: "تاريخ التجنيد",
              val: "webConscriptionDate",
              localVal: "conscriptionDate",
              type: "split",
              splitWith: ["-", "/"]
            }
          ],
          [
            {
              key: "تاريخ التسريح المبدئي",
              val: "webDemobilizationDateStarter",
              localVal: "demobilizationDateStarter",
              type: "split",
              splitWith: ["-", "/"]
            }
          ],
          [
            {
              key: "تاريخ إنهاء الخدمة",
              val: "webDemobilizationDate",
              localVal: "demobilizationDate",
              type: "split",
              splitWith: ["-", "/"]
            }
          ],
          [
            {
              key: "مدة الخدمة",
              val: "webServicePeriod",
              localVal: "servicePeriod",
              type: "split",
              splitWith: ["-", "/"]
            }
          ],
          [
            {
              key: "المدة الفاقدة",
              val: "webLostPeriod",
              localVal: "lostPeriod",
              type: "split",
              splitWith: ["-", "/"]
            }
          ],
          [
            {
              key: "صافي مدة الخدمة",
              val: "webClearServicePeriod",
              localVal: "clearServicePeriod",
              type: "split",
              splitWith: ["-", "/"]
            }
          ],
          [
            {
              key: "درجة الأخلاق",
              val: "webMoralsDegree.displayedText",
              localVal: "moralsDegree.displayedText"
              // dbkey: "moralsDegreeId"
              // No localVal
            }
          ]
        ]
      },
      {
        title:
          "القسم الخامس : العقوبات الإنضباطية وأحكام المحاكم العسكرية والمدنية",
        rows: [
          [
            {
              key: "تاريخ الجريمة"
            },
            {
              key: "نص الجريمة",
              cols: "3"
            },
            {
              key: "العقوبة بالأيام",
              cols: "1"
            },
            {
              key: "الآمر بالعقوبة",
              cols: "1"
            },
            {
              key: "العقوبة الموقعة",
              cols: "1"
            },
            {
              key: "من"
            },
            {
              key: "الى"
            },
            {
              key: "رقم بند الأوامر",
              cols: "1"
            },
            // {
            //   key: "تاريخ بند الأوامر"
            // },
            {
              key: "نوع العقوبة",
              cols: "1"
            }
            // {
            //   key: "تاريخ المحكمة"
            // },
            // {
            //   key: "مكان انعقاد المحكمة"
            // }
          ],
          [
            {
              loop: "webPenalities",
              vals: [
                "date",
                "crimeText",
                "periodInDays",
                "webPenalityOrderer.displayedText",
                "webPenalityKind.displayedText",
                "fromDate",
                "toDate",
                "orderNumber",
                // "orderDate",
                "webPenalityType.displayedText"
                // "courtDate",
                // "webCourtPlace.displayedText"
              ],
              localLoop: "penalties",
              localVals: [
                "crimeStartDate",
                "crimeText",
                "penaltyTotalTime",
                "orderer",
                "penaltyText",
                "penaltyStartDate",
                "penaltyEndDate",
                "orderNumber",
                "penaltyType.displayText"
              ],
              colsObj: {
                crimeText: "3",
                periodInDays: "1",
                penaltyTotalTime: "1",
                "webPenalityOrderer.displayedText": "1",
                orderer: "1",
                "webPenalityKind.displayedText": "1",
                penaltyText: "1",
                orderNumber: "1",
                "webPenalityType.displayedText": "1",
                "penaltyType.displayedText": "1"
              }
            }
          ]
        ]
      },
      {
        title: "القسم السادس : المعارك الحربية التي اشترك فيها الفرد",
        rows: [
          [
            {
              key: "اسم المعركة"
            },
            {
              key: "مكانها"
            },
            {
              key: "تاريخها"
            },
            {
              key: "رقم التصديق"
            },
            {
              key: "نوع التصديق"
            },
            {
              key: "تاريخ الإصابة"
            },
            {
              key: "ملخص التقرير الطبي الخاص بالإصابة"
            },
            {
              key: "ملخص قرار المجلس الطبي العسكري"
            },
            {
              key: "قرار لجنة التعويضات"
            }
          ],
          [
            {
              loop: "webWars",
              vals: []
            }
          ]
        ]
      },
      {
        title:
          "القسم السابع : ملاحظات عامة تدون بها أي مؤثرات غير واردة بالنموذج",
        rows: [
          [
            {
              key: "الملاحظات"
            }
          ],
          [
            {
              val: "notes",
              localVal: "notes"
            }
          ]
        ]
      }
    ]
  })
};
</script>
