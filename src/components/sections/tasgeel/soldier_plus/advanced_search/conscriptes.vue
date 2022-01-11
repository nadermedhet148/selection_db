<template>
  <div>
    <v-card class="mb-6">
      <v-card-title>
        البحث المتقدم عن الراتب العالي والمجندين
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
              <v-col cols="6" :lg="option.type == 'date' ? '6' : '3'" :key="i">
                <v-checkbox
                  v-if="option.type == 'checkbox'"
                  :label="option.label"
                  v-model="search[option.model]"
                ></v-checkbox>

                <v-text-field
                  v-if="!option.type || option.type == 'text'"
                  :persistent-hint="option.hint ? true : false"
                  :hide-details="option.hint ? false : true"
                  :hint="option.hint"
                  filled
                  v-model="search[option.model]"
                  :label="option.label"
                  @keypress.enter="searchConscriptes"
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
                  @keypress.enter="searchConscriptes"
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
                <v-row class="py-0 my-0" v-else-if="option.type == 'date'">
                  <template v-for="x in ['from', 'to']">
                    <v-col
                      v-if="search[option.model]"
                      cols="6"
                      class="py-0 my-0"
                      :key="x"
                    >
                      <v-text-field
                        v-model="search[option.model][x]"
                        :prepend-inner-icon="option.icon"
                        :hint="option.hint"
                        :persistent-hint="option.hint ? true : false"
                        :hide-details="option.hint ? false : true"
                        :label="
                          `${option.label} ( ${x == 'from' ? 'من' : 'الى'} )`
                        "
                        :error-messages="option.error"
                        filled
                        :clearable="
                          option.range
                            ? false
                            : !option.readonly && !option.disabled
                        "
                        type="date"
                      >
                      </v-text-field>
                    </v-col>
                  </template>
                </v-row>
              </v-col>
            </template>
          </v-row>
        </v-card-text>
      </v-card>
    </template>
    <!-- <v-card class="mb-6">
      <v-card-actions class="px-4"> -->
    <v-btn
      style="position: fixed; top: 10px; left: 400px; z-index: 999"
      class="px-4"
      large
      color="primary"
      @click="searchConscriptes"
    >
      <v-icon class="me-3">mdi-magnify</v-icon>
      بحث
    </v-btn>
    <!-- </v-card-actions>
    </v-card> -->
    <v-card class="mb-6">
      <v-card-title class="sidenav white--text">
        النتائج
        <v-spacer></v-spacer>
        <printer-menu
          :disabled="result.items.length == 0"
          :query="`tasgeel/search/conscriptes`"
          :data="result.printer"
          :fab="false"
          dark
        ></printer-menu>
      </v-card-title>
      <v-divider></v-divider>
      <v-text-field
        prepend-inner-icon="mdi-magnify"
        v-model.lazy="result.search"
        filled
        dense
      ></v-text-field>
      <v-data-table
        :items="result.items"
        :headers="result.headers"
        fixed-header
        :search.sync="result.search"
        v-model="result.selected"
        multi-sort
        hide-default-header
        @current-items="tableUpdated"
        ref="mainTable"
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
        <template v-slot:item.dutyCurrentState="{ item }">
          <v-chip
            v-if="item.dutyCurrentState && item.dutyCurrentState.text"
            small
            :color="
              item.dutyCurrentState.text == 'بالخدمة' ? 'success' : 'error'
            "
          >
            {{ item.dutyCurrentState.text }}
          </v-chip>
        </template>
        <template v-slot:item.isPartInMilitaryOperation="{ item }">
          <v-icon
            v-if="!item.isPartInMilitaryOperation"
            :color="item.isPartInMilitaryOperation ? 'blue' : 'error'"
          >
            {{
              item.isPartInMilitaryOperation ? "mdi-check" : "mdi-close"
            }}</v-icon
          >
          <template v-for="(ele, i) in item.militaryOperationParticipants">
            <v-chip v-bind:key="i" color="green">
              {{ ele.militaryOperation.name }}
            </v-chip>
          </template>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "conscriptes",
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
    result: {
      printer: {},
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
          value: "degree.degreeType",
          dbvalue: "degreeId",
          text: "الدرجة",
          sortable: true
        },
        {
          value: "fullName",
          text: "الإسم",
          sortable: true
        },
        {
          value: "unit.unitText",
          dbvalue: "unitId",
          text: "الوحدة",
          sortable: true
        },
        {
          value: "dutyCurrentState",
          dbvalue: "stateIdCurrent",
          text: "حالة الفرد",
          sortable: true
        },
        {
          value: "group.groupName",
          dbvalue: "groupId",
          text: "الفئة",
          sortable: true
        },
        {
          value: "conscriptionDate",
          text: "تاريخ التجنيد / التطوع",
          sortable: true
        },
        {
          value: "demobilizationDate",
          text: "تاريخ التسريح",
          sortable: true
        },
        {
          value: "isPartInMilitaryOperation",
          dbvalue: "isPartInMilitaryOperation",
          text: "عمليات حربيه",
          sortable: true
        }
      ]
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
            model: "fullName",
            type: "text",
            hint: ""
          },
          {
            label: "الرقم الثلاثي",
            model: "tripartiteNumber",
            type: "text",
            hint: ""
          },
          {
            label: "المؤهل",
            model: "qualificationId",
            type: "select",
            hint: ""
          },
          {
            label: "منطقة التجنيد",
            model: "areaId",
            type: "select",
            hint: ""
          },
          {
            label: "الرقم القومي",
            model: "nationalId",
            type: "text",
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
            label: "الجيش / المنطقة",
            model: "zoneId",
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
            label: "التخفيض",
            model: "reductionStateId",
            type: "select",
            hint: ""
          },
          {
            label: "المرحلة التجنيدية",
            model: "periodId",
            type: "select",
            hint: ""
          },
          {
            label: "شارك في العمليات الحربيه",
            model: "isPartInMilitaryOperation",
            type: "checkbox",
            hint: ""
          },
          {
            label: "ادراج من هم خارج السلاح",
            model: "getWhoNotRelatedWithSelah",
            type: "checkbox",
            hint: ""
          }
        ]
      },
      {
        title: "بيان وموقف الخدمة",
        options: [
          {
            label: "نوع الخدمة",
            model: "typeId",
            type: "select",
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
            label: "تاريخ إنهاء الخدمة",
            model: "endingDutyDate",
            type: "date",
            range: true,
            hint: ""
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
            label: "تاريخ التسريح",
            model: "demobilizationDate",
            models: ["demobilizationDate", "webDemobilizationDate"],
            type: "date",
            range: true,
            hint: ""
          }
        ]
      },
      {
        title: "بيانات شخصية",
        options: [
          {
            label: "مجموعات المؤهلات المدنية",
            model: "webCivilQualificationGroupId",
            type: "select",
            hint: ""
          },
          {
            label: "المؤهل المدني",
            model: "webCivilQualificationId",
            type: "select",
            hint: ""
          },
          {
            label: "المحافطة",
            model: "governorateId",
            type: "select",
            hint: ""
          },
          {
            label: "رقم التليفون",
            model: "phone",
            type: "text",
            hint: ""
          },
          {
            label: "تاريخ الميلاد",
            model: "birthDate",
            type: "date",
            range: true,
            hint: ""
          }
        ]
      },
      {
        title: "بيانات خاصة بالأميين",
        options: [
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
          },
          {
            label: "المؤيد",
            model: "ignorantSupporterId",
            type: "select",
            hint: ""
          }
        ]
      },
      {
        title: "بيانات خاصة بضباط الصف",
        options: [
          {
            label: "تاريخ صرف الراتب العالي",
            model: "highSalaryPayingOutDate",
            type: "date",
            range: true,
            hint: ""
          },
          {
            label: "تاريخ الترقي للدرجة الحالية",
            model: "currentPromotionDate",
            type: "date",
            range: true,
            hint: ""
          },
          {
            label: "تاريخ الضم على الوحدة",
            model: "currentUnitJoiningDate",
            type: "date",
            range: true,
            hint: ""
          },
          {
            label: "رقم الأقدمية",
            model: "oldNumber",
            type: "number",
            hint: ""
          },
          {
            label: "التخصص / الوظيفة",
            model: "specialization",
            type: "select",
            hint: ""
          }
        ]
      }
    ],
    selects: {
      // Web Selects
      webCivilQualificationGroupId: {
        table: "webCivilQualificationGroups",
        value: "id",
        text: "displayedText"
      },
      webCivilQualificationId: {
        table: "webCivilQualifications",
        value: "id",
        text: "displayedText"
      },
      // Normal Selects
      governorateId: {
        table: "governorates",
        value: "id",
        text: "displayedText"
      },
      areaId: {
        table: "mobilizationAreas",
        value: "areaId",
        text: "name"
      },
      unitId: {
        table: "units",
        value: "unitId",
        text: "unitText"
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
      reductionStateId: {
        table: "reductionStates",
        value: "reductionStateId",
        text: "state"
      },
      periodId: {
        table: "periods",
        value: "id",
        text: "periodText"
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
      qualificationId: {
        table: "qualifications",
        text: "name",
        value: "qualificationId"
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
      typeId: {
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
      },
      specialization: {
        localTable: "specializations",
        value: "id",
        text: "displayedText"
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
    tableUpdated(v) {
      let tables = this.$refs.mainTable;
      if (tables) {
        tables = Array.isArray(tables) ? tables : [tables];
        for (let i = 0; i < tables.length; i++) {
          let table = tables[i],
            childTable = table?.$children[0].$children[0].$children[0]?.table,
            filteredItems,
            sorted;

          // when first table exists
          if ("filteredItems" in table?.$children[0]) {
            filteredItems = table.$children[0].filteredItems;
            sorted = filteredItems;
            // when the second table exists
            if (childTable) {
              let sortBy = childTable.props.options.sortBy, // -_-
                sortDesc = childTable.props.options.sortDesc; // -_-
              sorted = table.customSort(filteredItems, sortBy, sortDesc);
            }
            this.result.printer.cons = sorted;
          }
        }
      }
    },
    searchConscriptes() {
      this.$set(this.result, "loading", true);

      let search = this.search;
      this.api("sections/tasgeel/search/conscriptes", {
        search: { ...search, getWhoNotRelatedWithSelah: null }
      })
        .then(x => {
          let cons = this.search["getWhoNotRelatedWithSelah"]
            ? x.data
            : x.data.filter(f => this.isHodod(f));
          let fixedData = this.fixDates(cons, [
              "demobilizationDate",
              "conscriptionDate",
              "webConscriptionDate",
              "webDemobilizationDate"
            ]),
            printer = {
              cons: [...fixedData],
              excelKey: "cons",
              excelHeaders: this.result.headers
            };
          this.$set(this.result, "items", fixedData);
          console.log("data", this.result.items);
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
      let options_arr = this.cards.map(c => c.options),
        options = [];
      options_arr.forEach(arr => {
        options = [...options, ...arr];
      });
      options.forEach(option => {
        if (option.type == "date" || option.multiple) {
          this.$set(this.search, option.model, {});
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
    },
    goSearch(search) {
      if (
        !this.$route.fullPath.includes(
          "/soldiers_plus/advanced_search/conscriptes/" + JSON.stringify(search)
        )
      ) {
        this.goThere(
          "/soldiers_plus/advanced_search/conscriptes/" + JSON.stringify(search)
        );
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
