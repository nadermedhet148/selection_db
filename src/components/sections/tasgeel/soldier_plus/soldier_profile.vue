<template>
  <div>
    <v-dialog
      v-if="isCurrentRoute(componentName)"
      scrollable
      max-width="450"
      v-model="loading"
    >
      <v-card>
        <v-card-text class="pt-8">
          <v-progress-linear v-model="progress.value" height="30">
            <span class="white--text">
              {{ progress.value > 100 ? 100 : progress.value }}%
            </span>
          </v-progress-linear>
          <span class="font-weight-bold"> تحميل {{ progress.text }}... </span>
        </v-card-text>
      </v-card>
    </v-dialog>
    <div v-if="!loading">
      <div v-if="show_type == 'basic'">
        <basic-profile
          :soldier_id="soldier_id"
          :loading="loading"
          :conscripte.sync="conscripte"
          :externals.sync="externals"
          @set-no-current-id="$emit('set-no-current-id')"
          @loopOnRemoveOrRedTab_requests="loopOnRemoveOrRedTab_requests()"
          @force_reload_cons="getConscripte()"
          ref="basic_profile"
          :demobilizationObj="demobilizationObj"
        ></basic-profile>
      </div>
      <div v-else>
        <profile-header
          :loading="loading"
          :conscripte.sync="conscripte"
        ></profile-header>
      </div>
    </div>
  </div>
</template>

