<template>
  <div>
    <v-card :loading="searchLoading" :disabled="searchLoading">
      <v-card-title>
        بحث متقدم في تمام الترحيلات
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

    <v-card v-if="createdObject.item.UnitID">
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
                  selects[h.searchValue] ? selects[h.searchValue].text : 'text'
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
          large
          class="px-6"
          @click="saveItem()"
          v-text="'حفظ '"
        ></v-btn>
      </v-card-actions>
    </v-card>

    <Effects ref="effects" :parentFilters="true"></Effects>
    <Elt7aq ref="elt7aq" :parentFilters="true"></Elt7aq>
  </div>
</template>

<script>
const constants = require("../../Constant").default;
const lodash = require("lodash");
const Effects = require("./effects");

export default {
  components: {
    Effects: () => import("@/views/new_comers/effects.vue"),
    Elt7aq: () => import("@/views/new_comers/malaheq_suggest.vue")
  },
  name: "tmam_elthr7el",
  mounted() {
    this.init();
  },
  filters: {
    filterStrLimit(str, limit) {
      return `${str.length <= limit ? str : str.substr(0, limit) + ".."}`;
    }
  },
  data: () => ({
    Trahel: {},
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
        text: "المخصص",
        value: "TotalSpecified",
        searchValue: "TotalSpecified",
        sortable: true,
        type: "text",
        inSearch: false,
        inTable: true,
        inModel: true,
        readonly: false,
        sort: 1
      },
      {
        text: "المرحل",
        value: "Moved",
        searchValue: "Moved",
        sortable: true,
        type: "text",
        inSearch: false,
        inTable: true,
        inModel: true,
        readonly: false,
        sort: 1
      },
      {
        text: "اجمالي المواقف",
        value: "totalSituations",
        searchValue: "totalSituations",
        sortable: true,
        type: "text",
        inSearch: false,
        inTable: true,
        inModel: true,
        readonly: true,
        sort: 1
      },
      {
        text: "اجمالي الملاحق",
        value: "totalFollowings",
        searchValue: "totalFollowings",
        sortable: true,
        type: "text",
        inSearch: false,
        inTable: true,
        inModel: true,
        readonly: true,
        sort: 1
      },

      {
        text: "المرحلة",
        value: "RecuStage",
        searchValue: "RecuStage",
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
        searchValue: "UnitID",
        sortable: true,
        type: "select",
        inSearch: true,
        inTable: false,
        inModel: false,
        sort: 1
      }
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
      UnitID: {
        table: "Unit",
        value: "UnitID",
        text: "Unit"
      }
    },
    printer: {}
  }),
  watch: {},
  methods: {
    log(item) {
      console.log("====================================");
      console.log("item", item);
      console.log("====================================");
    },
    runFun(f) {
      return this[f]();
    },

    async saveItem(edirableFromTableItem) {
      this.$set(this.createdObject, "loading", true);
      let saveItem;

      saveItem = await this.api(`global/update_one`, {
        table: "Moving",
        where: {
          RecuStage: this.search.RecuStage,
          UnitID: this.search.UnitID
        },
        update: this.createdObject.item
      });

      if (saveItem && saveItem.data && saveItem.ok) {
        this.showSuccess("تم حفظ ");
        this.findItems();
        this.createdObject, "model", false;
      } else {
        this.showError("تعذر حفظ  في قاعدة البيانات");
      }
      this.$set(this.createdObject, "loading", false);
      this.$set(this.createdObject, "model", false);
    },
    async findItems() {
      try {
        if (!this.search.RecuStage || !this.search.UnitID) {
          this.showError("يجب اختيار المرحلة و الوحدة اولا");
          return;
        }
        this.$refs.effects.search = {
          RecuStage: this.search.RecuStage,
          UnitID: this.search.UnitID
        };
        await this.$refs.effects.findItems();

        this.$refs.elt7aq.search = {
          RecuStage: this.search.RecuStage,
          UnitID: this.search.UnitID
        };
        await this.$refs.elt7aq.findItems();

        const res = await this.api("global/get_or_create", {
          table: "Moving",
          where: {
            RecuStage: this.search.RecuStage,
            UnitID: this.search.UnitID
          }
        });
        this.$set(this.createdObject, "item", {
          ...res.data[0],
          totalSituations: this.$refs.effects.mainTable.items?.length,
          totalFollowings: this.$refs.elt7aq.followingSuggestTabel.items?.length
        });
      } catch (e) {
        this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
      }
    },
    init(specificTable = "") {
      // Get selects
      Object.keys(this.selects).forEach(key => {
        let { table, localTable, text, value } = this.selects[key];
        if (table) {
          let obj = {
            table
          };
          // obj.attrs = [text, value];
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
    actionAdd() {
      this.$set(this.createdObject, "item", {});
      this.$set(this.createdObject, "model", true);
    },
    actionEdit(item) {
      this.$set(this.createdObject, "model", true);
      this.$set(this, "Effect", { ...item, isEdit: true });
    },
    actionCertificatie(item) {
      this.$confirm(`هل انت متاكد من تغير الحالة`, {
        title: ``
      }).then(async res => {
        if (res) {
          await this.api(`global/update_one`, {
            table: "Situations",
            where: {
              ID: item.ID,
              SituationID: item.SituationID
            },
            update: {
              Contnuity: item.Contnuity == "متابع" ? "غير متابع" : "متابع"
            }
          });
          this.findItems();
        }
      });
    }
  }
};
</script>
