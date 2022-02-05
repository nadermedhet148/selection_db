<template>
  <div>
    <v-card :loading="searchLoading" :disabled="searchLoading">
      <v-card-title>
        بحث متقدم في تمام التسجيل
        <v-spacer></v-spacer>
      </v-card-title>
      <v-divider></v-divider>
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

    <v-card class="mt-8">
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
        @current-items="tableUpdated"
        ref="mainTable"
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

        <template v-slot:item.actionsStart="{ item }">
          <v-chip class="transparent">
            <v-btn icon @click="actionEdit(item)" color="primary">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <!-- <v-btn icon @click="actionDelete(item)" color="error">
              <v-icon>mdi-trash-can</v-icon>
            </v-btn> -->
          </v-chip>
        </template>
      </v-data-table>
    </v-card>
    <v-dialog
      v-if="isCurrentRoute(componentName)"
      scrollable
      :fullscreen="textDialog.fullscreen"
      v-model="textDialog.model"
      max-width="650"
    >
      <v-card>
        <v-card-title>
          {{ textDialog.title }}
          <v-spacer></v-spacer>
          <v-btn icon @click="textDialog.fullscreen = !textDialog.fullscreen">
            <v-icon
              >mdi-window-{{
                textDialog.fullscreen ? "restore" : "maximize"
              }}</v-icon
            >
          </v-btn>
          <v-btn icon @click="textDialog.model = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pt-4">
          <dynamic-link
            :prefix="['@', '#']"
            :text="textDialog.text.replace(/(?:\r\n|\r|\n)/g, '<br />')"
          ></dynamic-link>
        </v-card-text>
      </v-card>
    </v-dialog>
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
                .filter(h => h.inModel)
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
  </div>
</template>

<script>
const constants = require("../../Constant").default;
const lodash = require("lodash");
const types = require("../../server-sequelize/reciever/af/sections/tasgeel/reports/types")
  .default;