<script>
let loadView = function(name) {
  return function(resolve) {
    require([
      `@/components/sections/tasgeel/soldier_plus/soldier_profile/${name}.vue`
    ], resolve);
  };
};
export default {
  name: "soldier-profile",
  components: {
    BasicProfile: loadView("basic_profile/index"),
    ProfileHeader: loadView("profile-header")
  },
  props: {
    soldier_id: {
      type: String,
      default: ""
    }
  },
  data: () => ({
    componentName: "soldiers_plus",
    loading: true, // Global loader
    demobilizationObj: {},
    progress: {
      value: 0,
      text: ""
    },
    show_type: "basic",
    conscripte: {},
    externals: {},
    removeOrRedTab_requests: []
  }),
  watch: {
    soldier_id() {
      this.getConscripte();
    }
  },
  computed: {
    // params() {
    //   let index = this.$store.state.routes.findIndex(
    //       v => v.name == this.componentName
    //     ),
    //     params = {};
    //   if (index !== -1) {
    //     params = this.$store.state.routes[index].params;
    //   }
    //   return params;
    // }
  },
  mounted() {
    this.getConscripte();
  },
  methods: {
    addRemoveOrRedTab_request(req = []) {
      this.$set(
        this.removeOrRedTab_requests,
        this.removeOrRedTab_requests.length,
        req
      );
    },
    loopOnRemoveOrRedTab_requests() {
      let requests = this.removeOrRedTab_requests;
      requests.forEach(req => {
        this.$refs.basic_profile.removeOrRedTab(...req);
      });
    },
    addProgress(text) {
      this.$set(this.progress, "value", this.progress.value + 6);
      this.$set(this.progress, "text", text);
    },
    addExternal(external, data, type = "array", other_date_keys = []) {
      if (data.ok && (type !== "array" || data.data.length > 0)) {
        let date_keys = Object.keys(type == "array" ? data.data[0] : data.data)
            .map(k => (k.includes("Date") ? k : "NOT_A_DATE"))
            .filter(k => k !== "NOT_A_DATE"),
          result = this.fixDates(type == "array" ? data.data : [data.data], [
            ...date_keys,
            ...other_date_keys
          ]);
        this.$set(
          this.externals,
          external,
          type == "array" ? result : result[0]
        );
      }
    },
    loadExternalArray(
      key,
      name,
      includes = [],
      include = [],
      tableName = "",
      other_date_keys = []
    ) {
      // Only for arrays
      // By default: tableName is the same as key
      let militaryId = this.conscripte.militaryId,
        that = this;
      includes.forEach(tbl => {
        include.push({
          model: tbl
        });
      });
      return new Promise((success, failure) => {
        this.addProgress(name);
        return that
          .api("global/get_all", {
            table: tableName ? tableName : key,
            where: {
              militaryId
            },
            include
          })
          .then(cons => {
            that.addRemoveOrRedTab_request([
              "red",
              key,
              cons.ok && cons.data.length > 0,
              cons.data.length
            ]);
            if (key == "injuries") {
              cons.data = that.selectToArray(cons.data, ["injuryAttachments"]);
            }
            // marker => filter medicalCommittees that has injury obj and injury.healingReportId == 2
            // if (key == "medicalCommittees" && cons.data && cons.data.length) {
            //   cons.data = cons.data.filter(el => {
            //     if (!el.injury) {
            //       return true;
            //     }
            //     if (el.injury.healingReportId != "2") {
            //       return false;
            //     }
            //     return true;
            //   });
            // }

            // marker
            that.addExternal(key, cons, "array", other_date_keys);
            success(true);
          })
          .catch(err => {
            failure(err);
          });
      });
    },
    async getConscripte() {
      // let militaryId = this.params.id;
      let militaryId = this.soldier_id;
      this.$set(this, "externals", {});
      this.$set(this, "conscripte", {});
      this.$set(this, "removeOrRedTab_requests", []);
      this.$set(this, "loading", true);
      this.$set(this.progress, "text", "تاريخ التسريح");
      this.$set(this.progress, "value", 12);
      let demobilizationObj = await this.fixDemobilizationDate(militaryId);
      this.demobilizationObj = demobilizationObj;

      this.$set(this.progress, "text", "البيانات الأساسية");
      this.$set(this.progress, "value", 22);
      this.api("global/get_one", {
        table: "conscriptes",
        where: {
          militaryId
        }
      })
        .then(async x => {
          let date_keys = Object.keys(x.data)
              .map(k => (k.includes("Date") ? k : "NOT_A_DATE"))
              .filter(k => k !== "NOT_A_DATE"),
            other_date_keys = [];
          this.$set(
            this,
            "conscripte",
            this.fixDates([x.data], [...date_keys, ...other_date_keys])[0]
          );
          // ** Load external arrays
          await this.loadExternalArray("fugitives", "الهروب");
          await this.loadExternalArray(
            "injuries",
            "الإصابات / الأمراض",
            ["healingReports"],
            [
              {
                model: "medicalCommittees",
                include: [
                  {
                    model: "committees"
                  }
                ]
              }
            ]
          );
          await this.loadExternalArray("medicalCommittees", "المجلس الطبي", [
            "committees",
            "injuries",
            "medicalCommitteeTypes"
          ]);
          await this.loadExternalArray(
            "courts",
            "التحقيقات والمحاكم",
            [],
            [],
            "",
            [
              "imprisonFrom",
              "imprisonTo",
              "prosecutionFrom",
              "prosecutionTo",
              "lastUnitReply",
              "lastBranchReply",
              "lastShbka"
            ]
          );
          await this.loadExternalArray("penalties", "العقوبات", [
            "penaltyTypes"
          ]);
          // Start: Handle ignorant manually
          this.addProgress("محو الأمية");
          let failureSessions = await this.api("global/get_all", {
            table: "failureSessions",
            where: {
              milId: militaryId
            }
          });
          this.addRemoveOrRedTab_request([
            "red",
            "ignorants",
            failureSessions.ok && x.data.ignorantId == 1,
            failureSessions.data.length
          ]);
          this.addExternal("failureSessions", failureSessions, "array", [
            "from",
            "to"
          ]);
          // ../End: Handle ignorant manually
          await this.loadExternalArray("promotions", "الترقي والعزل");
          await this.loadExternalArray("exemptions", "الإعفاء المؤقت");
          await this.loadExternalArray("serveUnits", "جهات الخدمة");
          await this.loadExternalArray("efficiencyReports", "تقرير الكفاءة");
          await this.loadExternalArray("medicalStates", "المستوى الطبي");
          await this.loadExternalArray("travilingAbroads", "السفر للخارج");
          // Finishing page load
          this.addProgress("الصفحة");
        })
        .catch(error => {
          console.log("Error in Soldier Profile");
          console.log(error);
          if (error.data) {
            this.showError("حدث خطأ أثناء تحميل البيانات.");
          } else {
            this.showError("الرقم العسكري غير صحيح.");
          }
        })
        .finally(() => {
          this.$set(this, "loading", false);
        });
    }
  }
};
</script>
