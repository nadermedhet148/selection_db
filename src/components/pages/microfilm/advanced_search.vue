<template>
  <div>
    <v-card>
      <v-card-title>
        الخيارات
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-row>
          <template v-for="(option, i) in options">
            <v-col :key="i" cols="12" md="6" lg="4">
              <v-text-field
                v-if="option.type == 'text'"
                :label="option.label"
                :hint="option.hint"
                v-model="search[option.model]"
                filled
                :hide-details="option.hint ? false : true"
                :persistent-hint="option.hint ? true : false"
                :loading="option.loading"
                clearable
              ></v-text-field>
              <v-autocomplete
                v-else-if="option.type == 'select'"
                :label="option.label"
                :hint="option.hint"
                v-model="search[option.model]"
                :items="option.items"
                :item-value="option.item_value"
                :item-text="option.item_text"
                filled
                :hide-details="option.hint ? false : true"
                :persistent-hint="option.hint ? true : false"
                :loading="option.loading"
                clearable
              ></v-autocomplete>
              <v-text-field
                v-else-if="
                  option.type == 'date' && !$store.state.appInfo.dateDialog
                "
                type="date"
                v-model="search[option.model]"
                :prepend-inner-icon="option.icon"
                :label="option.label"
                :hint="option.hint"
                filled
                clearable
                :hide-details="option.hint ? false : true"
                :persistent-hint="option.hint ? true : false"
                :loading="option.loading"
              >
              </v-text-field>
              <v-dialog
                v-else-if="
                  option.type == 'date' && $store.state.appInfo.dateDialog
                "
                :ref="option.model"
                v-model="option.dialog_model"
                :return-value.sync="search[option.model]"
                width="290px"
                persistent
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="search[option.model]"
                    :prepend-inner-icon="option.icon"
                    :label="option.label"
                    :hint="option.hint"
                    readonly
                    filled
                    v-on="on"
                    clearable
                    :hide-details="option.hint ? false : true"
                    :persistent-hint="option.hint ? true : false"
                    :loading="option.loading"
                  >
                  </v-text-field>
                </template>
                <v-date-picker
                  :ref="option.model + '_picker'"
                  v-model="search[option.model]"
                  scrollable
                  color="primary"
                >
                  <v-spacer></v-spacer>
                  <v-btn
                    color="primary"
                    outlined
                    class="px-6 text-capitalize"
                    @click="option.dialog_model = false"
                    >إلغاء</v-btn
                  >
                  <v-btn
                    color="primary"
                    class="px-6 text-capitalize"
                    @click="$refs[option.model][0].save(search[option.model])"
                    >حفظ</v-btn
                  >
                </v-date-picker>
              </v-dialog>
            </v-col>
          </template>
          <v-col cols="12">
            <v-checkbox
              v-model="search.showOnlyHasFilm"
              label="عرض من له فيلم فقط"
              hide-details
              class="my-0"
            ></v-checkbox>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="px-4">
        <v-btn
          class="px-6"
          @click="doSearch"
          v-text="'عرض النتائج'"
          color="primary"
          large
          :disabled="
            Object.values(search).filter(v => (v && v !== true) || v === 0)
              .length == 0
          "
        ></v-btn>
      </v-card-actions>
    </v-card>
    <v-card class="mt-6">
      <v-card-title>
        النتائج
        <v-spacer></v-spacer>
        <printer-menu
          :disabled="result.records.length == 0"
          :data="result.printer"
          :fab="false"
        ></printer-menu>
      </v-card-title>
      <v-divider></v-divider>
      <!-- <v-text-field
        prepend-inner-icon="mdi-magnify"
        v-model.lazy="result.search"
        dense
        filled
      ></v-text-field> -->
      <v-data-table
        :headers="result.headers"
        :items="result.records"
        :v-model="result.selected"
        :show-select="false"
        :loading="result.loading"
        :search.sync="result.search"
        item-key="militaryId"
        multi-sort
        hide-default-header
        @current-items="tableUpdated"
        ref="mainTable"
      >
        <template v-slot:header="table">
          <table-header-filters
            :items="result.records"
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
        <!-- <template v-slot:item.options="{ item }">
          <div>
            <v-btn color="primary" icon @click="editCons(item)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn color="error" icon @click="deleteCons(item)">
              <v-icon>mdi-trash-can</v-icon>
            </v-btn>
          </div>
        </template> -->
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "advanced_search",
  mounted() {
    this.getUnits();
  },
  data: () => ({
    tableFilters: {},
    options: [
      {
        type: "text",
        label: "الرقم العسكري",
        model: "militaryId",
        hint: ""
      },
      {
        type: "text",
        label: "الإسم",
        model: "fullName",
        hint: ""
      },
      {
        type: "select",
        label: "الوحدة",
        model: "unitId",
        hint: "",
        items: [],
        item_value: "unitId",
        item_text: "unitText",
        loading: false
      },
      {
        type: "date",
        label: "تاريخ التسريح",
        model: "demobilizationDate",
        // icon: "mdi-calendar",
        hint: "",
        dialog_model: false
      },
      {
        type: "text",
        label: "رقم الفيلم",
        model: "microfilmId",
        hint: ""
      },
      {
        type: "text",
        label: "عنوان الكشف",
        model: "filmTitle",
        hint: ""
      }
    ],
    search: {
      militaryId: "",
      fullName: "",
      unitId: "",
      demobilizationDate: "",
      microfilmId: "",
      filmTitle: "",
      state: "",
      showOnlyHasFilm: true
    },
    result: {
      printer: {},
      headers: [
        {
          text: "الرقم العسكري",
          sortable: true,
          value: "militaryId"
        },
        {
          text: "الإسم",
          sortable: true,
          value: "fullName"
        },
        {
          text: "الوحدة",
          sortable: true,
          value: "unit.unitText"
        },
        {
          text: "تاريخ التسريح",
          sortable: true,
          value: "demobilizationDate"
        },
        {
          text: "رقم الفيلم",
          sortable: true,
          value: "microfilmId"
        },
        {
          text: "مسلسل",
          sortable: true,
          value: "microfilmSortIndex"
        }
        // {
        //   text: "", // Options [edit, delete]
        //   sortable: false,
        //   value: "options"
        // }
      ],
      records: [],
      selected: [],
      search: "",
      loading: false
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
    doSearch() {
      this.$set(this.result, "loading", true);
      this.api("sections/microfilm/advanced_search", {
        search: this.search
      })
        .then(x => {
          let items = this.fixDates(x.data, ["demobilizationDate"]);
          let printer = {
            cons: [...items],
            excelKey: "cons",
            excelHeaders: this.result.headers
          };
          this.$set(this.result, "records", items);
          this.$set(this.result, "printer", printer);
        })
        .catch(error => {
          console.log(error);
          this.showError("حدث خطأ أثناء احضار الميكروفيلم من قاعدة البيانات.");
        })
        .finally(() => {
          this.$set(this.result, "loading", false);
        });
    },
    getUnits() {
      this.options.find(o => o.model == "unitId").loading = true;
      this.options.find(o => o.model == "unitId").items = [];
      this.api("tables/units/all_units")
        .then(x => {
          this.options.find(o => o.model == "unitId").items = x.data;
        })
        .catch(error => {
          console.log(error);
          this.showError(
            "حدث خطأ أثناء تحميل الوحدات. من فضلك اخرج من الصفحة وجرب مرة ثانية."
          );
        })
        .finally(() => {
          this.options.find(o => o.model == "unitId").loading = false;
        });
    }
  }
};
</script>
