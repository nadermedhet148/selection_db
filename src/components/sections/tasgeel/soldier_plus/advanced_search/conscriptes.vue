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
          sortable: true
        },
        {
          value: "Name",
          text: "الإسم",
          sortable: true
        },
        {
          value: "Weapon.Weapon",
          text: "السلاح",
          sortable: true
        },
        {
          value: "Unit.Unit",
          dbvalue: "UnitID",
          text: "الوحدة",
          sortable: true
        },
        {
          value: "Weapon.Weapon",
          dbvalue: "Weapon.WeaponID",
          text: "السلاح",
          sortable: true
        },
        {
          value: "Type",
          dbvalue: "Type",
          text: "نوع الفرد",
          sortable: true
        },
        {
          value: "SoldierStatus",
          dbvalue: "SoldierStatus",
          text: "حالة الفرد",
          sortable: true
        },
        {
          value: "SoldierCategory",
          dbvalue: "SoldierCategory",
          text: "الفئة",
          sortable: true
        },
        {
          value: "SoldierLevel",
          dbvalue: "SoldierLevel",
          text: "الدرجة",
          sortable: true
        },
        {
          value: "RecuStartDate",
          text: "تاريخ التجنيد / التطوع",
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
            model: "ID",
            label: "الرقم العسكري",
            type: "text",
            counter: 13,
            forEnhaa: true
          },
          {
            model: "Name",
            label: "الإسم الكامل",
            type: "text",
            forEnhaa: true
          },
          {
            model: "TripleNo",
            label: "الرقم الثلاثي",
            type: "text"
          },
          {
            model: "Type",
            label: "توع المجند",
            type: "select",
            multiple: true
          },
          {
            model: "IndexNo",
            label: "رقم السجل ",
            type: "text"
          },
          {
            model: "SoldierLevel",
            multiple: true,
            label: "الدرجة",
            type: "select"
          },
          {
            model: "SoldierStatus",
            multiple: true,
            label: "حالة الفرد",
            type: "select",
            forEnhaa: true
          },
          {
            model: "EndingCause",
            label: "سبب الإنهاء",
            type: "text"
          },
          {
            model: "KnowledgeLevel",
            multiple: true,
            label: "المؤهل",
            type: "select"
          },

          {
            model: "SoldierCategory",
            multiple: true,
            label: "الفئة",
            type: "select"
          },
          {
            model: "RecuTreat",
            multiple: true,
            label: "المعاملة التجنيدية",
            type: "select"
          },
          {
            model: "RecuStage",
            multiple: true,
            label: "المرحلة التجنيدية",
            type: "select"
          },
          {
            model: "Direction",
            multiple: true,
            label: " الاتجاه",
            type: "select"
          }
        ]
      },
      {
        title: "مكان الخدمة",
        options: [
          {
            model: "WeaponID",
            multiple: true,
            label: "السلاح",
            type: "select"
          },
          {
            model: "UnitID",
            multiple: true,
            label: "الوحدة",
            type: "select"
          },
          {
            model: "DutyID",
            multiple: true,
            label: " الواجب المدرب عليه",
            type: "select"
          }
        ]
      },
      {
        title: "بيانات شخصية",
        options: [
          {
            model: "BirthDate",
            label: "تاريخ الميلاد",
            type: "date"
          },
          {
            model: "IdentityNo",
            label: "الرقم القومي",
            type: "text",
            counter: 14
          },
          {
            model: "CityID",
            multiple: true,
            label: "المحافظة",
            type: "select"
          },
          {
            model: "CentreID",
            multiple: true,
            label: "المركز",
            type: "select"
          },
          {
            model: "Religion",
            multiple: true,
            label: "الديانة",
            type: "select"
          },
          {
            model: "BloodType",
            multiple: true,
            label: "فصيلة الدم",
            type: "select"
          },
          {
            model: "College",
            multiple: true,
            label: "الكلية ",
            type: "select"
          }
        ]
      },
      {
        title: "بيانات الخدمة",
        options: [
          {
            model: "RecuStartDate",
            label: "تاريخ التجنيد",
            type: "date",
            forEnhaa: true
          },
          {
            model: "RecuEndDate",
            label: "تاريخ التسريح",
            type: "date"
          },
          {
            model: "ArrivalDate",
            label: " تاريخ الوصول لمركز التدريب",
            type: "date"
          },
          {
            model: "RecuRegion",
            multiple: true,
            label: "منطقة التجنيد",
            type: "select"
          }
        ]
      },
      {
        title: "الإدارات التخصصية",
        options: [
          {
            model: "Treatment",
            multiple: true,
            label: "المعاملة",
            type: "select"
          },
          {
            model: "DriverLevel",
            multiple: true,
            label: "درجة الرخصة",
            type: "select"
          },
          {
            model: "ServiceType",
            label: "نوع الخدمة",
            type: "select",
            multiple: true
          }
        ]
      },
      {
        title: "بيانات الراتب العالي",
        options: [
          { model: "FileNo", label: "رقم الملف", type: "text" },
          {
            model: "RatebCategory",
            label: "الفئة",
            type: "select",
            multiple: true
          },
          {
            model: "RatebLevel",
            label: "الدرجة",
            type: "select",
            multiple: true
          },
          {
            model: "RatebState",
            label: "الحالة",
            type: "select",
            multiple: true
          },
          {
            model: "ServiceStyle",
            label: "نوع الخدمة",
            type: "select",
            multiple: true
          },
          {
            model: "SatrtingSarefRateb",
            label: "تاريح صرف الراتب",
            type: "date"
          },
          { model: "OlderindNo", label: "رقم الاقدمية", type: "text" },
          { model: "Dof3aNum", label: "رقم الدفعة", type: "text" },
          { model: "VolunteeringDate", label: "تاريخ التطوع", type: "date" },
          {
            model: "MartialStatus",
            label: "الحالة الاجتماعية",
            type: "select",
            multiple: true
          },
          {
            model: "UnitJoinDate",
            label: "تاريخ الالتحاق بالوحدة",
            type: "date"
          },
          { model: "RatebCategoryFari", label: "الفئة الفرعية", type: "select" }
        ]
      }
    ],
    constants: constants,
    selects: {
      SoldierLevel: {
        text: "text",
        value: "text",
        data: constants.SoldierLevel.data
      },
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
      DriverLevel: {
        text: "text",
        value: "text",
        data: constants.DriverLevel.data
      },
      RecuTreat: {
        text: "text",
        value: "text",
        data: constants.RecuTreat.data
      },
      SoldierCategory: {
        text: "text",
        value: "text",
        data: constants.SoldierCategory.data
      },
      BloodType: {
        text: "text",
        value: "text",
        data: constants.BloodType.data
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
      Treatment: {
        text: "text",
        value: "text",
        data: constants.Treatment.data
      },
      SoldierStatus: {
        text: "text",
        value: "text",
        data: constants.SoldierStatus.data
      },
      College: {
        text: "text",
        value: "text",
        data: constants.College.data
      },
      Direction: {
        text: "text",
        value: "text",
        data: constants.Direction.data
      },
      CityID: {
        table: "City",
        text: "City",
        value: "CityID"
      },
      CentreID: {
        table: "Centre",
        text: "Centre",
        value: "CentreID"
      },
      DutyID: {
        table: "Duty",
        text: "Duty",
        value: "DutyID"
      },
      WeaponID: {
        table: "Weapon",
        text: "Weapon",
        value: "WeaponID"
      },

      UnitID: {
        table: "Unit",
        value: "UnitID",
        text: "Unit"
      },
      ServiceType: {
        text: "text",
        value: "text",
        data: constants.serviceTypes
      },
      ServiceStyle: {
        text: "text",
        value: "text",
        data: constants.ServiceStyle
      },
      RatebCategoryFari: {
        text: "text",
        value: "text",
        data: constants.RatebCategoryFari.data
      },
      RatebCategory: {
        text: "text",
        value: "text",
        data: constants.SoldierCategory.data
      },
      RatebLevel: {
        text: "text",
        value: "text",
        data: constants.SoldierLevel.data
      },
      RatebState: {
        text: "text",
        value: "text",
        data: constants.SoldierStatus.data
      },
      MartialStatus: {
        text: "text",
        value: "text",
        data: constants.matrialStatus.data
      },
      Type: {
        text: "text",
        value: "text",
        data: [{ text: "راتب عالى" }, { text: "مجند" }]
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
