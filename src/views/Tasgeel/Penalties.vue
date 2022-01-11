<template>
  <div>
    <v-card class="mb-6">
      <v-card-title>
        البحث المتقدم عن العقوبات
      </v-card-title>
      <v-card-text>
        من فضلك قم بتحديد الخيارات التي تريدها من الأسفل, ثم اضغط على زر البحث
        الأزرق الموجود في أعلى يسار الصفحة. وستظهر لك النتائج في نهاية الصفحة
      </v-card-text>
    </v-card>
    <template v-for="(card, ii) in cards">
      <v-card
        :key="ii"
        class="mb-6"
        :loading="result.loading"
        :disabled="result.loading"
      >
        <v-card-title class="sidenav white--text">
          {{ card.title }}
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-row>
            <template v-for="(option, i) in card.options">
              <v-col cols="6" lg="4" xl="3" :key="i">
                <v-text-field
                  v-if="!option.type || option.type == 'text'"
                  :persistent-hint="option.hint ? true : false"
                  :hide-details="option.hint ? false : true"
                  :hint="option.hint"
                  filled
                  v-model="search[option.model]"
                  :label="option.label"
                  @keypress.enter="searchPenalties"
                ></v-text-field>
                <v-text-field
                  v-else-if="option.type == 'number'"
                  :persistent-hint="option.hint ? true : false"
                  :hide-details="option.hint ? false : true"
                  :hint="option.hint"
                  filled
                  v-mask="'##########'"
                  v-model.number="search[option.model]"
                  :label="option.label"
                  @keypress.enter="searchPenalties"
                ></v-text-field>
                <v-list class="ma-0 pa-0" v-else-if="option.type == 'checkbox'">
                  <v-list-item
                    :class="
                      `${
                        $vuetify.theme.dark ? 'grey darken-3' : 'grey lighten-4'
                      }`
                    "
                    :disabled="option.readonly"
                  >
                    <v-list-item-content>
                      <v-list-item-title
                        class=""
                        v-text="option.label"
                      ></v-list-item-title>
                      <v-list-item-subtitle
                        class=""
                        v-text="option.hint"
                      ></v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-action>
                      <v-btn-toggle v-model="search[option.model]">
                        <v-btn
                          value="yes"
                          :color="
                            search[option.model] == 'yes'
                              ? 'success white--text'
                              : ''
                          "
                          v-text="'نعم'"
                        ></v-btn>
                        <v-btn
                          value="no"
                          :color="
                            search[option.model] == 'no'
                              ? 'error white--text'
                              : ''
                          "
                          v-text="'لا'"
                        ></v-btn>
                      </v-btn-toggle>
                    </v-list-item-action>
                  </v-list-item>
                </v-list>
                <v-autocomplete
                  v-else-if="option.type == 'select'"
                  :label="option.label"
                  :hint="option.hint"
                  v-model="search[option.model]"
                  :items="selects[option.model].data"
                  :item-value="selects[option.model].value"
                  :item-text="selects[option.model].text"
                  filled
                  :error-messages="selects[option.model].error"
                  :append-icon="
                    selects[option.model].error
                      ? 'mdi-refresh'
                      : 'mdi-chevron-down'
                  "
                  @click:append="
                    selects[option.model].error ? init(option.model) : () => {}
                  "
                  :hide-details="option.hint ? false : true"
                  :persistent-hint="option.hint ? true : false"
                  :loading="selects[option.model].loading || option.loading"
                  clearable
                ></v-autocomplete>
                <v-text-field
                  v-model="search[option.model]"
                  :prepend-inner-icon="option.icon"
                  :hint="option.hint"
                  :persistent-hint="option.hint ? true : false"
                  :hide-details="option.hint ? false : true"
                  :label="option.label"
                  :error-messages="option.error"
                  filled
                  :clearable="
                    option.range ? false : !option.readonly && !option.disabled
                  "
                  :append-icon="
                    option.range &&
                    search[option.model] &&
                    search[option.model].length > 0 &&
                    !option.readonly &&
                    !option.disabled
                      ? 'mdi-close'
                      : ''
                  "
                  @click:append="
                    option.range ? (search[option.model] = []) : () => {}
                  "
                  type="date"
                  v-else-if="
                    option.type == 'date' && !$store.state.appInfo.dateDialog
                  "
                >
                </v-text-field>
                <v-dialog
                  v-else-if="
                    option.type == 'date' && $store.state.appInfo.dateDialog
                  "
                  :ref="`${option.model}`"
                  v-model="dialogs[option.model]"
                  :return-value.sync="search[option.model]"
                  width="300px"
                  :disabled="option.readonly"
                  persistent
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="search[option.model]"
                      :prepend-inner-icon="option.icon"
                      :hint="option.hint"
                      :persistent-hint="option.hint ? true : false"
                      :hide-details="option.hint ? false : true"
                      :label="option.label"
                      readonly
                      :error-messages="option.error"
                      filled
                      v-on="on"
                      :clearable="
                        option.range
                          ? false
                          : !option.readonly && !option.disabled
                      "
                      :append-icon="
                        option.range &&
                        search[option.model] &&
                        search[option.model].length > 0 &&
                        !option.readonly &&
                        !option.disabled
                          ? 'mdi-close'
                          : ''
                      "
                      @click:append="
                        option.range ? (search[option.model] = []) : () => {}
                      "
                    >
                    </v-text-field>
                  </template>
                  <v-date-picker
                    :ref="`${option.model}_picker`"
                    v-model="search[option.model]"
                    scrollable
                    color="primary"
                    :range="option.range"
                  >
                    <v-spacer></v-spacer>
                    <v-btn
                      color="primary"
                      outlined
                      class="px-6 text-capitalize"
                      @click="dialogs[option.model] = false"
                      >إلغاء</v-btn
                    >
                    <v-btn
                      color="primary"
                      class="px-6 text-capitalize"
                      @click="$refs[option.model][0].save(search[option.model])"
                      >حفظ</v-btn
                    >
                  </v-date-picker>
                </v-dialog>
              </v-col>
            </template>
          </v-row>
        </v-card-text>
      </v-card>
    </template>
    <v-btn
      style="position: fixed; top: 10px; left: 400px; z-index: 999"
      class="px-4"
      large
      color="primary"
      @click="searchPenalties"
    >
      <v-icon class="me-3">mdi-magnify</v-icon>
      بحث
    </v-btn>
    <v-card class="mb-6" :disabled="result.items.length == 0">
      <v-card-title class="sidenav white--text">
        النتائج
        <v-spacer></v-spacer>
        <v-menu transition="slide-y-transition">
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" icon dark>
              <v-icon>mdi-printer</v-icon>
            </v-btn>
          </template>
          <v-list min-width="200">
            <template v-for="(option, i) in printers">
              <v-list-item :key="i">
                <v-list-item-content>
                  <v-list-item-title v-text="option.title"></v-list-item-title>
                  <v-list-item-subtitle
                    v-text="option.desc"
                  ></v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-list>
        </v-menu>
      </v-card-title>
      <v-divider></v-divider>
      <!-- <v-text-field
        prepend-inner-icon="mdi-magnify"
        v-model.lazy="result.search"
        filled
        dense
      ></v-text-field> -->
      <v-data-table
        :items="result.items"
        :headers="result.headers"
        fixed-header
        :search.sync="result.search"
        v-model="result.selected"
        hide-default-header
        multi-sort
      >
        <template v-slot:header="table">
          <table-header-filters
            :items="result.items"
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
        <template v-slot:item.militaryId="{ item }">
          <v-chip
            color="transparent"
            :to="`/soldiers_plus/${item.militaryId}`"
            @click.right="copyText(item.militaryId)"
          >
            {{ item.militaryId }}
          </v-chip>
        </template>
        <template v-slot:item.conscripte.fullName="{ item }">
          <v-chip
            color="transparent"
            :to="`/soldiers_plus/${item.militaryId}`"
            @click.right="copyText(item.conscripte.fullName)"
          >
            {{ item.conscripte.fullName }}
          </v-chip>
        </template>
        <template v-slot:item.isFollowed="{ item }">
          <v-chip small :color="item.isFollowed ? 'error' : 'success'">
            {{ item.isFollowed ? "نعم" : "لا" }}
          </v-chip>
        </template>
        <template v-slot:item.courtConfermation="{ item }">
          <v-chip :color="courtConfermationColors[item.courtConfermation]">
            {{
              selects.courtConfermation.data &&
              selects.courtConfermation.data.find(
                c => c.id == item.courtConfermation
              )
                ? selects.courtConfermation.data.find(
                    c => c.id == item.courtConfermation
                  ).displayedText
                : "ليس له حكم"
            }}
          </v-chip>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "Penalties",
  mounted() {
    this.fillKeys();
    this.init();
  },
  watch: {
    "search.stateIdCurrent"(v) {
      if (v) {
        if (!this.fullDatas.stateId) {
          this.$set(this.fullDatas, "stateId", this.selects.stateId.data);
        }
        if (v == 1) {
          this.$set(
            this.selects.stateId,
            "data",
            this.fullDatas.stateId.filter(w => w.stateId == 101)
          );
          if (this.search.stateId !== 101) {
            this.$set(this.search, "stateId", null);
          }
        } else {
          this.$set(
            this.selects.stateId,
            "data",
            this.fullDatas.stateId.filter(w => w.stateId !== 101)
          );
          if (this.search.stateId == 101) {
            this.$set(this.search, "stateId", null);
          }
        }
      } else {
        this.$set(this.selects.stateId, "data", this.fullDatas.stateId);
      }
    },
    "search.webCivilQualificationGroupId"(v) {
      if (v) {
        if (!this.fullDatas.webCivilQualificationId) {
          this.$set(
            this.fullDatas,
            "webCivilQualificationId",
            this.selects.webCivilQualificationId.data
          );
        }
        this.$set(
          this.selects.webCivilQualificationId,
          "data",
          this.fullDatas.webCivilQualificationId.filter(w => w.groupId == v)
        );
      } else {
        this.$set(
          this.selects.webCivilQualificationId,
          "data",
          this.fullDatas.webCivilQualificationId
        );
      }
    }
  },
  data: () => ({
    componentName: "soldiers_plus",
    tableFilters: {},
    fullDatas: {},
    courtConfermationColors: {
      "1": "error",
      "2": "orange white--text",
      "4": "success",
      "6": "yellow black--text"
    },
    result: {
      selected: [],
      search: "",
      items: [],
      headers: [
        {
          value: "militaryId",
          text: "الرقم العسكري",
          sortable: true
        },
        {
          value: "conscripte.degree.degreeType",
          text: "الدرجة",
          sortable: true
        },
        {
          value: "conscripte.fullName",
          text: "الإسم",
          sortable: true
        },
        {
          value: "conscripte.unit.unitText",
          text: "الوحدة",
          sortable: true
        },
        // {
        //   value: "conscripte.zone.zoneText",
        //   text: "المنطقة",
        //   sortable: true
        // },
        {
          value: "penaltyText",
          text: "الجريمة",
          sortable: true
        },
        {
          value: "crimeStartDate",
          text: "بداية الجريمة",
          sortable: true
        },
        {
          value: "crimeEndDate",
          text: "نهاية الجريمة",
          sortable: true
        },
        {
          value: "penaltyType.displayText",
          text: "نوع العقوبة",
          sortable: true
        },
        {
          value: "penaltyStartDate",
          text: "بداية العقوبة",
          sortable: true
        },
        {
          value: "penaltyEndDate",
          text: "نهاية العقوبة",
          sortable: true
        },
        {
          value: "penaltyTotalTime",
          text: "مدة العقوبة",
          sortable: true
        }
      ],
      search: ""
    },
    printers: [
      {
        title: "طباعة النتائج Word",
        desc: "",
        action: "printerWord"
      },
      {
        title: "طباعة النتائج Excel",
        desc: "",
        action: "printerExcel"
      }
    ],
    search: {},
    dialogs: {},
    cards: [
      {
        title: "بيانات تجنيدية",
        options: [
          {
            label: "الرقم العسكري",
            model: "militaryId",
            type: "text",
            hint: ""
          },
          {
            label: "الإسم",
            model: "conscripte.fullName",
            type: "text",
            hint: ""
          },
          {
            label: "الجيش / المنطقة",
            model: "conscripte.zoneId",
            type: "select",
            hint: ""
          },
          {
            label: "السلاح",
            model: "conscripte.forceId",
            type: "select",
            hint: ""
          },
          {
            label: "الوحدة",
            model: "conscripte.unitId",
            type: "select",
            hint: ""
          }
        ]
      },
      {
        title: "بيان وموقف الخدمة",
        options: [
          {
            label: "نوع الخدمة",
            model: "conscripte.typeId",
            type: "select",
            hint: ""
          },
          {
            label: "حالة الفرد",
            model: "conscripte.stateIdCurrent",
            type: "select",
            hint: ""
          },
          {
            label: "تاريخ التجنيد",
            model: "conscripte.conscriptionDate",
            models: ["conscriptionDate", "webConscriptionDate"],
            type: "date",
            range: true,
            hint: ""
          },
          {
            label: "تاريخ التسريح",
            model: "conscripte.demobilizationDate",
            models: ["demobilizationDate", "webDemobilizationDate"],
            type: "date",
            range: true,
            hint: ""
          }
        ]
      },
      {
        title: "بيانات العقوبة",
        options: [
          {
            label: "الجريمة",
            model: "penaltyText",
            type: "text",
            hint: ""
          },
          {
            label: "بداية الجريمة",
            model: "crimeStartDate",
            type: "date",
            range: true,
            hint: ""
          },
          {
            label: "نهاية الجريمة",
            model: "crimeEndDate",
            type: "date",
            range: true,
            hint: ""
          },
          {
            label: "بداية العقوبة",
            model: "penaltyStartDate",
            type: "date",
            range: true,
            hint: ""
          },
          {
            label: "نهاية العقوبة",
            model: "penaltyEndDate",
            type: "date",
            range: true,
            hint: ""
          },
          {
            label: "نوع العقوبة",
            model: "penaltyTypeId",
            type: "select",
            hint: ""
          }
        ]
      }
    ],
    selects: {
      "conscripte.unitId": {
        table: "units",
        value: "unitId",
        text: "unitText"
      },
      "conscripte.zoneId": {
        table: "zones",
        value: "zoneId",
        text: "zoneText"
      },
      penaltyTypeId: {
        table: "penaltyTypes",
        value: "id",
        text: "displayText"
      },
      "conscripte.forceId": {
        table: "forces",
        value: "forceId",
        text: "name"
      },
      "conscripte.stateIdCurrent": {
        table: "dutyCurrentStates",
        text: "text",
        value: "stateId"
      },
      "conscripte.typeId": {
        text: "dutyTypeText",
        value: "dutyTypeId",
        data: [
          {
            dutyTypeText: "جندي",
            dutyTypeId: "1"
          },
          {
            dutyTypeText: "راتب عالي",
            dutyTypeId: "2"
          }
        ]
      }
    }
  }),
  methods: {
    searchPenalties() {
      this.$set(this.result, "loading", true);
      let search = this.search;
      this.api("sections/tasgeel/search/penalties", {
        search
      })
        .then(x => {
          console.log(x);
          this.$set(
            this.result,
            "items",
            this.fixDates(x.data, [
              "crimeStartDate",
              "crimeEndDate",
              "penaltyStartDate",
              "penaltyEndDate"
            ])
          );
        })
        .catch(error => {
          console.log(error);
        })
        .finally(() => {
          this.$set(this.result, "loading", false);
        });
    },
    fillKeys() {
      let options_arr = this.cards.map(c => c.options),
        options = [];
      options_arr.forEach(arr => {
        options = [...options, ...arr];
      });
      options.forEach(option => {
        if (option.type == "date" || option.multiple) {
          this.$set(this.search, option.model, []);
        } else {
          this.$set(this.search, option.model, "");
        }
      });
    },
    init(specificTable = "") {
      // Get selects
      Object.keys(this.selects).forEach(key => {
        let { table, localTable, attrs } = this.selects[key];
        if (table) {
          let obj = {
            table
          };
          if (attrs && attrs.length > 0) {
            obj.attrs = attrs;
          }
          this.$set(this.selects[key], "loading", true);
          this.api("global/get_all", obj)
            .then(x => {
              this.$set(
                this.selects[key],
                "data",
                x.data.sort(
                  (a, b) =>
                    a[this.selects[key].value] - b[this.selects[key].value]
                )
              );
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
        } else if (localTable) {
          this.$set(this.selects[key], "loading", true);
          let data = this.localTable(localTable);
          this.$set(
            this.selects[key],
            "data",
            data.sort(
              (a, b) => a[this.selects[key].value] - b[this.selects[key].value]
            )
          );
          this.$set(this.selects[key], "loading", false);
        }
      });
    }
  },
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
  }
};
</script>