export default {
  name: "new_commers",
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
    groupedValue: [],
    subjectLimit: 10,
    createdObject: {
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
    search: {},
    searchLoading: false,
    headers: [
      {
        text: "المرحلة",
        value: "Stage",
        searchValue: "Stage",
        sortable: true,
        type: "select",
        inSearch: true,
        inTable: false,
        sort: 5
      },
      {
        text: "التوزيع",
        value: "Dist",
        searchValue: "Dist",
        sortable: true,
        inSearch: false,
        inModel: true,
        inTable: true,
        sort: 5
      },
      {
        text: "عليا",
        value: "High",
        searchValue: "High",
        sortable: true,
        inSearch: false,
        inModel: true,
        inTable: true,
        sort: 5
      },
      {
        text: "فوق متوسطة",
        value: "AboveAvg",
        searchValue: "AboveAvg",
        sortable: true,
        inSearch: false,
        inModel: true,
        inTable: true,
        sort: 5
      },
      {
        text: "متوسطة",
        value: "Avg",
        searchValue: "Avg",
        sortable: true,
        inSearch: false,
        inModel: true,
        inTable: true,
        sort: 5
      },
      {
        text: "عادة",
        value: "Normal",
        searchValue: "Normal",
        sortable: true,
        inSearch: false,
        inModel: true,
        inTable: true,
        sort: 5
      },
      {
        text: "الاجمالي",
        value: "sum",
        searchValue: "sum",
        sortable: true,
        inSearch: false,
        inModel: true,
        inTable: true,
        sort: 5
      },
      {
        text: "",
        value: "actionsStart",
        searchValue: "sum",
        sortable: true,
        inSearch: false,
        inModel: true,
        inTable: true,
        sort: 5
      }
    ],
    items: [],
    tableFilters: {},
    componentName: "createdObject",
    selects: {
      Stage: {
        text: "text",
        value: "text",
        data: lodash.flattenDeep(
          constants.years.map(year =>
            constants.RecuStage.data.map(stage => `${stage.text}-${year}`)
          )
        )
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
    runFun(f) {
      return this[f]();
    },

    findItems() {
      if (!this.search.Stage) {
        this.showError("يجب اختيار المرحلة اولا");
        return;
      }

      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);

      let where = { ...this.search };
      this.api("global/get_all", {
        table: "RegisterationEssurance",
        where
      })
        .then(async x => {
          let data = x.data,
            printer = {
              cons: [...data],
              excelKey: "cons",
              excelHeaders: this.headers.filter(f => f.inSearch)
            };

          if (data.length === 0) {
            [
              "المخطط",
              "ما تم وصوله للمركز",
              "ما تم تسجيله بفرع الافراد",
              "ما تم تسجيله بالشبكة العسكرية",
              "الموزعين حتي الان"
            ]
              .map(Dist => {
                return {
                  Dist,
                  High: 0,
                  AboveAvg: 0,
                  Avg: 0,
                  Normal: 0,
                  Sum: 0,
                  Notes: "",
                  Stage: this.search.Stage
                };
              })
              .forEach(ele => {
                this.api("global/create_one", {
                  where: ele,
                  table: "RegisterationEssurance"
                }).then(x => {});
              });
          }

          const levelMapping = {
            عليا: "High",
            "فوق متوسطة": "AboveAvg",
            متوسطه: "Avg",
            عادة: "Normal"
          };

          constants.KnowledgeLevel.data.map(({ text }, index) => {
            this.api("global/queryRunners", {
              query: `SELECT  SUM (NumberofArrivals) as sum FROM NewComersArrivals where KnowledgeLevel = N'${text}' and RecuStage = N'${this.search.Stage}' `
            }).then(data => {
              this.api("global/update_one", {
                where: {
                  Dist: "ما تم وصوله للمركز",
                  Stage: this.search.Stage
                },
                update: {
                  [levelMapping[text]]: data.data[0].sum
                },
                table: "RegisterationEssurance"
              }).then(x => {});
            });

            this.api("global/queryRunners", {
              query: `SELECT  COUNT(ID) as total FROM Soldier where KnowledgeLevel = N'${text}' and RecuStage = N'${this.search.Stage}' and WeaponID = ${types.harsHododId}`
            }).then(data => {
              this.api("global/update_one", {
                where: {
                  Dist: "ما تم تسجيله بفرع الافراد",
                  Stage: this.search.Stage
                },
                update: {
                  [levelMapping[text]]: data.data[0].total
                },
                table: "RegisterationEssurance"
              }).then(x => {});
            });

            this.api("global/queryRunners", {
              query: `SELECT Count(KnowledgeLevel) As 'Count' FROM Soldier where KnowledgeLevel = N'${text}' and RecuStage = N'${this.search.Stage}' AND UnitID != 0 and and WeaponID = ${types.harsHododId}`
            }).then(data => {
              this.api("global/update_one", {
                where: {
                  Dist: "الموزعين حتي الان",
                  Stage: this.search.Stage
                },
                update: {
                  [levelMapping[text]]: data.data[0].Count
                },
                table: "RegisterationEssurance"
              }).then(x => {});
            });
          });
          // this should be refactord to use async and awiat for all creates
          setTimeout(() => {
            this.api("global/get_all", {
              table: "RegisterationEssurance",
              where
            }).then(data => {
              this.$set(this, "searchLoading", false);
              this.$set(
                this,
                "items",
                data.data.map(ele => ({
                  ...ele,
                  sum: ele.High + ele.AboveAvg + ele.Avg + ele.Normal
                }))
              );
              this.$set(this, "printer", printer);
            });
          }, 4000);
        })
        .catch(error => {
          this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
          console.log(error);
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
          this.$set(this.selects[key], "data", data);
          this.$set(this.selects[key], "loading", false);
        }
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
    actionEdit(item) {
      if (
        ["المخطط", "ما تم تسجيله بالشبكة العسكرية"].indexOf(item.Dist) == -1
      ) {
        this.showError("لا يمكنك تعديل ذلك الصف");
        return null;
      }
      // console.log(item);
      this.$set(this.createdObject, "item", { ...item });
      this.$set(this.createdObject, "model", true);
    },
    actionAdd() {
      this.$set(this.createdObject, "item", {});
      this.$set(this.createdObject, "model", true);
    },
    saveItem() {
      this.api("global/update_one", {
        where: {
          Dist: this.createdObject.item.Dist,
          Stage: this.search.Stage
        },
        update: this.createdObject.item,
        table: "RegisterationEssurance"
      }).then(x => {
        this.items[
          this.items.findIndex(ele => ele.Dist == this.createdObject.item.Dist)
        ] = this.createdObject.item;
        this.$set(this.createdObject, "model", false);
        this.showSuccess("تم الحفظ");
      });
    }
  }
};
</script>
