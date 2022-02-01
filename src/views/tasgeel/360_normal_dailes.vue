<template>
  <div>
    <v-card :loading="searchLoading" :disabled="searchLoading">
      <v-card-title>
        بحث متقدم في الفئات
        <v-spacer></v-spacer>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-row>
          <template v-for="(h, i) in mainTable.headers.filter(h => h.inSearch)">
            <v-col v-if="h.type !== 'date'" :key="i" cols="6" lg="4">
              <v-text-field
                v-if="!h.type || h.type == 'text'"
                filled
                :label="h.text"
                v-model="search[h.searchValue]"
                :hide-details="h.hint ? false : true"
                :persistent-hint="h.hint ? true : false"
                @keypress.enter="findItems()"
              ></v-text-field>
              <v-autocomplete
                v-else-if="h.type == 'select'"
                filled
                :multiple="h.multiple"
                :label="h.text"
                v-model="search[h.searchValue]"
                :hide-details="h.hint ? false : true"
                :persistent-hint="h.hint ? true : false"
                :items="
                  selects[h.searchValue] ? selects[h.searchValue].data : []
                "
                :item-value="
                  selects[h.searchValue]
                    ? selects[h.searchValue].value
                    : 'value'
                "
                :item-text="
                  selects[h.searchValue] ? selects[h.searchValue].text : 'text'
                "
              ></v-autocomplete>
              <v-textarea
                v-else-if="h.type == 'textarea'"
                filled
                :label="h.text"
                v-model="search[h.searchValue]"
                :hide-details="h.hint ? false : true"
                :persistent-hint="h.hint ? true : false"
                auto-grow
                rows="1"
              ></v-textarea>
              <v-btn-toggle
                v-else-if="h.type == 'checkbox'"
                v-model="search[h.searchValue]"
                class="d-block"
              >
                <v-btn
                  height="58"
                  width="50%"
                  :color="
                    search[h.searchValue] === true ? 'error white--text' : ''
                  "
                  :value="true"
                  v-text="h.trueValue"
                ></v-btn>
                <v-btn
                  height="58"
                  width="50%"
                  :color="
                    search[h.searchValue] === false ? 'success white--text' : ''
                  "
                  :value="false"
                  v-text="h.falseValue"
                ></v-btn>
              </v-btn-toggle>
            </v-col>
            <v-col
              class="py-0"
              cols="8"
              :key="i + '_date'"
              v-else-if="h.type == 'date'"
            >
              <v-row v-if="search[h.searchValue]">
                <v-col cols="6">
                  <v-text-field
                    filled
                    type="date"
                    :label="h.text + ' (من)'"
                    v-model="search[h.searchValue][0]"
                    :hide-details="h.hint ? false : true"
                    :persistent-hint="h.hint ? true : false"
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    filled
                    :label="h.text + ' (الى)'"
                    type="date"
                    v-model="search[h.searchValue][1]"
                    :hide-details="h.hint ? false : true"
                    :persistent-hint="h.hint ? true : false"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-col>
          </template>
        </v-row>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions class="px-4 py-4">
        <v-btn
          class="px-6"
          @click="findItems()"
          large
          color="primary"
          v-text="'بحث'"
        ></v-btn>
      </v-card-actions>
    </v-card>

    <v-card>
      <table-bulider
        :headers="mainTable.headers"
        :printer="mainTable.printer"
        :items="mainTable.items"
        :title="'نتائج اليومية عددية للفئات'"
      >
      </table-bulider>
    </v-card>
  </div>
</template>

<script>
const constants = require("../../Constant").default;
const lodash = require("lodash");
const displayTypes = {
  headquerts: 0,
  intelligence: 1,
  artillery: 2,
  unites: 3,
  directions: 4
};

const SoldierCategoryMap = [
  { text: "صف", mappedValue: "officer" },
  { text: "كاتب", mappedValue: "writer" },
  { text: "مهني ", mappedValue: "professional" },
  { text: "حرفي", mappedValue: "literal" },
  { text: "سائق عجل", mappedValue: "driver" }
];

