<template>
  <div>
    <v-card :loading="searchLoading" :disabled="searchLoading">
      <v-card-title>
        بحث متقدم
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
              >
                <template
                  v-if="
                    search[h.searchValue] && search[h.searchValue].length > 10
                  "
                  v-slot:selection="{ item, index }"
                >
                  <v-chip v-if="index === 0">
                    <span>{{ item.text }}</span>
                  </v-chip>
                  <span v-if="index === 1" class="grey--text text-caption">
                    (+{{ search[h.searchValue].length - 1 }} اخري)
                  </span>
                </template>
              </v-autocomplete>
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
        :title="'نتائج اليومية'"
      >
      </table-bulider>
    </v-card>
  </div>
</template>

<script>
const constants = require("../../Constant").default;
const types = require("../../server-sequelize/reciever/af/sections/tasgeel/reports/types")
  .default;

const lodash = require("lodash");
const displayTypes = types.displayTypes;

const SoldierCategoryMap = types.SoldierCategoryMap;

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
    text: "الاسلحة",
    value: "weapon",
    searchValue: "weapon",
    sortable: true,
    type: "select",
    inSearch: true,
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
  ...lodash
    .flattenDeep(
      [
        { text: "سياسة", mappedValue: "siasa" },
        { text: "مرتب", mappedValue: "mortab" },
        { text: "موجود", mappedValue: "avaible" }
      ].map(ele => [
        {
          text: `${ele.text}/راتب عالى`,
          mappedValue: `${ele.mappedValue}.ratab`
        },
        {
          text: `${ele.text}/مجند`,
          mappedValue: `${ele.mappedValue}.soliders`
        },
        ele.mappedValue !== "avaible"
          ? {
              text: `${ele.text}/(رع/مجند)`,
              mappedValue: `${ele.mappedValue}.ratebOversolider`
            }
          : null,
        {
          text: `${ele.text}/اجمالي`,
          mappedValue: `${ele.mappedValue}.total`
        }
      ])
    )
    .filter(ele => ele)
    .map(ele => ({
      text: ele.text,
      value: ele.mappedValue,
      searchValue: ele.mappedValues,
      inTable: true
    })),

  {
    text: "المسرحين",
    value: "mosrah",
    searchValue: "mosrah",
    sortable: true,
    inTable: true,
    sort: 1
  },

  ...lodash
    .flattenDeep(
      [
        { text: "الموجود بعد التسريح", mappedValue: "avaibleAfterTasreh" },
        { text: "مطلوب بعد التسريح", mappedValue: "neededAfterTasreh" }
      ].map(ele => [
        {
          text: `${ele.text}/راتب عالى`,
          mappedValue: `${ele.mappedValue}.ratab`
        },
        {
          text: `${ele.text}/مجند`,
          mappedValue: `${ele.mappedValue}.soliders`
        },

        {
          text: `${ele.text}/اجمالي`,
          mappedValue: `${ele.mappedValue}.total`
        }
      ])
    )
    .map(ele => ({
      text: ele.text,
      value: ele.mappedValue,
      searchValue: ele.mappedValues,
      inTable: true
    })),
  {
    text: "تاريخ التسريح",
    value: "RecuEndDate",
    searchValue: "RecuEndDate",
    type: "select",
    inSearch: true,
    sort: 1
  }
];
export default {
  name: "SMYearQuarter",
  props: {},
  async mounted() {
    await this.init();
    this.getRecuEndDateOptions();
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

    componentName: "_30MokrarDailes",
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
      weapon: {
        table: "Weapon",
        value: "Weapon",
        text: "Weapon"
      },
      unitIds: {
        table: "Unit",
        value: "UnitID",
        text: "Unit"
      },
      RecuEndDate: {
        text: "text",
        value: "value",
        data: []
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
        weapon: this.search.weapon,
        RecuEndDate: this.search.RecuEndDate,
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
      this.$set(this, "searchLoading", true);
      this.$set(this.mainTable, "items", []);

      try {
        const result = await this.api(
          "sections/tasgeel/reports/SMYearQuarter",
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
    async getRecuEndDateOptions() {
      const result = await this.api("global/queryRunners", {
        query: `   select count (ID) count ,  RecuEndDate  from Soldier where RecuEndDate > getdate() GROUP  By RecuEndDate`
      });
      this.selects.RecuEndDate.data = result.data.map(ele => ({
        value: `${ele.RecuEndDate}`,
        text: ele.RecuEndDate
      }));
    }
  }
};
</script>
