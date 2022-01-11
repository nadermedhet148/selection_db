<template>
  <div>
    <v-row>
      <v-col>
        <v-card class="mb-8">
          <v-card-title class="mb-1">
            استخراج صور الأفراد من قاعدة البيانات
          </v-card-title>
          <v-card-subtitle>
            تقوم هذه الصفحة بنسخ الصور من قاعدة البيانات الى وحدة تخزين خارجية
            ثم تحذف تلك الصور من قاعدة البيانات. الهدف من هذه العملية هو تقليل
            حجم قاعدة البيانات ليسهل أخذ Backup منها.
          </v-card-subtitle>
          <v-card-text>
            <v-alert type="info" prominent outlined>
              عند تحديد نطاق البحث, لن يدخل فيه إلا من له صورة مسجلة في قاعدة
              البيانات وليس كل من تنطبق عليه قيود البحث.
            </v-alert>
          </v-card-text>
        </v-card>
        <v-card class="mb-8" v-if="job.started">
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
        <v-card
          class="mb-8"
          v-else
          :loading="soldiers.loading"
          :disabled="soldiers.loading"
        >
          <v-card-title>
            من فضلك حدد نطاق البحث
            <v-spacer></v-spacer>
            <v-btn v-if="window > 0" icon @click="window = 0">
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-window v-model="window">
              <v-window-item>
                <v-list>
                  <v-list-item-group v-model="window">
                    <template v-for="(w, i) in windows">
                      <v-list-item :key="i" :value="w.value">
                        <v-list-item-content>
                          <v-list-item-title
                            v-text="w.title"
                          ></v-list-item-title>
                          <v-list-item-subtitle
                            v-text="w.desc"
                          ></v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </template>
                  </v-list-item-group>
                </v-list>
              </v-window-item>
              <v-window-item>
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
                        clearable
                        hide-details
                        v-else-if="f.type == 'select'"
                        :items="
                          selects && selects[f.value] && selects[f.value].data
                            ? selects[f.value].data
                            : []
                        "
                        :item-text="
                          selects &&
                          selects[f.value] &&
                          selects[f.value].itemText
                            ? selects[f.value].itemText
                            : 'text'
                        "
                        :item-value="
                          selects &&
                          selects[f.value] &&
                          selects[f.value].itemValue
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
              </v-window-item>
              <v-window-item>
                <v-row>
                  <v-col>
                    <v-autocomplete
                      item-text="text"
                      item-value="value"
                      return-object
                      :items="cardTables"
                      filled
                      v-model="search.table"
                      label="الجدول المطلوب"
                      hint="من فضلك حدد الجدول المراد استخراج الصور منه"
                      persistent-hint
                    ></v-autocomplete>
                  </v-col>
                </v-row>
              </v-window-item>
            </v-window>
          </v-card-text>
          <v-card-text v-if="soldiers.found">
            <v-alert prominent type="success">
              تم إيجاد {{ soldiers.items.length }}
              فرد في نطاق البحث
            </v-alert>
          </v-card-text>
          <v-card-actions class="px-4">
            <v-btn
              v-if="window == 2"
              color="primary"
              outlined
              large
              class="px-6"
              @click="findCards()"
            >
              تحميل الجدول
            </v-btn>
            <v-btn
              v-if="window == 1"
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
            <v-spacer></v-spacer>
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
  name: "ExtractImages",
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
    window: 0,
    windows: [
      {
        title: "منظومة المجندين والراتب العالي",
        desc: "استخراج الصور من قاعدة البيانات الرئيسية.",
        value: 1
      },
      {
        title: "منظومة البطاقات العلاجية",
        desc: "استخراج الصور من قاعدة بيانات البطاقات العلاجية.",
        value: 2
      }
    ],
    search: {},
    cardTables: [
      {
        text: "الأفراد بالخدمة",
        value: "conscriptes", // Done
        primaryKey: "nationalId"
      },
      {
        text: "البطاقات العلاجية بالخدمة",
        value: "treatmentCardRegistrationDivision", // Done
        primaryKey: "id"
      },
      {
        text: "أفراد العائلة للبطاقات بالخدمة",
        value: "treatmentExtraFamilyMembers", // Done
        primaryKey: "nationalId"
      },
      {
        text: "تجديد البطاقات العلاجية بالخدمة",
        value: "treatmentRenewalTrackingRegDiv", // Done
        primaryKey: "renewalTrackingId"
      },
      {
        text: "الأفراد بالمعاش",
        value: "conscriptesEndTrmenations", // Done
        primaryKey: "militaryId"
      },
      {
        text: "البطاقات العلاجية بالمعاش",
        value: "treatmentCardEndTrmnationRegDiv", // Done
        primaryKey: "id"
      },
      {
        text: "أفراد العائلة للبطاقات المعاش",
        value: "treatmentExtraFamilyMembersEndTerm", // Done
        primaryKey: "nationalId"
      },
      {
        text: "تجديد البطاقات العلاجية بالمعاش",
        value: "treatmentRenewalTrackingEndTermRegDiv",
        primaryKey: "renewalTrackingId"
      }
    ],
    tableFilters: {},
    job: {
      started: false,
      finished: false,
      done: 0,
      progress: 0
    },
    soldiers: {
      items: [],
      type: "soldiers",
      found: false,
      loading: false
    },
    notes: {
      headers: [
        {
          text: "المعرف",
          value: "identifier"
        },
        {
          text: "الواصف",
          value: "describer"
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
    startJob() {
      let type = this.soldiers.type;
      this.$set(this.job, "started", true);
      switch (type) {
        case "soldiers":
          this.extractSoldierImages();
          break;
        case "cards":
          this.extractCardImages();
          break;
      }
    },
    async extractCardImages() {
      let items = this.soldiers.items,
        table = this.search.table,
        that = this,
        asyncedLoop = () => {
          return new Promise((success, failure) => {
            (async function loop() {
              for (let i = 0; i < items.length; i++) {
                let c = items[i],
                  saveImage = await that.api(
                    "global/db-img-to-local",
                    {
                      item: c,
                      table
                    },
                    "tc"
                  );
                if (saveImage && saveImage.length > 0) {
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
    async extractSoldierImages() {
      let items = this.soldiers.items,
        that = this,
        asyncedLoop = () => {
          return new Promise((success, failure) => {
            (async function loop() {
              for (let i = 0; i < items.length; i++) {
                let c = items[i],
                  saveImage = await that.api("server/db-img-to-local", {
                    militaryId: c.militaryId
                  });
                if (saveImage && saveImage.length > 0) {
                  c.notes = errors;
                  c.identifier = c.militaryId;
                  c.describer = c.fullName;
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
      this.$set(this.soldiers, "type", "soldiers");
      let {
          unitId,
          zoneId,
          conscriptionDate_from,
          conscriptionDate_to
        } = this.search,
        where = {
          image: {
            $not: null
          }
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
    findCards() {
      this.$set(this.soldiers, "loading", true);
      this.$set(this.soldiers, "type", "cards");
      let table = this.search.table;
      this.api(
        "global/get_all",
        {
          table: table.value,
          where: {
            picture: {
              $not: null
            }
          },
          attrs: [table.primaryKey]
        },
        "tc"
      )
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
