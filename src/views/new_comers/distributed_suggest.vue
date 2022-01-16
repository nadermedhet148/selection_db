<template>
  <div>
    <v-card :loading="searchLoading" :disabled="searchLoading">
      <v-card-title v-if="items.length > 0">
        <v-spacer></v-spacer>
        <v-btn @click="actionAdd()" large outlined color="primary">
          إضافة شريحة مخالفة
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-row>
          <template v-for="(h, i) in headers.filter(h => h.inSearch)">
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

    <v-card class="mt-8" v-if="items.length > 0">
      <v-card-title>
        <v-spacer></v-spacer>
        <printer-menu
          :disabled="items.length == 0"
          :data="printer"
          :fab="false"
        ></printer-menu>
      </v-card-title>
      <v-divider></v-divider>
      <v-data-table
        :headers="headers.filter(h => h.inTable)"
        :items="items"
        hide-default-header
        fixed-header
        multi-sort
        class="my-awesome-table"
        :items-per-page="120"
        @click:row="handleClick"
        :group-by="search.groubBy"
      >
        <template v-slot:header="table">
          <table-header-filters
            :items="items"
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
        <template v-slot:group.header="{ items, isOpen, toggle }">
          <th colspan="10">
            <v-icon @click="toggle"
              >{{ isOpen ? "mdi-minus" : "mdi-plus" }}
            </v-icon>
            {{
              search.groubBy == "Unit.Directionforunit"
                ? items[0]["Unit"]["Directionforunit"]
                : items[0][search.groubBy]
            }}
          </th>
        </template>
      </v-data-table>
    </v-card>
    <v-dialog
      persistent
      v-model="createdObject.model"
      scrollable
      max-width="750"
    >
      <v-card
        :loading="createdObject.loading"
        :disabled="createdObject.loading"
      >
        <v-card-title>
          <v-spacer></v-spacer>
          <v-btn @click="createdObject.model = false" icon>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-row>
            <template
              v-for="(h, i) in headers
                .filter(h => h)
                .sort((a, b) => a.sort - b.sort)"
            >
              <v-col :cols="h.cols ? h.cols : '6'" :key="i">
                <v-text-field
                  v-if="!h.type || ['text', 'date'].includes(h.type)"
                  filled
                  :type="h.type == 'date' ? 'date' : 'text'"
                  :label="h.text"
                  v-model="createdObject.item[h.searchValue]"
                  :hide-details="h.hint ? false : true"
                  :persistent-hint="h.hint ? true : false"
                  :readonly="h.readonly"
                ></v-text-field>
                <v-autocomplete
                  v-else-if="h.type == 'select'"
                  filled
                  :label="h.text"
                  :multiple="h.multiple"
                  :readonly="h.readonly"
                  v-model="createdObject.item[h.searchValue]"
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
                    selects[h.searchValue]
                      ? selects[h.searchValue].text
                      : 'text'
                  "
                ></v-autocomplete>
                <v-textarea
                  v-else-if="h.type == 'textarea'"
                  filled
                  :label="h.text"
                  v-model="createdObject.item[h.searchValue]"
                  :hide-details="h.hint ? false : true"
                  :persistent-hint="h.hint ? true : false"
                  auto-grow
                  :readonly="h.readonly"
                  rows="1"
                ></v-textarea>
                <v-card
                  v-else-if="h.type == 'checkbox'"
                  flat
                  tile
                  color="transparent"
                  class="pa-0 ma-0"
                  :disabled="h.readonly"
                >
                  <v-btn-toggle
                    v-model="createdObject.item[h.searchValue]"
                    class="d-block"
                    mandatory
                  >
                    <v-btn
                      height="58"
                      width="50%"
                      :color="
                        createdObject.item[h.searchValue] === true
                          ? 'error white--text'
                          : ''
                      "
                      :value="true"
                      v-text="h.trueValue"
                    ></v-btn>
                    <v-btn
                      height="58"
                      width="50%"
                      :color="
                        createdObject.item[h.searchValue] === false
                          ? 'success white--text'
                          : ''
                      "
                      :value="false"
                      v-text="h.falseValue"
                    ></v-btn>
                  </v-btn-toggle>
                </v-card>
              </v-col>
            </template>
          </v-row>
        </v-card-text>
        <v-card-actions class="px-4">
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            outlined
            large
            class="px-6"
            @click="createdObject.model = false"
            v-text="'رجوع'"
          ></v-btn>
          <v-btn
            color="primary"
            large
            class="px-6"
            @click="saveItem()"
            v-text="'حفظ '"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog persistent v-model="copyModel.model" scrollable max-width="750">
      <v-card :loading="copyModel.loading" :disabled="copyModel.loading">
        <v-card-title>
          <v-spacer></v-spacer>
          <v-btn @click="createdObject.model = false" icon>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-row>
            <template
              v-for="(h, i) in copyModel.headers
                .filter(h => h)
                .sort((a, b) => a.sort - b.sort)"
            >
              <v-col :cols="h.cols ? h.cols : '6'" :key="i">
                <v-text-field
                  v-if="!h.type || ['text', 'date'].includes(h.type)"
                  filled
                  :type="h.type == 'date' ? 'date' : 'text'"
                  :label="h.text"
                  v-model="copyModel.item['PlanName']"
                  :hide-details="h.hint ? false : true"
                  :persistent-hint="h.hint ? true : false"
                  :readonly="h.readonly"
                ></v-text-field>
                <v-autocomplete
                  v-else-if="h.type == 'select'"
                  filled
                  :label="h.text"
                  :multiple="h.multiple"
                  :readonly="h.readonly"
                  v-model="copyModel.item['PlanName']"
                  :hide-details="h.hint ? false : true"
                  :persistent-hint="h.hint ? true : false"
                  :items="h.data"
                  :item-value="'PlanName'"
                  :item-text="'PlanName'"
                ></v-autocomplete>
                <v-textarea
                  v-else-if="h.type == 'textarea'"
                  filled
                  :label="h.text"
                  v-model="createdObject.item[h.searchValue]"
                  :hide-details="h.hint ? false : true"
                  :persistent-hint="h.hint ? true : false"
                  auto-grow
                  :readonly="h.readonly"
                  rows="1"
                ></v-textarea>
                <v-card
                  v-else-if="h.type == 'checkbox'"
                  flat
                  tile
                  color="transparent"
                  class="pa-0 ma-0"
                  :disabled="h.readonly"
                >
                  <v-btn-toggle
                    v-model="createdObject.item[h.searchValue]"
                    class="d-block"
                    mandatory
                  >
                    <v-btn
                      height="58"
                      width="50%"
                      :color="
                        createdObject.item[h.searchValue] === true
                          ? 'error white--text'
                          : ''
                      "
                      :value="true"
                      v-text="h.trueValue"
                    ></v-btn>
                    <v-btn
                      height="58"
                      width="50%"
                      :color="
                        createdObject.item[h.searchValue] === false
                          ? 'success white--text'
                          : ''
                      "
                      :value="false"
                      v-text="h.falseValue"
                    ></v-btn>
                  </v-btn-toggle>
                </v-card>
              </v-col>
            </template>
          </v-row>
        </v-card-text>
        <v-card-actions class="px-4">
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            outlined
            large
            class="px-6"
            @click="copyModel.model = false"
            v-text="'رجوع'"
          ></v-btn>
          <v-btn
            color="primary"
            large
            class="px-6"
            @click="copyOne()"
            v-text="'نسخ المعلومات '"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      persistent
      v-model="rowEditModel.model"
      scrollable
      max-width="750"
    >
      <v-card :loading="rowEditModel.model" :disabled="rowEditModel.model">
        <v-card-title>
          <v-spacer></v-spacer>
          <v-btn @click="rowEditModel.model = false" icon>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-row>
            <template
              v-for="(h, i) in headers
                .filter(h => h.inEdit)
                .sort((a, b) => a.sort - b.sort)"
            >
              <v-col :cols="h.cols ? h.cols : '6'" :key="i">
                <v-text-field
                  v-if="!h.type || ['text', 'date'].includes(h.type)"
                  filled
                  :type="h.type == 'date' ? 'date' : 'text'"
                  :label="h.text"
                  v-model="rowEditModel.item[h.value]"
                  :hide-details="h.hint ? false : true"
                  :persistent-hint="h.hint ? true : false"
                  :readonly="h.readonly"
                ></v-text-field>
                <v-autocomplete
                  v-else-if="h.type == 'select'"
                  filled
                  :label="h.text"
                  :multiple="h.multiple"
                  :readonly="h.readonly"
                  v-model="rowEditModel.item[h.value]"
                  :hide-details="h.hint ? false : true"
                  :persistent-hint="h.hint ? true : false"
                  :items="h.data"
                  :item-value="'PlanName'"
                  :item-text="'PlanName'"
                ></v-autocomplete>
                <v-textarea
                  v-else-if="h.type == 'textarea'"
                  filled
                  :label="h.text"
                  v-model="rowEditModel.item[h.searchValue]"
                  :hide-details="h.hint ? false : true"
                  :persistent-hint="h.hint ? true : false"
                  auto-grow
                  :readonly="h.readonly"
                  rows="1"
                ></v-textarea>
                <v-card
                  v-else-if="h.type == 'checkbox'"
                  flat
                  tile
                  color="transparent"
                  class="pa-0 ma-0"
                  :disabled="h.readonly"
                >
                  <v-btn-toggle
                    v-model="rowEditModel.item[h.searchValue]"
                    class="d-block"
                    mandatory
                  >
                    <v-btn
                      height="58"
                      width="50%"
                      :color="
                        createdObject.item[h.searchValue] === true
                          ? 'error white--text'
                          : ''
                      "
                      :value="true"
                      v-text="h.trueValue"
                    ></v-btn>
                    <v-btn
                      height="58"
                      width="50%"
                      :color="
                        createdObject.item[h.searchValue] === false
                          ? 'success white--text'
                          : ''
                      "
                      :value="false"
                      v-text="h.falseValue"
                    ></v-btn>
                  </v-btn-toggle>
                </v-card>
              </v-col>
            </template>
          </v-row>
        </v-card-text>
        <v-card-actions class="px-4">
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            outlined
            large
            class="px-6"
            @click="rowEditModel.model = false"
            v-text="'رجوع'"
          ></v-btn>
          <v-btn
            color="primary"
            large
            class="px-6"
            @click="save()"
            v-text="'حفظ '"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog persistent v-model="newDist.model" scrollable max-width="750">
      <v-card :loading="newDist.loading" :disabled="newDist.loading">
        <v-card-title>
          <v-spacer></v-spacer>
          <v-btn @click="createdObject.model = false" icon>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-col :cols="'6'" :key="i">
          <v-autocomplete
            filled
            :label="'الوحدة'"
            v-model="newDist.item['UnitID']"
            :items="newDist.data"
            :item-value="'UnitID'"
            :item-text="'Unit'"
          ></v-autocomplete>
        </v-col>

        <v-card-actions class="px-4">
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            outlined
            large
            class="px-6"
            @click="newDist.model = false"
            v-text="'رجوع'"
          ></v-btn>
          <v-btn
            color="primary"
            large
            class="px-6"
            @click="addNew()"
            v-text="'اضافة شريحة'"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style>
