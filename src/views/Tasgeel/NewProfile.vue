<template>
  <div>
    <v-dialog
      persistent
      v-model="model"
      v-if="!params.id && isCurrentRoute(componentName)"
      scrollable
      max-width="450"
    >
      <v-card :loading="search.loading" :disabled="search.loading">
        <v-card-title> الرقم العسكري </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pt-6">
          <v-text-field
            v-model="search.militaryId"
            filled
            persistent-hint
            label="الرقم العسكري المطلوب"
            hint="من فضلك أدخل رقم عسكري لجندي أو ضابط صف"
            counter="13"
            @keypress.enter="findConscripte()"
          ></v-text-field>
        </v-card-text>
        <v-card-actions class="px-4">
          <v-btn
            class="px-6"
            @click="goThere('/'), deleteRouteByName(componentName)"
            v-text="'إغلاق للرئيسية'"
            color="primary"
            large
            text
          ></v-btn>
          <v-spacer></v-spacer>
          <v-btn
            class="px-6"
            @click="goBack()"
            v-text="'رجوع'"
            color="primary"
            large
            outlined
          ></v-btn>
          <v-btn
            @click="findConscripte()"
            class="px-6"
            v-text="'بحث'"
            color="primary"
            large
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <div v-else>
      <v-row>
        <v-col v-if="conscripte && conscripte.militaryId">
          <s1 :c.sync="conscripte"></s1>
        </v-col>
        <!-- <v-col cols="12" lg="4">
          <v-card
            style="overflow: hidden"
            dark
            :loading="search.loading ? 'yellow' : false"
            :disabled="search.loading"
          >
            <v-card-title>
              الـ Console
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <pre
                class="text-left yellow-text"
                dir="ltr"
                v-html="conscripte"
              ></pre>
            </v-card-text>
          </v-card>
        </v-col> -->
      </v-row>
    </div>
  </div>
</template>

