<template>
  <div>
    <v-card tile flat>
      <v-card-title class="d-block text-h5 primary--text">
        1.
        <span class="ms-3">فرع الأفراد</span>
      </v-card-title>
    </v-card>
    <v-row>
      <v-col cols="12" lg="7">
        <v-card>
          <v-card-title>
            تحديث قاعدة البيانات
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="pt-4">
            <div>
              بإمكانك حالياً تحديث قاعدة البيانات الخاصة بفرع السجلات عن طريق 5
              جداول من قاعدة بيانات فرع الأفرد
            </div>
            <div class="ps-5">
              <ol>
                <li>
                  Soldier : البيانات الأساسية لمجندي الحدود
                </li>
                <li>
                  MS Soldier : البيانات الأساسية لمجندي الإدارات الأخرى
                </li>
                <li>
                  Rateb : البيانات الأساسية لضباط الصف
                </li>
              </ol>
            </div>
            <div>
              من خلال الضغط على الزر السحري التالي
            </div>
          </v-card-text>
          <v-card-actions v-if="!loading" class="px-4">
            <v-btn
              @click="startMerging()"
              outlined
              large
              color="primary"
              class="px-6"
            >
              <v-icon class="me-4">mdi-auto-fix</v-icon>
              تحديث قاعدة البيانات
            </v-btn>
          </v-card-actions>
          <v-card-text v-else class="pt-4">
            <div v-if="progress < 100">
              <v-progress-linear
                :value="progress"
                height="10"
                rounded
                :color="getProgressColor()"
              ></v-progress-linear>
              <div class="mt-2">
                <span> {{ Math.floor(progress) }}% </span>
                <!-- جارِ تحديث
            <span v-text="progressText"></span>
            ... -->
              </div>
              <!-- <div class="mt-8">
                <v-btn icon @click="progress += 4">
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </div> -->
            </div>
            <div v-else>
              <v-icon color="success" size="30" class="me-2"
                >mdi-check-bold</v-icon
              >
              انتهى التحديث بنجاح خلال {{ progressTime.diff }}
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" lg="5">
        <v-card>
          <v-card-title>
            الأخطاء
          </v-card-title>
          <v-divider></v-divider>
          <v-text-field
            filled
            dense
            prepend-inner-icon="mdi-magnify"
            v-model.lazy="errors.search"
          ></v-text-field>
          <v-data-table
            :headers="errors.headers"
            :items="errors.items"
            :search.sync="errors.search"
          ></v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: "afraad-database",
  data: () => ({
    loading: false,
    progress: 0,
    tasks: [
      {
        text: "البيانات الأساسية لمجندي الحدود",
        color: ""
      },
      {
        text: "البيانات الأساسية لمجندي الإدارات الأخرى",
        color: ""
      },
      {
        text: "البيانات الأساسية لضباط الصف",
        color: ""
      }
    ],
    progressText: "",
    progressTime: {
      start: "",
      end: "",
      diff: ""
    },
    errors: {
      headers: [
        {
          text: "الرقم العسكري",
          value: "id",
          sortable: false
        },
        {
          text: "الأخطاء",
          value: "error",
          sortable: false
        }
      ],
      items: [],
      search: ""
    },
    linkedKeys: [
      {
        table: "forces",
        key: "forceId"
      }
    ]
  }),
  methods: {
    getProgressColor() {
      let progress = this.progress,
        color = "error";
      if (progress >= 80) {
        color = "primary";
      } else if (progress >= 50) {
        color = "success";
      } else if (progress >= 25) {
        color = "warning";
      }
      return color;
    },
    async getLinkedKeys() {
      let that = this,
        linkedKeys = this.linkedKeys,
        returner = {};
      return new Promise((success, failure) => {
        // Do all stuff here
        (async function loop() {
          for (let i = 0; i < linkedKeys.length; i++) {
            let linkedKey = linkedKeys[i],
              table = await new Promise((success, failure) => {
                that
                  .api("global/get_all", {
                    table: linkedKey.table,
                    attrs: ["afradId", linkedKey.key]
                  })
                  .then(x => {
                    success(x.data);
                  })
                  .catch(error => {
                    success([]);
                  });
              });
            returner[linkedKey.table] = table;
            if (i == linkedKeys.length - 1) {
              // Done
              success(returner);
            }
          }
        })();
      });
    },
    async startMerging() {
      // 1. Get count of soldiers
      this.$set(this, "loading", true);
      this.$set(this.progressTime, "start", new Date().getTime());
      let that = this,
        divider = 500,
        groups = [],
        // Get Linked Keys
        // linkedKeys = await this.getLinkedKeys(),
        soldierCounter = await this.api(
          "global/count",
          {
            table: "soldier"
          },
          "af"
        ),
        soldierGroupCounter = Math.ceil(soldierCounter.data / divider),
        // 2. Get count of smSoldiers [ Not Hodood ]
        smSoldierCounter = await that.api(
          "global/count",
          {
            table: "smSoldier"
          },
          "af"
        ),
        smSoldierGroupCounter = Math.ceil(smSoldierCounter.data / divider),
        // 3. Get count of rateb
        ratebCounter = await that.api(
          "global/count",
          {
            table: "rateb"
          },
          "af"
        ),
        ratebGroupCounter = Math.ceil(ratebCounter.data / divider),
        allCounter =
          soldierCounter.data + smSoldierCounter.data + ratebCounter.data;
      for (let i = 0; i < soldierGroupCounter; i++) {
        groups.push({
          index: i,
          offset: i * divider,
          type: "soldier",
          counter: divider
        });
      }
      for (let i = 0; i < smSoldierGroupCounter; i++) {
        groups.push({
          index: i,
          offset: i * divider,
          type: "sm_soldier",
          counter: divider
        });
      }
      for (let i = 0; i < ratebGroupCounter; i++) {
        groups.push({
          index: i,
          offset: i * divider,
          type: "rateb",
          counter: divider
        });
      }
      (async function loop() {
        for (let i = 0; i < groups.length; i++) {
          let group = groups[i],
            promiseLoop = await new Promise((success, failure) => {
              let updatedCounterInner = 0;
              that
                .api(
                  `merge/${group.type}`,
                  {
                    ...group
                    // linkedKeys
                  },
                  "af"
                )
                .then(x => {
                  let { counter, errors } = x.data;
                  updatedCounterInner = counter;
                  that.$set(that.errors, "items", [
                    ...that.errors.items,
                    ...errors
                  ]);
                  // console.log(`Updated : ${x.data}`);
                })
                .catch(error => {
                  console.log(error);
                  that.showError("حدث خطأ أثناء تحديث البيانات من الأفراد");
                })
                .finally(() => {
                  let perc = (updatedCounterInner / allCounter) * 100,
                    currentProgress = that.progress;
                  that.$set(that, "progress", perc + currentProgress);
                  // console.log("updatedCounterInner " + updatedCounterInner);
                  // console.log("allCounter " + allCounter);
                  // console.log("perc " + perc);
                  // console.log("progress " + that.progress);
                  if (that.progress >= 100) {
                    that.$set(that.progressTime, "end", new Date().getTime());
                    that.$set(
                      that.progressTime,
                      "diff",
                      that.progressTime.end - that.progressTime.start
                    );
                  }
                  let intVal = setInterval(() => {
                    success(true);
                    clearInterval(intVal);
                  }, 5000);
                });
            });
          promiseLoop = null;
        }
      })();
    }
  }
};
</script>