const basicHeaders = [
  {
    text: "نوع العرض",
    value: "Type",
    searchValue: "Type",
    sortable: true,
    type: "select",
    inSearch: true,
    inTable: false,
    inModel: false,
    sort: 1
  },
  {
    text: "الوحدة",
    value: "Unit",
    searchValue: "unitIds",
    sortable: true,
    type: "select",
    inSearch: false,
    inTable: true,
    inModel: false,
    multiple: true,
    sort: 1
  },
  {
    text: "الاتجاه",
    value: "DirectionforFeaat",
    sortable: true,
    inTable: true,
    multiple: true,
    sort: 1
  },

  {
    text: "الاتجاه",
    value: "Direction",
    searchValue: "directions",
    sortable: true,
    type: "select",
    inSearch: false,
    inTable: false,
    inModel: false,
    multiple: true,
    sort: 1
  },
  {
    text: "الفئات",
    value: "SoldierCategories",
    searchValue: "SoldierCategories",
    sortable: true,
    type: "select",
    inSearch: true,
    inTable: false,
    inModel: false,
    multiple: true,
    sort: 1
  }
];
export default {
  name: "360NormaDailes",
  props: {},
  mounted() {
    this.init();
  },
  data: () => ({
    Effect: {},
    subjectLimit: 10,

    search: {
      SoldierCategories: constants.dailesSoliderCategories
    },
    searchLoading: false,
    mainTable: {
      headers: [...basicHeaders],
      items: [],
      printer: {}
    },

    componentName: "CategoriesDailes",
    selects: {
      directions: {
        text: "text",
        value: "text",
        data: constants.Direction.data
      },
      SoldierCategories: {
        text: "text",
        value: "text",
        data: constants.dailesSoliderCategories.map(text => ({
          text
        }))
      },
      unitIds: {
        table: "Unit",
        value: "UnitID",
        text: "Unit"
      },
      Type: {
        text: "text",
        value: "value",
        data: [
          {
            text: "لقيادات القطاعات",
            value: displayTypes.headquerts
          },
          {
            text: "لمكاتب مج مخ وأمن ح ح",
            value: displayTypes.intelligence
          },
          {
            text: "لوحدات محددة",
            value: displayTypes.unites
          },
          {
            text: "لتمركزات محددة",
            value: displayTypes.directions
          }
        ]
      }
    }
  }),
  watch: {
    "search.Type"(newValue) {
      this.search = {
        SoldierCategories: this.search.SoldierCategories,
        Type: newValue
      };
      const unitFeildIndex = this.mainTable.headers.findIndex(
          ele => ele.value == "Unit"
        ),
        directionFeildIndex = this.mainTable.headers.findIndex(
          ele => ele.value == "Direction"
        );
      this.mainTable.headers[unitFeildIndex].inSearch = false;
      this.mainTable.headers[directionFeildIndex].inSearch = false;

      if (newValue == displayTypes.unites)
        this.mainTable.headers[unitFeildIndex].inSearch = true;

      if (newValue == displayTypes.directions)
        this.mainTable.headers[directionFeildIndex].inSearch = true;
    }
  },
  methods: {
    async findItems() {
      this.buildHeaders();
      this.$set(this, "searchLoading", true);
      this.$set(this.mainTable, "items", []);

      try {
        const result = await this.api(
          "sections/tasgeel/reports/categories_dailes",
          {
            ...this.search
          }
        );
        this.$set(this.mainTable, "items", result.data);
        this.$set(this.mainTable, "printer", {
          data: this.mainTable.items,
          excelKey: "data",
          excelHeaders: this.mainTable.headers.filter(f => f.inTable)
        });
      } catch (e) {
        this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
      }

      this.$set(this, "searchLoading", false);
    },

    buildHeaders() {
      const categories = SoldierCategoryMap.filter(
        ele => this.search.SoldierCategories.indexOf(ele.text) > -1
      );
      let headers = [];
      categories.forEach(category => {
        headers = [
          ...headers,
          ...[
            {
              text: ` ${category.text} / المرتب`,
              value: `${category.mappedValue}.mortab`
            },
            {
              text: ` ${category.text} /السياسة `,
              value: `${category.mappedValue}.siasa`
            },
            category.mappedValue == "driver"
              ? {
                  text: `${category.text} /  سياسة الامداد`,
                  value: `${category.mappedValue}.totalSupport`
                }
              : null,
            category.mappedValue == "officer"
              ? {
                  text: `${category.text} /  اجمالي صف حدود`,
                  value: `${category.mappedValue}.totalHododCount`
                }
              : null,
            category.mappedValue == "officer"
              ? {
                  text: `${category.text} /  اجمالي صف ادارات`,
                  value: `${category.mappedValue}.totalSMSoliderCount`
                }
              : null,
            {
              text: `${category.text} / مجند`,
              value: `${category.mappedValue}.totalSoliderCount`
            },
            {
              text: ` ${category.text} / راتب عالي`,
              value: `${category.mappedValue}.rateb`
            }
          ]
        ]
          .filter(ele => ele)
          .map(ele => ({
            text: ele.text,
            value: ele.value,
            sortable: true,
            type: "select",
            inTable: true,
            sort: 1
          }));
      });
      this.$set(this.mainTable, "headers", [
        ...basicHeaders,
        ...headers,
        ...[
          {
            text: "اجمالي المرتب",
            value: "totals.totalMortab"
          },
          {
            text: "اجمالي السياسة",
            value: "totals.totalSiasa"
          },
          {
            text: "اجمالي  سياسة الامداد",
            value: "totals.totalImdad"
          },
          {
            text: "اجمالي الراتب العالي",
            value: "totals.totalRatab"
          },
          {
            text: "اجمالي المجندين",
            value: "totals.totalSolider"
          },
          {
            text: "اجمالي الجملة",
            value: "totals.totalSum"
          },
          {
            text: "نسبة / المرتب",
            value: "percentages.totalOverMortab"
          },
          {
            text: "نسبة / السياسة",
            value: "percentages.totalOverSiasa"
          },
          {
            text: "نسبة / الامداد",
            value: "percentages.totalOverImdad"
          }
        ].map(ele => ({
          text: ele.text,
          value: ele.value,
          sortable: true,
          type: "select",
          inTable: true,
          sort: 1
        }))
      ]);
    }
  }
};
</script>
