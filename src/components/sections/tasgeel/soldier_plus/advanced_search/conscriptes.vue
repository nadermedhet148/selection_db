<template>
  <div>
    <v-card class="mb-6">
      <v-card-title>
        البحث المتقدم عن المجندين
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
                  :multiple="option.multiple"
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
        <template v-slot:item.ID="{ item }">
          <v-chip
            color="transparent"
            :to="
              `/soldiers_plus/${item.ID}/${
                item.RecuStage
                  ? constants.serviceTypesMap.solider
                  : constants.serviceTypesMap.highLevel
              }`
            "
            @click.right="copyText(item.ID)"
          >
            {{ item.ID }}
          </v-chip>
        </template>
        <template v-slot:item.Name="{ item }">
          <v-chip color="transparent" @click.right="copyText(item.Name)">
            {{ item.Name }}
          </v-chip>
        </template>
        <template v-slot:item.Type="{ item }">
          <v-chip color="transparent">
            {{ item.RecuStage ? "مجند" : "راتب عالي" }}
          </v-chip>
        </template>
        <template v-slot:item.SoldierStatus="{ item }">
          <v-chip color="transparent">
            {{ item.RecuStage ? item.SoldierStatus : item.RatebState }}
          </v-chip>
        </template>
        <template v-slot:item.SoldierCategory="{ item }">
          <v-chip color="transparent">
            {{ item.RecuStage ? item.SoldierCategory : item.RatebCategory }}
          </v-chip>
        </template>
        <template v-slot:item.SoldierLevel="{ item }">
          <v-chip color="transparent">
            {{ item.SoldierLevel ? item.SoldierLevel : item.RatebLevel }}
          </v-chip>
        </template>
        <template v-slot:item.RecuStartDate="{ item }">
          <v-chip color="transparent">
            {{ item.RecuStage ? item.RecuStartDate : item.VolunteeringDate }}
          </v-chip>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
const constants = require("../../../../../Constant").default;
const lodash = require("lodash");

export default {
  name: "conscriptes",
  mounted() {
    this.fillKeys();
    this.init();
  },
  watch: {},
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
          value: "ID",
          text: "الرقم العسكري",
          type: "text",
          counter: 13
        },
        {
          value: "Name",
          text: "الإسم الكامل",
          type: "text"
        },
        {
          value: "TripleNo",
          text: "الرقم الثلاثي",
          type: "text"
        },
        {
          value: "KnowledgeLevel",
          text: "المؤهل",
          type: "select"
        },
        {
          value: "RecuStage",
          text: "المرحلة التجنيدية",
          type: "select"
        },
        {
          value: "IdentityNo",
          text: " الرقم القومي",
          type: "text"
        },
        {
          value: "ArrivalDate",
          text: "تاريخ الوصول",
          type: "date"
        },
        {
          value: "TestDate",
          text: " تاريخ الاختبار",
          type: "date"
        },
        {
          value: "Centre",
          text: " المركز ",
          type: "select"
        },
        {
          value: "Religion",
          text: "الديانة",
          type: "select"
        },
        {
          value: "Unit",
          text: "الوحدة",
          type: "select"
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
            model: "ID",
            label: "الرقم العسكري",
            type: "text",
            counter: 13
          },
          {
            model: "KnowledgeLevel",
            label: "المؤهل",
            type: "select",
            multiple: true
          },
          {
            model: "RecuStage",
            label: "المرحلة التجنيدية",
            type: "select",
            multiple: true
          },
          {
            model: "RecuRegion",
            label: "مكان التجنيد",
            type: "select",
            multiple: true
          },
          {
            model: "BirthDate",
            label: " تاريخ الميلاد",
            type: "date"
          },
          {
            model: "ArrivalDate",
            label: "تاريخ الوصول",
            type: "date"
          },
          {
            model: "TestDate",
            label: " تاريخ الاختبار",
            type: "date"
          },
          {
            model: "Centre",
            label: " المركز ",
            type: "select",
            multiple: true
          },
          {
            model: "Religion",
            label: "الديانة",
            type: "select",
            multiple: true
          }
        ]
      }
    ],
    constants: constants,
    selects: {
      KnowledgeLevel: {
        text: "text",
        value: "text",
        data: constants.KnowledgeLevel.data
      },
      Religion: {
        text: "text",
        value: "text",
        data: constants.Religion.data
      },
      RecuRegion: {
        text: "text",
        value: "text",
        data: constants.RecuRegion.data
      },
      RecuStage: {
        text: "text",
        value: "text",
        data: lodash.flattenDeep(
          constants.years.map(year =>
            constants.RecuStage.data.map(stage => `${stage.text}-${year}`)
          )
        )
      },
      Centre: {
        table: "Centre",
        text: "Centre",
        value: "Centre"
      },
      Unit: {
        table: "Unit",
        text: "Unit",
        value: "Unit"
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
        search: { ...search }
      })
        .then(x => {
          let fixedData = x.data,
            printer = {
              cons: [...fixedData],
              excelKey: "cons",
              excelHeaders: this.result.headers
            };
          this.$set(this.result, "items", fixedData);
          this.$set(this.result, "printer", printer);
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
        if (option.type == "date") {
          this.$set(this.search, option.model, {});
        } else if (option.multiple) {
          this.$set(this.search, option.model, []);
        } else {
          this.$set(this.search, option.model, "");
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
