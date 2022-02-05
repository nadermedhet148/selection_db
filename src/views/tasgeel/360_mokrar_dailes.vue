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
  {
    text: "",
    value: "type",
    searchValue: "type",
    sortable: true,
    type: "select",
    inTable: true,
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
  },
  {
    text: "الاسلحة",
    value: "weapons",
    searchValue: "weapons",
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
  name: "_360MokrarDailes",
  props: {},
  async mounted() {
    await this.init();
    // setTimeout(() => {
    //   this.$set(
    //     this.search,
    //     "weapons",
    //     this.selects.weapons.data.map(ele => ele.Weapon)
    //   );

    //   console.log("oo");
    // }, 1000);
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
      weapons: {
        table: "Weapon",
        value: "Weapon",
        text: "Weapon"
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
        weapons: this.search.weapons,
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
          "sections/tasgeel/reports/360_mokrar_dailes",
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
        console.log(e);
        this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
      }

      this.$set(this, "searchLoading", false);
    },

    buildHeaders() {
      const categories = SoldierCategoryMap.filter(
        ele => this.search.SoldierCategories.indexOf(ele.text) > -1
      );

      let headers = [];
      this.search.weapons
        .filter(ele => ele !== "")
        .forEach(weapon => {
          headers = [
            ...headers,
            ...[
              ...categories.map(category => ({
                text: `${weapon}/${category.text}`,
                value: `${weapon}.${category.mappedValue}`,
                sortable: true,
                type: "select",
                inTable: true,
                sort: 1
              }))
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
        ...categories.map(category => ({
          text: `اجمالي/${category.text}`,
          value: `totals.${category.mappedValue}`,
          sortable: true,
          inTable: true,
          sort: 1
        })),
        {
          text: `الجملة`,
          value: `totals.total`,
          sortable: true,
          inTable: true,
          sort: 1
        }
      ]);
    }
  }
};
</script>
