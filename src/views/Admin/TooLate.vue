<template>
  <div>
    <v-card>
      <v-card-title>
        قيود البحث
      </v-card-title>
      <v-card-subtitle>
        بإمكانك تحديد بعض القيود للبحث من هنا, أو قم بالضغط على زر البحث دون
        تحديد قيود لعرض الكل
      </v-card-subtitle>
      <v-card-text>
        <v-row>
          <template v-for="(f, i) in fields">
            <v-col :key="i" cols="6" lg="3">
              <v-text-field
                v-if="['text', 'date'].includes(f.type)"
                :type="f.type"
                filled
                clearable
                :label="f.label"
                hide-details
                v-model="search[f.value]"
              ></v-text-field>
              <v-autocomplete
                v-else-if="f.type == 'select'"
                filled
                :label="f.label"
                hide-details
                clearable
                :items="selects[f.value].data"
                :item-text="f.itemText"
                :loading="selects[f.value].loading"
                :item-value="f.itemValue"
                v-model="search[f.value]"
              ></v-autocomplete>
            </v-col>
          </template>
        </v-row>
      </v-card-text>
      <v-card-actions class="px-4">
        <v-btn
          @click="getItems()"
          outlined
          large
          class="px-6"
          color="primary"
          v-text="'عرض المتأخرات'"
        ></v-btn>
      </v-card-actions>
    </v-card>
    <v-card :disabled="loading" :loading="loading" class="mt-8">
      <v-card-title>
        المتأخرات
        <v-spacer></v-spacer>
        <printer-menu
          :disabled="items.length == 0"
          :data="printer"
          :fab="false"
        ></printer-menu>
      </v-card-title>
      <v-divider></v-divider>
      <v-data-table
        :items="items"
        :headers="headers"
        fixed-header
        :hide-default-header="false"
        multi-sort
        @current-items="tableUpdated"
        ref="mainTable"
      >
        <!-- <template v-slot:header="table">
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
        </template> -->
        <template v-slot:item.missedProcedures="{ item }">
          <template v-for="(proc, i) in item.missedProcedures">
            <v-chip :key="i">
              {{ proc }}
            </v-chip>
          </template>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "admin_too_late",
  mounted() {
    this.init();
    // this.getItems();
  },
  data: () => ({
    componentName: "admin_too_late",
    tableFilters: {},
    search: {},
    fields: [
      {
        label: "تاريخ التجنيد ( من )",
        type: "date",
        value: "conscriptionDateFrom"
      },
      {
        label: "تاريخ التجنيد ( الى )",
        type: "date",
        value: "conscriptionDateTo"
      },
      {
        label: "تاريخ التسريح ( من )",
        type: "date",
        value: "demobilizationDateFrom"
      },
      {
        label: "تاريخ التسريح ( الى )",
        type: "date",
        value: "demobilizationDateTo"
      },
      {
        label: "الجيش / المنطقة",
        type: "select",
        value: "zoneId",
        itemText: "zoneText",
        itemValue: "zoneId"
      },
      {
        label: "الوحدة",
        type: "select",
        value: "unitId",
        itemText: "unitText",
        itemValue: "unitId"
      }
    ],
    loading: false,
    items: [],
    printer: {},
    headers: [
      {
        text: "الرقم العسكري",
        value: "militaryId",
        sortable: true
      },
      {
        text: "الدرجة",
        value: "degree.degreeType",
        sortable: true
      },
      {
        text: "الإسم",
        value: "fullName",
        sortable: true
      },
      {
        text: "الوحدة",
        value: "unit.unitText",
        sortable: true
      },
      {
        text: "تاريخ التسريح",
        value: "demobilizationDate",
        sortable: true
      },
      {
        text: "المتأخر",
        value: "missedProcedures",
        sortable: true
      }
    ],
    selects: {
      zoneId: {
        table: "zones",
        data: []
      },
      unitId: {
        table: "units",
        data: []
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
            this.printer.cons = sorted;
          }
        }
      }
    },
    getItems() {
      this.$set(this, "loading", true);
      let search = this.search;
      console.log(search);
      this.api("sections/admin/too_late/all", {
        ...search
      })
        .then(x => {
          let items = this.fixDates(x.data, [
            "conscriptionDate",
            "demobilizationDate",
            "endingDutyDate"
          ]);
          let printer = {
            cons: [...items],
            excelKey: "cons",
            excelHeaders: this.headers
          };
          this.$set(this, "items", items);
          this.$set(this, "printer", printer);
        })
        .catch(err => {
          console.log(err);
          this.showError("عفواً, حدث خطأ أثناء البحث عن المتأخرات");
        })
        .finally(() => {
          this.$set(this, "loading", false);
        });
    },
    init(specificTable = "") {
      // Get selects
      Object.keys(this.selects).forEach(key => {
        let { table, localTable } = this.selects[key];
        if (table) {
          let obj = {
            table
          };
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
    }
  }
};
</script>
