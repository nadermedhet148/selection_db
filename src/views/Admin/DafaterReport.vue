<template>
  <div>
    <v-card>
      <v-card-title>
        خيارات البحث
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          class="px-4"
          @click="searchModifications()"
          large
        >
          <v-icon class="me-3">mdi-magnify</v-icon>
          بحث
        </v-btn>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-row>
          <template v-for="(option, i) in options">
            <v-col :key="i" cols="12" md="6" lg="4" xl="3">
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
                @keypress.enter="
                  Object.values(search).filter(
                    v =>
                      (Array.isArray(v) && v.length > 0) ||
                      (!Array.isArray(v) && v && v !== true) ||
                      (!Array.isArray(v) && v === 0)
                  ).length == 0
                    ? () => {}
                    : searchModifications()
                "
              ></v-text-field>
              <v-autocomplete
                v-if="option.type == 'select'"
                :label="option.label"
                :hint="option.hint"
                v-model="search[option.model]"
                :items="selects[option.model].data"
                :item-value="selects[option.model].value"
                :item-text="selects[option.model].text"
                filled
                :error-messages="selects[option.model].error"
                :hide-details="option.hint ? false : true"
                :persistent-hint="option.hint ? true : false"
                :loading="selects[option.model].loading || option.loading"
                clearable
              ></v-autocomplete>
              <v-text-field
                v-else-if="option.type == 'date'"
                v-model="search[option.model]"
                :hint="option.hint"
                :persistent-hint="option.hint ? true : false"
                :hide-details="option.hint ? false : true"
                :label="option.label"
                type="date"
                :error-messages="option.error"
                filled
                :clearable="!option.disabled"
              >
              </v-text-field>
              <!-- <v-dialog
                v-else-if="option.type == 'date'"
                :ref="`${option.model}`"
                v-model="dialogs[`${option.model}`]"
                :return-value.sync="search[option.model]"
                width="300px"
                :disabled="option.readonly"
                persistent
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="search[option.model]"
                    :prepend-inner-icon="option.icon"
                    :hint="option.hint"
                    :persistent-hint="option.hint ? true : false"
                    :hide-details="option.hint ? false : true"
                    :label="option.label"
                    readonly
                    :error-messages="option.error"
                    filled
                    v-on="on"
                    :clearable="!option.disabled"
                  >
                  </v-text-field>
                </template>
                <v-date-picker
                  :ref="`${option.model}_picker`"
                  v-model="search[option.model]"
                  scrollable
                  color="primary"
                  :range="option.range"
                >
                  <v-spacer></v-spacer>
                  <v-btn
                    color="primary"
                    outlined
                    class="px-6 text-capitalize"
                    @click="dialogs[`${option.model}`] = false"
                    >إلغاء</v-btn
                  >
                  <v-btn
                    color="primary"
                    class="px-6 text-capitalize"
                    @click="
                      $refs[`${option.model}`][0].save(search[option.model])
                    "
                    >حفظ</v-btn
                  >
                </v-date-picker>
              </v-dialog> -->
            </v-col>
          </template>
        </v-row>
      </v-card-text>
    </v-card>
    <v-card class="mt-6">
      <v-card-title>
        النتائج
        <v-spacer></v-spacer>
      </v-card-title>
      <v-divider></v-divider>
      <!-- <v-text-field
        prepend-inner-icon="mdi-magnify"
        v-model.lazy="result.search"
        filled
        dense
      ></v-text-field> -->
      <v-data-table
        :headers="result.headers"
        :items="result.items"
        :loading="result.loading"
        v-model="result.selected"
        item-key="id"
        :search.sync="result.search"
        fixed-header
        hide-default-header
        multi-sort
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
        <template v-slot:item.dafterName="{ item }">
          <v-chip color="transparent" :to="`/dafater_cons/${item.imageId}`">
            {{ item.dafterName }}
          </v-chip>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "DafaterReport",
  mounted() {
    this.fillKeys();
    this.fillHeaders();
    this.init();
  },
  data: () => ({
    tableFilters: {},
    search: {},
    dialogs: {},
    options: [
      {
        type: "select",
        model: "userId",
        label: "المستخدم",
        hint: "",
        icon: ""
      },
      {
        type: "date",
        model: "dateFrom",
        label: "التاريخ ( من )",
        hint: "",
        icon: ""
      },
      {
        type: "date",
        model: "dateTo",
        label: "التاريخ ( الى )",
        hint: "",
        icon: ""
      }
    ],
    result: {
      items: [],
      selected: [],
      search: "",
      headers: []
    },
    selects: {
      userId: {
        table: "users",
        value: "userId",
        text: "realName"
      }
    }
  }),
  methods: {
    fillHeaders() {
      let headers = {
          militaryId: "الرقم العسكري",
          fullName: "الإسم",
          dafterName: "اسم الدفتر",
          addedBy: "المسجل",
          date: "تاريخ التسجيل"
        },
        arr = [];
      Object.keys(headers).forEach(header => {
        let text = headers[header],
          obj = {
            text,
            value: header,
            sortable: true
          };
        arr.push(obj);
      });
      this.$set(this.result, "headers", arr);
    },
    searchModifications() {
      this.$set(this.result, "loading", true);
      let where = {};
      console.log(this.search);
      Object.keys(this.search).forEach(key => {
        let v = this.search[key];
        if (
          ((Array.isArray(v) && v.length > 0) ||
            (!Array.isArray(v) && v && v !== true) ||
            (!Array.isArray(v) && v === 0)) &&
          !["dateFrom", "dateTo"].includes(key)
        ) {
          // if (["militaryId", "fullName", "form"].includes(key)) {
          //   where[key] = {
          //     $like: `${v}%`
          //   };
          // } else {
          where[key] = v;
          // }
        }
      });
      let dateFrom = this.search.dateFrom,
        dateTo = this.search.dateTo,
        date =
          dateFrom || dateTo
            ? {
                $between: [
                  dateFrom && dateFrom.length > 0
                    ? new Date(dateFrom).setHours(0)
                    : new Date(),
                  dateTo && dateTo.length > 0
                    ? new Date(dateTo).setHours(24)
                    : new Date()
                ]
              }
            : null;
      console.log("date", date);
      if (date) {
        where.dateAdded = date;
      }
      // includes
      let include = [
        {
          model: "dafaterImages",
          include: [
            {
              model: "dafater"
            }
          ]
        },
        {
          model: "conscriptes"
        },

        {
          model: "users"
        }
      ];
      // console.log(where);
      this.api("global/get_all", {
        table: "dafaterRel",
        where,
        include
      })
        .then(x => {
          console.log(x);
          const allRows = x.data;
          if (allRows && allRows.length > 0) {
            const mappedRows = allRows.map(row => ({
              militaryId: row.conscripte?.militaryId,
              fullName: row.conscripte?.fullName,
              dafterName:
                row.dafaterImage.dafater.code +
                " - " +
                row.dafaterImage.dafater.name,
              addedBy: row.user.realName,
              date: row.dateAdded,
              imageId: row.imageId
            }));
            this.$set(
              this.result,
              "items",
              this.fixDates(mappedRows, ["date"])
            );
          } else {
            this.$set(this.result, "items", []);
          }
        })
        .catch(error => {
          this.showError("حدث خطأ اثناء تحميل البيانات");
          console.log(error);
        })
        .finally(() => {
          this.$set(this.result, "loading", false);
        });
    },
    fillKeys() {
      let options = this.options;
      options.forEach(option => {
        if (option.multiple) {
          this.$set(this.search, option.model, []);
        }
      });
    },
    init() {
      // Get selects
      Object.keys(this.selects).forEach(key => {
        let { table } = this.selects[key];
        if (table) {
          this.$set(this.selects[key], "loading", true);
          this.api("global/get_all", {
            table
          })
            .then(x => {
              if (key == "userId") {
                this.$set(
                  this.selects[key],
                  "data",
                  x.data.filter(user => user.isVisible)
                );
              } else this.$set(this.selects[key], "data", x.data);
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
    }
  }
};
</script>
