<template>
  <div>
    <v-dialog
      scrollable
      max-width="1100"
      persistent
      v-model="model"
      :fullscreen="fullscreen"
    >
      <v-card :loading="loading" :disabled="loading">
        <v-card-title>
          {{
            $store.state.dbprocs.procedureType &&
            procedureTypes[$store.state.dbprocs.procedureType]
              ? procedureTypes[$store.state.dbprocs.procedureType]
              : "الإجراءات"
          }}
          <v-spacer></v-spacer>
          <v-btn icon @click="fullscreen = !fullscreen">
            <v-icon>
              mdi-window-{{ fullscreen ? "restore" : "maximize" }}
            </v-icon>
          </v-btn>
          <v-btn @click="$store.state.dbprocs.model = false" icon>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-subtitle></v-card-subtitle>
        <v-divider></v-divider>
        <v-card-text class="text-center">
          <v-row>
            <template v-for="(f, i) in fields">
              <v-col
                :cols="
                  fullscreen && f.colsFullscreen
                    ? f.colsFullscreen
                    : f.cols
                    ? f.cols
                    : 'auto'
                "
                :key="i"
              >
                <div v-text="f.label"></div>
              </v-col>
            </template>
          </v-row>
          <template v-for="(item, i) in items">
            <v-row :key="i">
              <template v-for="(f, ii) in fields">
                <v-col
                  :cols="
                    fullscreen && f.colsFullscreen
                      ? f.colsFullscreen
                      : f.cols
                      ? f.cols
                      : 'auto'
                  "
                  :key="ii"
                >
                  <v-text-field
                    v-if="
                      !f.type || ['text', 'date', 'number'].includes(f.type)
                    "
                    solo-inverted
                    hide-details
                    :type="f.type == 'date' ? 'date' : 'text'"
                    v-model.trim="item[f.value]"
                  ></v-text-field>
                  <v-textarea
                    v-else-if="f.type == 'textarea'"
                    solo-inverted
                    hide-details
                    auto-grow
                    rows="1"
                    :color="`${$vuetify.theme.dark ? 'black' : 'white'}`"
                    v-model.trim="item[f.value]"
                  ></v-textarea>
                  <v-checkbox
                    v-else-if="f.type == 'checkbox'"
                    solo-inverted
                    class="center-checkbox"
                    hide-details
                    label=""
                    v-model.trim="item[f.value]"
                  ></v-checkbox>
                </v-col>
              </template>
            </v-row>
          </template>
        </v-card-text>
        <v-card-actions class="px-4">
          <v-spacer></v-spacer>
          <v-btn
            large
            color="primary"
            outlined
            v-text="'رجوع'"
            class="px-6"
            @click="$store.state.dbprocs.model = false"
          ></v-btn>
          <v-btn
            large
            color="primary"
            v-text="'حفظ الإجراءات'"
            class="px-6"
            @click="saveProcs()"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "db-procedures",
  data: () => ({
    headers: {},
    items: [],
    selected: [],
    loading: false,
    fullscreen: false,
    situationTypes: {
      1: "accidentId",
      2: "injuryId",
      3: "courtId",
      4: "exemptionId"
    },
    procedureTypes: {
      1: "الإجراءات المتخذة للوحدة",
      2: "الإجراءات المتخذة لفرع السجلات",
      3: "التصديق على عرض لجنة طبية",
      4: "اخطار إدارة السجلات",
      5: "تمام التسجيل على الشبكة"
    },
    fields: [
      {
        label: "م",
        value: "sort",
        type: "number",
        cols: "1"
      },
      {
        label: "التاريخ",
        value: "procedureDate",
        type: "date",
        cols: "3",
        colsFullscreen: "2"
      },
      {
        label: "الإجراء المتخذ",
        value: "procedureText",
        type: "textarea",
        cols: "7",
        colsFullscreen: "8"
      },
      {
        label: "طباعة",
        value: "canPrint",
        type: "checkbox",
        cols: "1"
      }
    ]
  }),
  watch: {
    items: {
      handler(v) {
        let lastItem = v && v.length > 0 ? v[v.length - 1] : {};
        if (lastItem.procedureDate || lastItem.procedureText) {
          this.pushItem();
        }
      },
      deep: true
    },
    model(v) {
      if (v && v === true) {
        this.loadProcs();
      }
    }
  },
  mounted() {
    if (this.model === true) {
      this.loadProcs();
    }
  },
  methods: {
    pushItem() {
      let {
          situationId,
          situationType,
          procedureType
        } = this.$store.state.dbprocs,
        length = this.items.length,
        item = {
          [this.situationTypes[situationType]]: situationId,
          procedureType,
          sort: length + 1,
          procedureDate: null,
          procedureText: "",
          canPrint: null
        };
      this.$set(this.items, length, item);
    },
    pullItem(index) {
      this.items.splice(index, 1);
    },
    async loadProcs() {
      this.$set(this, "items", []);
      this.$set(this, "fullscreen", false);
      this.$set(this, "loading", true);
      let {
          situationId,
          situationType,
          procedureType
        } = this.$store.state.dbprocs,
        _situationType = this.situationTypes[situationType];
      let items = await this.api("global/get_all", {
        table: "procedures",
        where: {
          [_situationType]: situationId,
          procedureType: procedureType
        }
      });
      if (items && items.ok && items.data) {
        let data = this.fixDates(items.data, ["procedureDate"]);
        this.$set(this, "items", data);
        this.pushItem();
      } else {
        this.showError("حدث خطأ أثناء حفظ الإجراءات");
      }
      this.$set(this, "loading", false);
    },
    async saveProcs() {
      let items = [...this.items].filter(
        f => f.procedureDate || f.procedureText
      );
      this.$set(this, "loading", true);
      let {
          situationId,
          situationType,
          procedureType
        } = this.$store.state.dbprocs,
        _situationType = this.situationTypes[situationType];
      let deleteItems = await this.api("global/delete_all", {
        table: "procedures",
        where: {
          [_situationType]: situationId,
          procedureType: procedureType
        }
      });
      if (deleteItems && deleteItems.ok && deleteItems.data) {
        // let addItems = await this.addAllProcs(items);
        items.forEach(item => {
          delete item.procedureId;
        });
        let addItems = await this.api("global/create_bulk", {
          table: "procedures",
          where: items
        });
        if (addItems && addItems.ok && addItems.data) {
          this.showSuccess("تم حفظ الإجراءات");
        } else {
          this.showError("حدث خطأ أثناء حفظ الإجراءات");
        }
        this.$set(this, "loading", false);
      } else {
        this.$set(this, "loading", false);
        this.showError("حدث خطأ أثناء حفظ الإجراءات");
      }
    }
    // async addAllProcs(procs = []) {
    //   let that = this;
    //   return new Promise((successOuter, failureOuter) => {
    //     let counter = procs.length;
    //     (async function loop() {
    //       for (let i = 0; i < procs.length; i++) {
    //         let proc = procs[i];
    //         delete proc.procedureId;
    //         let promiseLoop = await new Promise((success, failure) => {
    //           this.api("global/create_one", {
    //             table: "procedures",
    //             where: proc
    //           });
    //         });
    //         promiseLoop = null;
    //       }
    //     })();
    //   });
    // }
  },
  computed: {
    model: {
      get() {
        let model = this.$store.state.dbprocs.model;
        return model;
      },
      set(v) {
        return v;
      }
    }
  }
};
</script>