<script>
let loadView = function(name) {
  return function(resolve) {
    require([`@/components/sections/tasgeel/new_profile/${name}.vue`], resolve);
  };
};
export default {
  components: {
    s1: loadView("s1"),
    s2: loadView("s2")
  },
  props: {
    demobilizationObj: {
      type: Object,
      default: () => ({})
    },
    soldier_id: {
      type: String,
      default: ""
    }
  },
  name: "new-profile",
  mounted() {
    // let id = this.soldier_id;
    let id = this.params.id;
    if (id) {
      this.findConscripte(id);
    }
    // if (id) {
    // }
  },
  data: () => ({
    model: true,
    model_reselect: false,
    search: {
      militaryId: "",
      loading: false
    },
    conscripte: {},
    componentName: "soldiers_plus"
  }),
  computed: {
    params() {
      let index = this.$store.state.routes.findIndex(
          v => v.name == this.componentName
        ),
        params = {};
      if (index !== -1) {
        params = this.$store.state.routes[index].params;
      }
      return params;
    }
  },
  methods: {
    findConscripte(id) {
      let militaryId = id || this.search.militaryId,
        includes = {
          // Local
          mobilizationAreas: [],
          zones: [],
          additionalYears: [],
          dutyStates: [],
          qualifications: [],
          forces: [],
          degrees: [],
          reductionStates: [],
          religions: [],
          bloodTypes: [],
          martialStates: [],
          governorates: [],
          units: [],
          ignorants: [],
          ignorantSupporters: [],
          // Web
          webAdditionalYears: [],
          webBloodTypes: [],
          webCaltureLevels: [],
          webCivilQualifications: ["webCivilQualificationGroups"],
          // Cannot do this, Because conscriptes has many webConscripteUnits,
          // while the sequelize options i'm using don't support this.
          // webConscripteUnits: ["webUnits"]
          // Cannot do this, because conscriptes table dosn't contain a definition for webDegreId
          // webDegrees: []
          webDutyStates: [],
          webForces: [],
          webGovernorates: [],
          webJobBeforeConscriptions: [],
          webJobInArmies: [],
          // Same as webConscripteUnits
          // webLicences: ["webLicenceTypes"],
          webMaritalStatus: [],
          webMedicalLevels: [],
          militaryOperationParticipants: ["militaryOperations"],
          webMobilizationAreas: [],
          webMoralsDegrees: [],
          webMostRelivants: [],
          webPowers: [],
          webQesms: ["webGovernorates"],
          webQualifications: [],
          webReductionStates: [],
          webRegions: [],
          webReligions: [],
          webSegelMadanies: ["webGovernorates"],
          webUnits: ["webZones"],
          webZones: [],
          prevPeriod: []
        },
        include = [];
      Object.keys(includes).forEach(key => {
        let val = includes[key],
          keyIncludes = [];
        val.forEach(v => {
          keyIncludes.push({
            model: v
          });
        });
        include.push({
          model: key,
          include: keyIncludes
        });
      });
      this.$set(this.search, "loading", true);
      this.api("global/get_one", {
        table: "conscriptes",
        where: {
          militaryId
          // isWeb: true,
          // webQualificationId: 1
          // webReductionStateId: 1
        },
        include
      })
        .then(async x => {
          // Get Other Arrays
          let webLicences = await this.api("global/get_all", {
              table: "webLicences",
              where: {
                militaryId
              }
            }),
            webTa3Be2A = await this.api("global/get_all", {
              table: "webTa3Be2A",
              where: {
                militaryId
              },
              include: [
                {
                  model: "webTa3Be2AType"
                }
              ]
            }),
            webUnits = await this.api("global/get_all", {
              table: "webConscripteUnits",
              where: {
                militaryId
              },
              include: [
                {
                  model: "webUnits"
                }
              ]
            }),
            webPenalities = await this.api("global/get_all", {
              table: "webPenalities",
              where: {
                militaryId
              },
              include: [
                {
                  model: "webPenalityOrderers"
                },
                {
                  model: "webPenalityKinds"
                },
                {
                  model: "webPenalityTypes"
                },
                {
                  model: "webCourtPlaces"
                }
              ]
            }),
            webPromotions = await this.api("global/get_all", {
              table: "webPromotions",
              where: {
                militaryId
              },
              include: [
                {
                  model: "webPromotionTypes"
                },
                {
                  model: "webDegrees"
                }
              ]
            }),
            promotions = await this.api("global/get_all", {
              table: "promotions",
              where: {
                militaryId
              },
              include: []
            }),
            penalties = await this.api("global/get_all", {
              table: "penalties",
              where: {
                militaryId
              },
              include: [
                {
                  model: "penaltyTypes"
                }
              ]
            }),
            splitPeriods = [
              "webServicePeriod",
              "webLostPeriod",
              "webClearServicePeriod",
              "servicePeriod",
              "lostPeriod",
              "clearServicePeriod"
            ],
            fixTime = function(t) {
              if (t && t > 0) {
                let second = t / 1000,
                  minute = second / 60,
                  hour = minute / 60,
                  day = hour / 24;
                return day; // TODO: add [ day - 5 ] because there is 5 days defrence " I don't know why! "
              }
              return 0;
            },
            cdate = x.data.conscriptionDate,
            ddate = x.data.demobilizationDate,
            dsdate = x.data.demobilizationDateStarter,
            // cdate is the day you joined the army .
            // dsdate is the day you are supposed to leave the army ex: 1/3/2020 for hamdi
            // ddate is the actual day you finished your nantional service ,
            //it must be >= dsdate , if its larger than dsdate then this person has fa2da period.
            safy_moda = new Date(dsdate) - new Date(cdate),
            fa2da = new Date() - new Date(dsdate),
            all_moda = new Date(ddate) - new Date(cdate);
          x.data.servicePeriod = fixTime(all_moda);
          x.data.clearServicePeriod = fixTime(safy_moda);

          // use lost perid from fixDemoblizationDate func
          // x.data.lostPeriod = fixTime(fa2da);
          // totalFa2da(in days) * 24 * 60 * 60
          console.log(this.demobilizationObj.totalFa2da);
          x.data.lostPeriod = this.demobilizationObj.totalFa2da;

          if (x.data.prevPeriod == null) {
            x.data.prevPeriod = {};
          }
          let prevPeriod = x.data.prevPeriod,
            years = prevPeriod.years ? prevPeriod.years : 0,
            months = prevPeriod.months ? prevPeriod.months : 0,
            days = prevPeriod.days ? prevPeriod.days : 0;
          prevPeriod.days = days;
          prevPeriod.months = months;
          prevPeriod.years = years;

          x.data.prevPeriodCombination = `${years}-${months}-${days}`;
          splitPeriods.forEach(p => {
            /**
             * النظام الأول
             * كان السنة360 يوم
             * والشهر 30
             */
            /**
             * النظام الثاني
             * السنة 365 يوم
             * الشهر ب 30 يوم
             * لو جت حاجة 363 يبقى إنت لبست خازوق
             * have fun
             */

            /**
             * النظام الحالي
             * السنة 365 يوم
             * الشهر زي مايكون 30 او 31
             */
            console.log(x.data[p]);
            // let period = x.data[p],
            //   years = Math.floor(Number(period) / 365 /*(12 * 30)*/),
            //   months = Math.floor(
            //     (Number(period) - years * 365) /*(12 * 30)*/ / 30
            //   ),
            //   days = Number(period) - years * 365 /*(12 * 30)*/ - months * 30;
            // x.data[p] = `${Math.round(years)}-${Math.round(
            //   months
            // )}-${Math.round(days)}`;
            let period = x.data[p],
              dateObj = this.daysToDate(period, true);
            x.data[p] = `${dateObj.years}-${dateObj.months}-${dateObj.days}`;
          });

          let date_keys = Object.keys(x.data)
              .map(k => (k.includes("Date") || k == "date" ? k : "NOT_A_DATE"))
              .filter(k => k !== "NOT_A_DATE"),
            other_date_keys = [];
          Object.keys(includes).forEach(key => {
            if (x.data[key]) {
              let child_date_keys = Object.keys(x.data[key])
                .map(k =>
                  k.includes("Date") || k == "date" ? k : "NOT_A_DATE"
                )
                .filter(k => k !== "NOT_A_DATE");
              other_date_keys = [...other_date_keys, ...child_date_keys];
            }
          });
          this.$set(this, "conscripte", {
            units: [x.data.unit],
            promotions: this.fixDates(promotions.data, ["date", "orderDate"]),
            penalties: this.fixDates(penalties.data, [
              "crimeStartDate",
              "crimeEndDate",
              "penaltyStartDate",
              "penaltyEndDate"
            ]),
            webPromotions: this.fixDates(webPromotions.data, ["date"]),
            webPenalities: this.fixDates(webPenalities.data, [
              "date",
              "fromDate",
              "toDate",
              "orderDate",
              "courtDate"
            ]),
            webUnits: this.fixDates(
              webUnits.data.sort((a, b) => b.id - a.id),
              ["createdAt"]
            ),
            webTa3Be2A: this.fixDates(webTa3Be2A.data, ["date"]),
            webLicences: this.fixDates(webLicences.data, ["date"]),
            ...this.fixDates([x.data], [...date_keys, ...other_date_keys])[0]
          });
          if (this.$route.fullPath.includes("/new_profile")) {
            this.goThere("/new_profile/" + x.data.militaryId);
          }
        })
        .catch(error => {
          console.log(error);
          this.showError("حدث خطأ أثناء البحث عن الرقم العسكري المطلوب");
        })
        .finally(() => {
          this.$set(this.search, "loading", false);
        });
    }
  }
};
</script>
