<template>
  <div>
    <v-card
      :loading="loading || local_loading"
      :disabled="loading || local_loading"
    >
      <v-card-title class="primary white--text">
        البيانات الأساسية
        <v-spacer></v-spacer>
        <v-btn
          v-text="'حفظ'"
          color="white"
          large
          light
          class="px-6"
          :disabled="!saveEnabled"
          @click="saveData"
        ></v-btn>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-row>
          <template v-for="(m, i) in data_fields">
            <!-- :xl="m.halfSize ? '3' : '3'" -->
            <v-col
              :key="i"
              cols="12"
              :sm="m.halfSize ? '3' : '6'"
              :md="m.halfSize ? '2' : '4'"
              xl="3"
            >
              <v-text-field
                v-if="m.type == 'text'"
                v-model="main_data[m.model]"
                filled
                :hint="m.hint"
                :persistent-hint="m.hint ? true : false"
                :hide-details="m.hint ? false : true"
                :label="m.label"
                :prepend-inner-icon="m.icon"
                :clearable="!m.readonly && !m.disabled"
                :readonly="m.readonly"
                :error-messages="m.error"
              ></v-text-field>
              <v-autocomplete
                v-else-if="m.type == 'select'"
                v-model="main_data[m.model]"
                filled
                :hint="m.hint"
                :persistent-hint="m.hint ? true : false"
                :hide-details="m.hint ? false : true"
                :label="m.label"
                @change="m.change ? runFun(m['change']) : false"
                :prepend-inner-icon="m.icon"
                :readonly="m.readonly"
                :items="selects[m.model].data"
                :error-messages="selects[m.model].error"
                :clearable="!m.readonly && !m.disabled"
                :loading="selects[m.model].loading"
                :disabled="selects[m.model].loading"
                :item-text="m.item_text"
                :item-value="m.item_value"
              ></v-autocomplete>
              <!-- ref="m.model" -->
              <v-text-field
                v-else-if="m.type == 'date' && !$store.state.appInfo.dateDialog"
                type="date"
                v-model="main_data[m.model]"
                :prepend-inner-icon="m.icon"
                :hint="m.hint"
                :persistent-hint="m.hint ? true : false"
                :hide-details="m.hint ? false : true"
                :label="m.label"
                :readonly="m.readonly"
                :clearable="!m.readonly && !m.disabled"
                :error-messages="m.error"
                filled
              >
              </v-text-field>
              <v-dialog
                v-else-if="m.type == 'date' && $store.state.appInfo.dateDialog"
                :ref="m.model"
                v-model="m.model_dialog"
                :return-value.sync="main_data[m.model]"
                width="290px"
                persistent
                :disabled="m.readonly"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="main_data[m.model]"
                    :prepend-inner-icon="m.icon"
                    :hint="m.hint"
                    :persistent-hint="m.hint ? true : false"
                    :hide-details="m.hint ? false : true"
                    :label="m.label"
                    :readonly="m.readonly"
                    :clearable="!m.readonly && !m.disabled"
                    :error-messages="m.error"
                    filled
                    v-on="on"
                  >
                  </v-text-field>
                </template>
                <v-date-picker
                  :ref="`${m.model}_picker`"
                  v-model="main_data[m.model]"
                  scrollable
                  color="primary"
                >
                  <v-spacer></v-spacer>
                  <v-btn
                    color="primary"
                    outlined
                    class="px-6 text-capitalize"
                    @click="m.model_dialog = false"
                    >إلغاء</v-btn
                  >
                  <v-btn
                    color="primary"
                    class="px-6 text-capitalize"
                    @click="$refs[m.model][0].save(main_data[m.model])"
                    >حفظ</v-btn
                  >
                </v-date-picker>
              </v-dialog>
            </v-col>
          </template>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "enhaa-ended-duty-main-data",
  props: {
    main_data: {
      type: Object,
      default: () => ({})
    },
    loading: {
      type: Boolean,
      default: false
    },
    saveEnabled: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    this.init();
  },
  data: () => ({
    local_loading: false,
    defaults: {},
    data_fields: [
      {
        type: "text",
        label: "الرقم العسكري",
        model: "militaryId",
        readonly: true
      },
      {
        type: "text",
        label: "الإسم",
        model: "fullName",
        readonly: true
      },
      {
        type: "date",
        label: "تاريخ التجنيد",
        model: "conscriptionDate",
        model_dialog: false,
        readonly: true
      },
      {
        type: "select",
        label: "الدرجة",
        model: "degreeId",
        item_text: "degreeType",
        item_value: "degreeId",
        readonly: true
      },
      {
        type: "select",
        label: "السلاح",
        model: "forceId",
        item_text: "name",
        item_value: "forceId",
        readonly: true
      },
      {
        type: "select",
        label: "الوحدة",
        model: "unitId",
        item_text: "unitText",
        item_value: "unitId",
        readonly: true
      },
      {
        type: "select",
        label: "الحالة الإجتماعية",
        model: "martialStateId",
        item_text: "state",
        item_value: "martialStateId",
        readonly: true
      },
      {
        type: "text",
        label: "العنوان المدني",
        model: "address",
        readonly: true
      },

      {
        type: "select",
        label: "حالة الفرد",
        model: "stateIdCurrent",
        item_text: "text",
        item_value: "stateId"
      },

      {
        type: "select",
        label: "سبب الإنهاء",
        model: "stateId",
        item_text: "text",
        item_value: "stateId",
        change: "dutyStateChanged"
      },
      {
        type: "date",
        label: "تاريخ التسريح",
        model: "demobilizationDate",
        model_dialog: false,
        readonly: true
      },
      {
        type: "date",
        label: "تاريخ الإنهاء",
        model: "endingDutyDate",
        model_dialog: false
      }
    ],
    selects: {
      degreeId: {
        table: "degrees",
        attrs: ["degreeId", "degreeType"]
      },
      martialStateId: {
        table: "martialStates",
        attrs: ["martialStateId", "state"]
      },
      forceId: {
        table: "forces",
        attrs: ["forceId", "name"]
      },
      unitId: {
        table: "units",
        attrs: ["unitId", "unitText"]
      },
      zoneId: {
        table: "zones",
        attrs: ["zoneId", "zoneText"]
      },
      stateId: {
        table: "dutyStates",
        attrs: ["stateId", "text"]
      },
      stateIdCurrent: {
        table: "dutyCurrentStates",
        attrs: ["stateId", "text"]
      }
    }
  }),
  watch: {
    // "main_data.endingDutyDate"(v) {
    //   console.log("endingDutyDate changed");
    //   this.$emit("updateEndDate", v);
    // }
  },
  methods: {
    saveData() {
      this.$set(this, "local_loading", true);
      let main_data = { ...this.main_data };
      this.originalDates(
        [main_data],
        ["conscriptionDate", "demobilizationDate", "endingDutyDate"]
      )[0];
      console.log("Main Data");
      console.log(main_data);
      this.api("global/update_one", {
        table: "conscriptes",
        where: {
          militaryId: main_data.militaryId
        },
        update: main_data
      })
        .then(x => {
          console.log(x);
          this.showSuccess("تم تحديث بيانات المنتهي خدمته الأساسية.");
          this.$emit("saveEndedData");
        })
        .catch(error => {
          console.log(error);
          this.showError("حدث خطأ أثناء تحديث بيانات المنتهي خدمته الأساسية.");
        })
        .finally(() => {
          this.$set(this, "local_loading", false);
        });
    },
    init() {
      // Get selects
      Object.keys(this.selects).forEach(key => {
        let { table, attrs } = this.selects[key];
        this.$set(this.selects[key], "loading", true);
        this.api("global/get_all", {
          table,
          attrs
        })
          .then(x => {
            this.$set(this.selects[key], "data", x.data);
          })
          .catch(error => {
            console.log(error);
            this.$set(
              this.selects[key],
              "error",
              "حدث خطأ أثناء استدعاء الداتا من قاعدة البيانات"
            );
          })
          .finally(() => {
            this.$set(this.selects[key], "loading", false);
          });
      });
    },
    runFun(name) {
      this[name]();
    },
    dutyStateChanged() {
      let v = this.main_data.stateId;
      /**
       * if it's not one of these
       * 101 => بالخدمة
       * 102 => غياب وشطب من القوة
       * 153 => دراسة سوء السلوك الجوازى
       * 155 => دراسة سوء السلوك الوجوبى
       */
      if (![101, 102, 103, 153, 155, null].includes(v)) {
        this.main_data.stateIdCurrent = 2;
      }
    }
  }
};
</script>
