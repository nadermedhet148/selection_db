<template>
  <div>
    <v-row>
      <v-col>
        <v-card v-if="job.started">
          <v-card-text class="text-center">
            <v-progress-circular
              :value="job.progress"
              color="primary"
              size="300"
            >
              <div>
                <div class="mt-8">
                  <span class="text-h3"> {{ job.progress }}% </span>
                </div>
                <div class="mt-8">تم {{ job.done }} من {{ soldierLength }}</div>
                <div v-if="job.finished" class="mt-4">
                  <v-btn @click="restart()" outlined color="primary">
                    بدأ عملية جديدة
                  </v-btn>
                </div>
              </div>
            </v-progress-circular>
          </v-card-text>
        </v-card>
        <v-card v-else :loading="soldiers.loading" :disabled="soldiers.loading">
          <v-card-title>
            من فضلك حدد نطاق البحث
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-row>
              <template v-for="(f, i) in fields">
                <v-col :key="i" cols="6">
                  <v-text-field
                    :label="f.label"
                    hide-details
                    type="date"
                    v-if="f.type == 'date'"
                    filled
                    v-model="search[f.value]"
                  ></v-text-field>
                  <v-autocomplete
                    :label="f.label"
                    hide-details
                    clearable
                    v-else-if="f.type == 'select'"
                    :items="
                      selects && selects[f.value] && selects[f.value].data
                        ? selects[f.value].data
                        : []
                    "
                    :item-text="
                      selects && selects[f.value] && selects[f.value].itemText
                        ? selects[f.value].itemText
                        : 'text'
                    "
                    :item-value="
                      selects && selects[f.value] && selects[f.value].itemValue
                        ? selects[f.value].itemValue
                        : 'value'
                    "
                    :loading="
                      selects && selects[f.value]
                        ? selects[f.value].loading
                        : false
                    "
                    filled
                    v-model="search[f.value]"
                  ></v-autocomplete>
                </v-col>
              </template>
            </v-row>
          </v-card-text>
          <v-card-text v-if="soldiers.found">
            <v-alert prominent type="success">
              تم إيجاد {{ soldiers.items.length }}
              مجند في نطاق البحث
            </v-alert>
          </v-card-text>
          <v-card-actions class="px-4">
            <v-btn
              color="primary"
              outlined
              large
              class="px-6"
              @click="findSoldiers()"
            >
              إيجاد المجندين
            </v-btn>
            <v-btn
              :disabled="soldiers.items.length == 0"
              color="primary"
              large
              class="px-6"
              @click="startJob()"
            >
              بدأ العمل
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col>
        <v-card>
          <v-card-title>
            ملاحظات
          </v-card-title>
          <v-divider></v-divider>
          <v-data-table
            :headers="notes.headers"
            :items="notes.items"
            fixed-header
            multi-sort
            hide-default-header
          >
            <template v-slot:header="table">
              <table-header-filters
                :items="notes.items"
                :table="table"
                :filters.sync="tableFilters"
              ></table-header-filters>
            </template>
            <template v-slot:footer="table">
              <table-footer-filters
                :filters.sync="tableFilters"
                :table="table"
              ></table-footer-filters>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: "FixDemobDate",
  mounted() {
    this.init();
  },
  watch: {
    "job.done"(v) {
      if (v) {
        this.$set(
          this.job,
          "progress",
          Math.floor((v * 100) / this.soldierLength)
        );
      }
    }
  },
  computed: {
    soldierLength() {
      return this.soldiers.items.length;
    }
  },
  data: () => ({
    search: {},
    tableFilters: {},
    job: {
      started: false,
      finished: false,
      done: 0,
      progress: 0
    },
    soldiers: {
      items: [],
      found: false,
      loading: false
    },
    notes: {
      headers: [
        {
          text: "الرقم العسكري",
          value: "militaryId"
        },
        {
          text: "الإسم",
          value: "fullName"
        },
        {
          text: "الملاحظات",
          value: "notes"
        }
      ],
      items: []
    },
    fields: [
      {
        label: "تاريخ التجنيد ( من )",
        value: "conscriptionDate_from",
        type: "date"
      },
      {
        label: "تاريخ التجنيد ( الى )",
        value: "conscriptionDate_to",
        type: "date"
      },
      {
        label: "الجيش / المنطقة",
        value: "zoneId",
        type: "select"
      },
      {
        label: "الوحدة",
        value: "unitId",
        type: "select"
      }
    ],
    selects: {
      unitId: {
        table: "units",
        itemText: "unitText",
        itemValue: "unitId"
      },
      zoneId: {
        table: "zones",
        itemText: "zoneText",
        itemValue: "zoneId"
      }
    }
  }),
  methods: {
    restart() {
      this.$set(this.soldiers, "items", []);
      this.$set(this.soldiers, "found", false);
      this.$set(this.job, "done", 0);
      this.$set(this.job, "progress", 0);
      this.$set(this.job, "finished", false);
      this.$set(this.job, "started", false);
    },
    async startJob() {
      this.$set(this.job, "started", true);
      let items = this.soldiers.items,
        that = this,
        asyncedLoop = () => {
          return new Promise((success, failure) => {
            (async function loop() {
              for (let i = 0; i < items.length; i++) {
                let c = items[i],
                  errors = await that.fixDemobilizationDate(
                    c.militaryId,
                    true,
                    true
                  );
                if (errors && errors.length > 0) {
                  c.notes = errors;
                  that.$set(that.notes.items, that.notes.items.length, c);
                }
                that.$set(that.job, "done", i + 1);
                if (i == items.length - 1) {
                  that.$set(that.job, "finished", true);
                  success(true);
                }
              }
            })();
          });
        };
      await asyncedLoop();
    },
    findSoldiers() {
      this.$set(this.soldiers, "loading", true);
      let {
          unitId,
          zoneId,
          conscriptionDate_from,
          conscriptionDate_to
        } = this.search,
        where = {
          typeId: 1
        };
      if (unitId || unitId === 0) {
        where.unitId = unitId;
      }
      if (zoneId || zoneId === 0) {
        where.zoneId = zoneId;
      }
      if (conscriptionDate_from || conscriptionDate_to) {
        let key =
            conscriptionDate_from && conscriptionDate_to
              ? "$between"
              : conscriptionDate_from
              ? "$gte"
              : "$lte",
          value =
            conscriptionDate_from && conscriptionDate_to
              ? [conscriptionDate_from, conscriptionDate_to]
              : conscriptionDate_from
              ? conscriptionDate_from
              : conscriptionDate_to;
        where.conscriptionDate = {
          [key]: value
        };
      }
      this.api("global/get_all", {
        table: "conscriptes",
        where,
        attrs: ["militaryId", "fullName"]
      })
        .then(x => {
          this.$set(this.soldiers, "items", x.data);
          this.$set(this.soldiers, "found", true);
        })
        .catch(error => {
          console.log(error);
        })
        .finally(() => {
          this.$set(this.soldiers, "loading", false);
        });
    },
    init() {
      let selects = this.selects;
      Object.keys(selects).forEach(key => {
        let { table } = selects[key];
        if (table) {
          this.$set(this.selects[key], "loading", true);
          this.api("global/get_all", {
            table
          })
            .then(x => {
              this.$set(this.selects[key], "data", x.data);
            })
            .catch(error => {
              console.log("Error loading: " + table);
              console.log(error);
            })
            .finally(() => {
              this.$set(this.selects[key], "loading", false);
            });
        }
      });
    }
  }
};
</script>
