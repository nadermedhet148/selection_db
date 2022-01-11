<template>
  <div>
    <v-card :loading="result.loading" :disabled="result.loading">
      <v-card-title>
        الخيارات
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-row>
          <template v-for="(option, i) in options">
            <v-col cols="6" lg="4" xl="3" :key="i">
              <v-text-field
                v-if="!option.type || option.type == 'text'"
                :persistent-hint="option.hint ? true : false"
                :hide-details="option.hint ? false : true"
                :hint="option.hint"
                filled
                v-model="search[option.model]"
                :label="option.label"
                @keypress.enter="searchIgnorants"
              ></v-text-field>
              <v-autocomplete
                v-if="option.type == 'select'"
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
              <v-dialog
                v-else-if="option.type == 'date'"
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
                  >
                    إلغاء
                  </v-btn>
                  <v-btn
                    color="primary"
                    class="px-6 text-capitalize"
                    @click="$refs[option.model][0].save(search[option.model])"
                  >
                    حفظ
                  </v-btn>
                </v-date-picker>
              </v-dialog>
            </v-col>
          </template>
        </v-row>
      </v-card-text>
      <v-card-actions class="px-4">
        <v-btn class="px-4" large color="primary" @click="searchIgnorants">
          <v-icon class="me-3">mdi-magnify</v-icon>
          بحث
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-card class="mt-6" :disabled="result.items.length == 0">
      <v-card-title>
        النتائج
        <v-spacer></v-spacer>
        <printer-menu
          :disabled="result.items.length == 0"
          :data="result.printer"
          :fab="false"
        ></printer-menu>
        <!-- <v-menu transition="slide-y-transition">
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" icon>
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
        </v-menu> -->
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
        <template v-slot:item.fullName="{ item }">
          <v-chip
            color="transparent"
            :to="`/soldiers_plus/${item.militaryId}`"
            @click.right="copyText(item.fullName)"
          >
            {{ item.fullName }}
          </v-chip>
        </template>
        <!-- <template v-slot:item.ignorantSupporterId="{ item }">
          <div v-if="item.ignorantSupporterId">
            {{
              selects.ignorantSupporterId.data.filter(
                s => s.val == item.ignorantSupporterId
              ).length > 0
                ? selects.ignorantSupporterId.data.filter(
                    s => s.val == item.ignorantSupporterId
                  )[0].text
                : ""
            }}
          </div>
        </template> -->
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "ignorants",
  mounted() {
    this.fillKeys();
    this.init();
  },
  watch: {
    "search.zoneId"(v) {
      if (v || v === 0) {
        if (!this.selects_backups.unitId) {
          this.$set(this.selects_backups, "unitId", this.selects.unitId.data);
        }
        this.$set(
          this.selects.unitId,
          "data",
          this.selects_backups.unitId.filter(
            u => (u.zoneId || u.zoneId === 0) && u.zoneId == v
          )
        );
        if (
          this.selects.unitId.data.filter(u => u.unitId == this.search.unitId)
            .length == 0
        ) {
          this.$set(this.search, "unitId", null);
        }
      } else {
        this.$set(this.selects.unitId, "data", this.selects_backups.unitId);
      }
    }
  },
  data: () => ({
    componentName: "ignorants",
    tableFilters: {},
    result: {
      selected: [],
      search: "",
      items: [],
      printer: {},
      headers: [
        {
          value: "militaryId",
          text: "الرقم العسكري",
          sortable: true
        },
        {
          value: "fullName",
          text: "الإسم",
          sortable: true
        },
        {
          value: "unit.unitText",
          text: "الوحدة",
          sortable: true
        },
        {
          value: "dutyState.text",
          text: "الحالة",
          sortable: true
        },
        {
          value: "demobilizationDate",
          text: "تاريخ التسريح",
          sortable: true
        },
        {
          value: "ignorant.displayedText",
          text: "موقف محو الأمية",
          sortable: true
        },
        {
          value: "ignorantSupporter.displayedText",
          text: "المؤيد",
          sortable: true
        },
        {
          value: "failureSessionsCounter",
          text: "دورات التقصير",
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
      },
      {
        title: "طباعة يومية عددية",
        desc: "",
        action: "printerDailyNumbers"
      }
    ],
    search: {},
    dialogs: {},
    options: [
      {
        label: "الرقم العسكري",
        model: "militaryId",
        type: "text",
        hint: "",
        like: true
      },
      {
        label: "الإسم",
        model: "fullName",
        type: "text",
        hint: "",
        like: true
      },
      {
        label: "تاريخ التجنيد",
        model: "conscriptionDate",
        models: ["conscriptionDate", "webConscriptionDate"],
        type: "date",
        range: true,
        hint: ""
      },
      {
        label: "تاريخ التسريح المبدئي",
        model: "demobilizationDateStarter",
        models: ["demobilizationDateStarter"],
        type: "date",
        range: true,
        hint: ""
      },
      {
        label: "تاريخ التسريح النهائي",
        model: "demobilizationDate",
        models: ["demobilizationDate", "webDemobilizationDate"],
        type: "date",
        range: true,
        hint: ""
      },
      {
        label: "حالة الفرد",
        model: "stateIdCurrent",
        type: "select",
        hint: ""
      },
      {
        label: "سبب الإنهاء",
        model: "stateId",
        type: "select",
        hint: ""
      },
      {
        label: "الدرجة",
        model: "degreeId",
        type: "select",
        hint: ""
      },
      {
        label: "السنة الزيادة",
        model: "additionalYearStateId",
        type: "select",
        hint: ""
      },
      {
        label: "القطاع",
        model: "zoneId",
        type: "select",
        hint: ""
      },
      {
        label: "المؤيد",
        model: "ignorantSupporterId",
        type: "select",
        hint: ""
      },
      {
        label: "الفئة",
        model: "groupId",
        type: "select",
        hint: ""
      },
      {
        label: "السلاح",
        model: "forceId",
        type: "select",
        hint: ""
      },
      {
        label: "الوحدة",
        model: "unitId",
        type: "select",
        hint: ""
      },
      {
        label: "دورات التقصير",
        model: "failureSessions",
        type: "select",
        hint: ""
      },
      {
        label: "محو الأمية",
        model: "ignorantId",
        type: "select",
        hint: ""
      },
      {
        label: "جهة الإمداد",
        model: "sourceId",
        type: "select",
        hint: ""
      }
      // {
      //   label: "",
      //   type: "text",
      //   hint: ""
      // }
    ],
    selects_backups: {},
    selects: {
      unitId: {
        table: "units",
        value: "unitId",
        text: "unitText"
      },
      stateIdCurrent: {
        table: "dutyCurrentStates",
        text: "text",
        value: "stateId"
      },
      stateId: {
        table: "dutyStates",
        text: "text",
        value: "stateId"
      },
      zoneId: {
        table: "zones",
        value: "zoneId",
        text: "zoneText"
      },
      additionalYearStateId: {
        table: "additionalYears",
        value: "additionalYearStateId",
        text: "state"
      },
      degreeId: {
        table: "degrees",
        value: "degreeId",
        text: "degreeType"
      },
      sourceId: {
        table: "suplySources",
        value: "sourceId",
        text: "sourceName"
      },
      ignorantId: {
        table: "ignorants",
        value: "id",
        text: "displayedText"
      },
      forceId: {
        table: "forces",
        value: "forceId",
        text: "name"
      },
      groupId: {
        table: "groups",
        value: "groupId",
        text: "groupName"
      },
      ignorantSupporterId: {
        value: "id",
        text: "displayedText",
        table: "ignorantSupporters"
      },
      failureSessions: {
        data: [
          {
            val: 0,
            text: "عرض من ليس له دورات"
          },
          {
            val: 1,
            text: "له دورة واحدة"
          },
          {
            val: 2,
            text: "له دورتان"
          },
          {
            val: 3,
            text: "له ثلاث دورات"
          },
          {
            val: 4,
            text: "عرض كل من له دورات"
          }
        ],
        value: "val",
        text: "text"
      }
    }
  }),
  methods: {
    searchIgnorants() {
      this.$set(this.result, "loading", true);
      let search = this.search;
      console.log("====================================");
      console.log("search : this.search ..", this.search);
      console.log("====================================");
      this.api("sections/tasgeel/ignorants/search", {
        search
      })
        .then(x => {
          console.log(x);
          // 2018905200160
          let items = this.fixDates(x.data, ["demobilizationDate"]),
            printer = {
              cons: [...items],
              excelKey: "cons",
              excelHeaders: this.result.headers
            };
          this.$set(this.result, "items", items);
          this.$set(this.result, "printer", printer);
          // this.goSearch(where);
        })
        .catch(error => {
          console.log(error);
        })
        .finally(() => {
          this.$set(this.result, "loading", false);
        });
    },
    fillKeys() {
      let options = this.options;
      options.forEach(option => {
        if (option.type == "date" || option.multiple) {
          this.$set(this.search, option.model, []);
        } else {
          this.$set(this.search, option.model, "");
        }
      });
    },
    init(custom) {
      // Get selects
      let iterators =
        custom && custom.length > 0
          ? Object.keys(this.selects).filter(f => f.model == custom)
          : Object.keys(this.selects);
      iterators.forEach(key => {
        let { table } = this.selects[key];
        if (table) {
          this.$set(this.selects[key], "loading", true);
          this.api("global/get_all", {
            table
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
        }
      });
    },
    goSearch(search) {
      // console.log(search);
      // console.log(JSON.stringify(search));
      if (
        !this.$route.fullPath.includes("/ignorants/" + JSON.stringify(search))
      ) {
        this.goThere("/ignorants/" + JSON.stringify(search));
      }
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