.my-awesome-table thead th span :first-of-type {
  width: 300px;
  display: flex !important;
}
</style>

<script>
const constants = require("../../Constant").default;
const lodash = require("lodash");

export default {
  name: "distributed_suggest",
  mounted() {
    this.initDates();
    this.init();
  },
  filters: {
    filterStrLimit(str, limit) {
      return `${str.length <= limit ? str : str.substr(0, limit) + ".."}`;
    }
  },
  data: () => ({
    subjectLimit: 10,
    createdObject: {
      model: false,
      fullscreen: false,
      loading: false,
      deleteModel: false,
      viewModel: false,
      item: {}
    },
    newDist: {
      model: false,
      fullscreen: false,
      loading: false,
      deleteModel: false,
      viewModel: false,
      item: {}
    },
    copyModel: {
      model: false,
      fullscreen: false,
      loading: false,
      deleteModel: false,
      viewModel: false,
      item: {},
      headers: []
    },
    rowEditModel: {
      model: false,
      fullscreen: false,
      loading: false,
      deleteModel: false,
      viewModel: false,
      item: {}
    },
    textDialog: {
      model: false,
      fullscreen: false,
      title: "",
      text: ""
    },
    search: {
      groubBy: "Unit.Directionforunit"
    },
    searchLoading: false,
    headers: [
      {
        text: "الاتجاه",
        value: "Unit.Directionforunit",
        sortable: true,
        inEdit: false,
        type: "text",
        readOnly: true,

        inSearch: false,
        inTable: true,
        width: "200px",
        sort: 2
      },
      {
        text: "الوحدة",
        value: "Unit.Unit",
        sortable: true,
        inEdit: false,
        type: "text",
        readOnly: true,
        inSearch: false,
        inTable: true,
        width: "200px",
        sort: 2
      },
      {
        text: "حرب",
        value: "PayWar",
        sortable: true,
        inEdit: true,
        type: "text",

        inSearch: false,
        inTable: true,
        width: "200px",
        sort: 2
      },
      {
        text: "سياسة",
        value: "PayPolitics",
        sortable: true,
        inEdit: true,
        type: "text",

        inSearch: false,
        inTable: true,
        width: "200px",
        sort: 2
      },
      {
        text: "الموجود بدون الراتب العالي",
        value: "ExistWithoutHighPay",
        sortable: true,
        inEdit: true,
        type: "text",

        inSearch: false,
        inTable: true,
        width: "200px",
        sort: 2
      },
      {
        text: "المسرح",
        value: "ReleasedOne",
        sortable: true,
        inEdit: true,
        type: "text",

        inSearch: false,
        inTable: true,
        width: "200px",
        sort: 2
      },
      {
        text: " الموجود بعد المسرح",
        value: "TotalAfterRelease",
        sortable: true,
        inEdit: true,
        type: "text",

        inSearch: false,
        inTable: true,
        width: "200px",
        sort: 2
      },
      {
        text: "نسبة الحرب",
        value: "NWarOne",
        sortable: true,
        inEdit: true,
        type: "text",

        inSearch: false,
        inTable: true,
        width: "200px",
        sort: 2
      },
      {
        text: " الموجود بعد المسرح",
        value: "TotalAfterRelease",
        sortable: true,
        inEdit: true,
        type: "text",

        inSearch: false,
        inTable: true,
        width: "200px",
        sort: 2
      },
      {
        text: "نسبة السياسة",
        value: "NPoliticsOne",
        sortable: true,
        inEdit: true,
        type: "text",

        inSearch: false,
        inTable: true,
        width: "200px",
        sort: 2
      },
      {
        text: "عليا",
        value: "High",
        sortable: true,
        inEdit: true,
        type: "text",

        inSearch: false,
        inTable: true,
        width: "200px",
        sort: 2
      },
      {
        text: "فوق متوسطة",
        value: "AboveAvg",
        sortable: true,
        inEdit: true,
        type: "text",

        inSearch: false,
        inTable: true,
        width: "200px",
        sort: 2
      },
      {
        text: "متوسطه",
        value: "Avg",
        sortable: true,
        inEdit: true,
        type: "text",

        inSearch: false,
        inTable: true,
        width: "200px",
        sort: 2
      },
      {
        text: "عادة",
        value: "Normal",
        sortable: true,
        inEdit: true,
        type: "text",

        inSearch: false,
        inTable: true,
        width: "200px",
        sort: 2
      },
      {
        text: "الاجمالي",
        value: "Total",
        sortable: true,
        inEdit: true,
        type: "text",

        inSearch: false,
        inTable: true,
        width: "200px",
        sort: 2
      },
      {
        text: "الموجود بعد الامداد",
        value: "AfterSupply",
        sortable: true,
        inEdit: true,
        type: "text",

        inSearch: false,
        inTable: true,
        width: "200px",
        sort: 2
      },
      {
        text: "نسبة حرب",
        value: "NWarTwo",
        sortable: true,
        inEdit: true,
        type: "text",

        inSearch: false,
        inTable: true,
        width: "200px",
        sort: 2
      },
      {
        text: "نسبة سياسة",
        value: "NPoliticsTwo",
        sortable: true,
        inEdit: true,
        type: "text",

        inSearch: false,
        inTable: true,
        width: "200px",
        sort: 2
      },
      {
        text: "المرحلة",
        value: "RecuStage",
        searchValue: "RecuStage",
        sortable: true,
        inEdit: false,
        type: "select",
        inSearch: true,
        inTable: false,
        sort: 5
      },
      {
        text: "نوع التوزيع",
        value: "RecommendTypes",
        searchValue: "RecommendTypes",
        sortable: true,
        inEdit: false,
        type: "select",
        inSearch: true,
        inTable: false,
        sort: 5
      },
      // {
      //   text: "تجميع",
      //   value: "groupBy",
      //   searchValue: "groupBy",
      //   sortable: true,
      //   inEdit: false,
      //   type: "select",
      //   inSearch: true,
      //   inTable: false,
      //   sort: 5
      // }
    ],
    items: [],
    tableFilters: {},
    componentName: "createdObject",
    selects: {
      RecuStage: {
        text: "text",
        value: "text",
        data: lodash.flattenDeep(
          constants.years.map(year =>
            constants.RecuStage.data.map(stage => `${stage.text}-${year}`)
          )
        )
      },
      RecommendTypes: {
        text: "text",
        value: "text",
        data: constants.RecommendTypes.data
      },
      UnitID: {
        table: "Unit",
        value: "UnitID",
        text: "Unit"
      },
      groupBy: {
        text: "text",
        value: "value",
        data: [
          {
            text: "الاتجاه",
            value: "Unit.Directionforunit"
          },
          {
            text: "حرب",
            value: "PayWar"
          }
        ]
      }
    },
    printer: {}
  }),
  methods: {
    log(item) {
      console.log("====================================");
      console.log("item", item);
      console.log("====================================");
    },
    runFun(f) {
      return this[f]();
    },

    findItems() {
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);
      let where = {
        RecuStage: this.search.RecuStage,
        PlanName: `${this.search.RecommendTypes} ${this.search.RecuStage}`
      };
      this.$set(this, "groupBy", this.search.groubBy);
      this.api("global/get_all", {
        table: "DistributionSuggestion",
        where,
        include: [
          {
            model: "Unit"
          }
        ]
      })
        .then(x => {
          let data = x.data,
            printer = {
              cons: [...data],
              excelKey: "cons",
              excelHeaders: this.headers.filter(f => f.inSearch)
            };

          if (data.length == 0) {
            this.api("global/queryRunners", {
              query: `SELECT  DISTINCT PlanName FROM NewAFRAAD.dbo.DistributionSuggestion`
            }).then(data => {
              this.$set(this.copyModel, "model", true);
              this.$set(this.copyModel, "headers", [
                {
                  text: "المقترح",
                  value: "PlanName",
                  sortable: true,
                  inEdit: true,
                  type: "select",
                  inSearch: false,
                  inTable: true,
                  width: "200px",
                  sort: 2,
                  data: data.data
                }
              ]);
            });
          }
          this.$set(this, "items", data);
          this.$set(this, "printer", printer);
        })
        .catch(error => {
          this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
          console.log(error);
        })
        .finally(() => {
          this.$set(this, "searchLoading", false);
        });
    },
    init(specificTable = "") {
      // Get selects
      Object.keys(this.selects).forEach(key => {
        let { table, localTable, text, value } = this.selects[key];
        if (table) {
          let obj = {
            table
          };
          obj.attrs = [text, value];
          this.$set(this.selects[key], "loading", true);
          this.api("global/get_all", obj)
            .then(x => {
              this.$set(this.selects[key], "data", x.data);
            })
            .catch(error => {
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
          this.$set(this.selects[key], "data", data);
          this.$set(this.selects[key], "loading", false);
        }
      });
    },
    copyOne() {
      this.api("global/get_all", {
        table: "DistributionSuggestion",
        where: {
          PlanName: this.copyModel.item.PlanName
        },
        include: [
          {
            model: "Unit"
          }
        ]
      }).then(data => {
        data.data.forEach(ele => {
          this.api("global/create_one", {
            table: "DistributionSuggestion",
            where: {
              AboveAvg: ele.AboveAvg,
              AfterSupply: ele.AfterSupply,
              Avg: ele.Avg,
              ExistWithoutHighPay: ele.ExistWithoutHighPay,
              High: ele.High,
              NPoliticsOne: ele.NPoliticsOne,
              NPoliticsTwo: ele.NPoliticsTwo,
              NWarOne: ele.NWarOne,
              NWarTwo: ele.NWarTwo,
              Normal: ele.Normal,
              PayPolitics: ele.PayPolitics,
              PayWar: ele.PayWar,
              RecuStage: this.search.RecuStage,
              PlanName: `${this.search.RecommendTypes} ${this.search.RecuStage}`,
              ReleasedOne: ele.ReleasedOne,
              Total: ele.Total,
              TotalAfterRelease: ele.TotalAfterRelease,
              UnitID: ele.UnitID
            }
          }).then(res => {
            console.log(res);
          });
        });
        this.$set(this.copyModel, "model", false);
      });
    },
    initDates() {
      let dates = this.headers
        .filter(h => h.type == "date")
        .map(h => h.searchValue);
      dates.forEach(d => {
        this.$set(this.search, d, []);
      });
    },
    handleClick(v) {
      this.$set(this.rowEditModel, "model", true);
      this.$set(this.rowEditModel, "item", v);
    },
    save() {
      this.api("global/update_one", {
        where: {
          RecuStage: this.rowEditModel.item.RecuStage,
          UnitID: this.rowEditModel.item.UnitID,
          PlanName: this.rowEditModel.item.PlanName
        },
        update: this.rowEditModel.item,
        table: "DistributionSuggestion"
      }).then(x => {
        this.items[
          this.items.findIndex(
            ele => ele.UnitID == this.rowEditModel.item.UnitID
          )
        ] = this.rowEditModel.item;
        this.$set(this.rowEditModel, "model", false);
        this.showSuccess("تم الحفظ");
      });
    },
    addNew() {
      this.api("global/get_one", {
        table: "DistributionSuggestion",
        where: {
          UnitID: this.newDist.item.UnitID
        }
      }).then(x => {
        let newObject = {
          ...x.data,

          RecuStage: this.search.RecuStage,
          PlanName: `${this.search.RecommendTypes} ${this.search.RecuStage}`,
          UnitID: this.newDist.item.UnitID
        };

        this.api("global/create_one", {
          table: "DistributionSuggestion",
          where: newObject
        }).then(rs => {
          this.$set(this.newDist, "model", false);
          this.showSuccess("تم الحفظ");
          setTimeout(ele => {
            this.findItems();
          }, 1000);
        });
      });
    },
    actionAdd() {
      this.$set(this.newDist, "model", true);
      const addedUnits = this.items.map(ele => ele.UnitID);
      this.$set(
        this.newDist,
        "data",
        this.selects["UnitID"].data.filter(ele => {
          return addedUnits.indexOf(ele.UnitID) == -1;
        })
      );
    }
  }
};
</script>
