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
const constants = require("../../../../Constant").default;

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

            that.addExternal(key, cons, "array", other_date_keys);
            success(true);
          })
          .catch(err => {
            failure(err);
          });
      });
    },
    async getConscripte(type = "Soldier") {
      let ID = this.soldier_id;

      this.$set(this, "externals", {});
      this.$set(this, "conscripte", {});
      this.$set(this, "removeOrRedTab_requests", []);
      this.$set(this, "loading", true);
      this.$set(this.progress, "text", "تاريخ التسريح");
      this.$set(this.progress, "value", 12);

      this.$set(this.progress, "text", "البيانات الأساسية");
      this.$set(this.progress, "value", 22);
      this.api("global/get_one", {
        table: type,
        where: {
          ID
        },
        include: [
          {
            model: "Weapon"
          },
          {
            model: "Unit"
          },
          {
            model: "Duty"
          },
          {
            model: "City"
          },
          {
            model: "Centre"
          }
        ]
      })
        .then(async x => {
          if (x.data) {
            let date_keys = Object.keys(x.data)
                .map(k => (k.includes("Date") ? k : "NOT_A_DATE"))
                .filter(k => k !== "NOT_A_DATE"),
              other_date_keys = [];
            this.$set(
              this,
              "conscripte",
              this.fixDates(
                [
                  {
                    ...x.data,
                    Type:
                      type == "Rateb"
                        ? constants.serviceTypesMap.highLevel
                        : constants.serviceTypesMap.solider
                  }
                ],
                [...date_keys, ...other_date_keys]
              )[0]
            );
            this.addProgress("الصفحة");
          } else if (type != "Rateb") await this.getConscripte("Rateb");
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
