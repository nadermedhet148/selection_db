<template>
  <div>
    <v-card :disabled="loading" :loading="loading">
      <v-card-title>
        الخيارات
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-row>
          <template v-for="(option, i) in options">
            <v-col :key="i" cols="6" lg="4">
              <v-text-field
                v-if="!option.type || option.type == 'text'"
                :persistent-hint="option.hint ? true : false"
                :hide-details="option.hint ? false : true"
                :hint="option.hint"
                filled
                v-model="search[option.model]"
                :label="option.label"
                @keypress.enter="searchRequestsToday()"
              ></v-text-field>
              <v-list class="ma-0 pa-0" v-else-if="option.type == 'checkbox'">
                <v-list-item
                  :class="
                    `${
                      $vuetify.theme.dark ? 'grey darken-3' : 'grey lighten-4'
                    }`
                  "
                  :disabled="option.readonly"
                >
                  <v-list-item-content>
                    <v-list-item-title
                      class=""
                      v-text="option.label"
                    ></v-list-item-title>
                    <v-list-item-subtitle
                      class=""
                      v-text="option.hint"
                    ></v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-btn-toggle v-model="search[option.model]">
                      <v-btn
                        value="yes"
                        :color="
                          search[option.model] == 'yes'
                            ? 'success white--text'
                            : ''
                        "
                        v-text="'نعم'"
                      ></v-btn>
                      <v-btn
                        value="no"
                        :color="
                          search[option.model] == 'no'
                            ? 'error white--text'
                            : ''
                        "
                        v-text="'لا'"
                      ></v-btn>
                    </v-btn-toggle>
                  </v-list-item-action>
                </v-list-item>
              </v-list>
              <v-autocomplete
                v-else-if="option.type == 'select'"
                :label="option.label"
                :hint="option.hint"
                v-model="search[option.model]"
                :items="selects[option.model].data"
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
              <v-row class="my-0 py-0" v-else-if="option.type == 'date'">
                <template v-for="n in 2">
                  <v-col :key="n" class="py-0 my-0">
                    <v-dialog
                      :ref="`${option.model}-date-${n}`"
                      v-model="dialogs[`${option.model}-date-${n}`]"
                      :return-value.sync="search[`${option.model}-date-${n}`]"
                      width="300px"
                      :disabled="option.readonly"
                      persistent
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="search[`${option.model}-date-${n}`]"
                          :prepend-inner-icon="option.icon"
                          :hint="option.hint"
                          :persistent-hint="option.hint ? true : false"
                          :hide-details="option.hint ? false : true"
                          :label="
                            `${option.label} ( ${n == 1 ? 'من' : 'الى'} )`
                          "
                          v-mask="'####-##-##'"
                          :error-messages="option.error"
                          filled
                          v-on="on"
                          :clearable="
                            option.range
                              ? false
                              : !option.readonly && !option.disabled
                          "
                          :append-icon="
                            option.range &&
                            search[`${option.model}-date-${n}`] &&
                            search[`${option.model}-date-${n}`].length > 0 &&
                            !option.readonly &&
                            !option.disabled
                              ? 'mdi-close'
                              : ''
                          "
                          @click:append="
                            option.range
                              ? (search[`${option.model}-date-${n}`] = [])
                              : () => {}
                          "
                        >
                        </v-text-field>
                      </template>
                      <v-date-picker
                        :ref="`${`${option.model}-date-${n}`}_picker`"
                        v-model="search[`${option.model}-date-${n}`]"
                        scrollable
                        color="primary"
                        :range="option.range"
                      >
                        <v-spacer></v-spacer>
                        <v-btn
                          color="primary"
                          outlined
                          class="px-6 text-capitalize"
                          @click="dialogs[`${option.model}-date-${n}`] = false"
                          >إلغاء</v-btn
                        >
                        <v-btn
                          color="primary"
                          class="px-6 text-capitalize"
                          @click="
                            $refs[`${option.model}-date-${n}`][0].save(
                              search[`${option.model}-date-${n}`]
                            )
                          "
                          >حفظ</v-btn
                        >
                      </v-date-picker>
                    </v-dialog>
                  </v-col>
                </template>
              </v-row>
            </v-col>
          </template>
        </v-row>
      </v-card-text>
      <v-card-actions class="px-4">
        <v-btn
          large
          color="primary"
          v-text="'بحث'"
          class="px-6"
          @click="searchRequestsToday()"
        ></v-btn>
        <v-btn
          large
          color="primary"
          outlined
          v-text="'عرض اليوم'"
          class="px-6"
          @click="searchRequestsToday(true)"
        ></v-btn>
      </v-card-actions>
    </v-card>
    <v-card class="mt-6" :disabled="loading" :loading="loading">
      <v-card-title>
        الطلبات
        <v-spacer></v-spacer>
      </v-card-title>
      <v-divider></v-divider>
      <!-- <v-text-field
        prepend-inner-icon="mdi-magnify"
        dense
        filled
        v-model.lazy="results.search"
      ></v-text-field> -->
      <v-data-table
        :search.sync="results.search"
        v-model="results.selects"
        fixed-header
        :headers="results.headers"
        :items="results.items"
        hide-default-header
        multi-sort
      >
        <template v-slot:header="table">
          <table-header-filters
            :items="results.items"
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
        <template v-slot:item.enha2="{ item }">
          <v-chip
            :color="
              item.enha2 == 'مرفوض'
                ? 'error'
                : item.enha2 == 'بيانات ناقصة'
                ? 'orange white--text'
                : ''
            "
          >
            {{ item.enha2 }}
          </v-chip>
        </template>
        <template v-slot:item.id="{ item }">
          <v-chip
            @click="$emit('open-request', item.id)"
            color="transparent"
            text-color="primary"
          >
            {{ item.id }}
          </v-chip>
        </template>
        <template v-slot:item.aksam.name="{ item }">
          <v-chip color="transparent">
            {{
              item.aksam && item.aksam.name
                ? item.aksam.name.replace("قسم ", "")
                : ""
            }}
          </v-chip>
        </template>
        <template v-slot:item.accept="{ item }">
          <v-chip
            small
            :color="
              item.accept == null
                ? 'default'
                : item.accept
                ? 'success'
                : 'error'
            "
          >
            {{ item.accept == null ? "غير معروف" : item.accept ? "نعم" : "لا" }}
          </v-chip>
        </template>
        <template v-slot:item.montahy="{ item }">
          <v-chip
            small
            :color="
              item.montahy == null
                ? 'default'
                : item.montahy
                ? 'success'
                : 'error'
            "
          >
            {{
              item.montahy == null ? "غير معروف" : item.montahy ? "نعم" : "لا"
            }}
          </v-chip>
        </template>
        <template v-slot:item.name="{ item }">
          <v-chip
            :text-color="item.type == 'مدنى' ? '' : 'primary'"
            color="transparent"
            :to="item.rakmAskrt ? `/soldiers_plus/${item.rakmAskrt}` : ''"
          >
            {{ item.name }}
          </v-chip>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "dbs-so-search",
  mounted() {
    // this.fillKeys();
    this.init();
  },
  data: () => ({
    tableFilters: {},
    loading: false,
    showToday: false,
    options: [
      {
        label: "طالب الخدمة",
        model: "type",
        type: "select"
      },
      {
        label: "الإسم",
        model: "name",
        type: "text"
      },
      {
        label: "الرقم القومي",
        model: "kawmy",
        type: "text"
      },
      {
        label: "العنوان",
        model: "address",
        type: "text"
      },
      {
        label: "الرقم العسكري",
        model: "rakmAskrt",
        type: "text"
      },
      {
        label: "رقم الهاتف",
        model: "phone",
        type: "text"
      },
      {
        label: "الدرجة",
        model: "degreeId",
        type: "select"
      },
      {
        label: "القسم",
        model: "kesmId",
        type: "select"
      },
      {
        label: "المختص",
        model: "mo5TasId",
        type: "select"
      },
      {
        label: "درجة الأهمية",
        model: "ahmeya",
        type: "select"
      },
      {
        label: "ما تم تنفيده",
        model: "matam",
        type: "text"
      },
      {
        label: "ملاحظات",
        model: "notes",
        type: "text"
      },
      {
        label: "سبب الإنهاء",
        model: "enha2",
        type: "select"
      },
      {
        label: "وقت الدخول",
        model: "timeEnter",
        type: "date"
      },
      {
        label: "وقت القبول",
        model: "timeAccept",
        type: "date"
      },
      {
        label: "وقت الإنهاء",
        model: "timeEnha2",
        type: "date"
      },
      {
        label: "طلب مقبول",
        model: "accept",
        type: "checkbox"
      },
      {
        label: "طلب منتهي",
        model: "montahy",
        type: "checkbox"
      },
      {
        label: "متابع",
        model: "motab3A",
        type: "checkbox"
      }
    ],
    selects: {
      khedma: {
        table: "tasks",
        text: "khedma",
        value: "khedma",
        attrs: ["khedma"]
      },
      enha2: {
        localTable: "endTermReasons",
        text: "displayedText",
        value: "displayedText", // TODO:: A7A - Fix this
        attrs: ["displayedText", "id"]
      },
      ahmeya: {
        localTable: "priorities",
        text: "displayedText",
        value: "displayedText", // TODO:: A7A - Fix this
        attrs: ["displayedText", "id"]
      },
      mo5TasId: {
        table: "mo5Tasen",
        text: "name",
        value: "id",
        attrs: ["name", "id", "kesmId"]
      },
      kesmId: {
        table: "aksams",
        text: "name",
        value: "id",
        attrs: ["name", "id"]
      },
      degreeId: {
        table: "degrees",
        text: "degreeText",
        value: "degreeId",
        attrs: ["degreeText", "degreeId"]
      },
      type: {
        text: "t",
        value: "v",
        data: [
          {
            t: "عسكرى",
            v: "عسكرى"
          },
          {
            t: "مدنى",
            v: "مدنى"
          }
        ]
      }
    },
    search: {},
    dialogs: {},
    results: {
      search: "",
      selects: [],
      items: [],
      headers: [
        {
          text: "رقم الطلب",
          value: "id",
          sortable: true
        },
        {
          text: "وقت الدخول",
          value: "timeEnter",
          sortable: true
        },
        {
          text: "طالب الخدمة",
          value: "type",
          sortable: true
        },
        {
          text: "الإسم",
          value: "name",
          sortable: true
        },
        {
          text: "الخدمة المطلوبة",
          value: "khedma",
          sortable: true
        },
        {
          text: "الوحدة",
          value: "unit.unitText",
          sortable: true
        },
        {
          text: "القسم",
          value: "aksam.name",
          sortable: true
        },
        {
          text: "المختص",
          value: "mo5Tasen.name",
          sortable: true
        },
        {
          text: "الدرجة",
          value: "degree.degreeText",
          sortable: true
        },
        {
          text: "طلب مقبول",
          value: "accept",
          sortable: true
        },
        {
          text: "طلب منتهي",
          value: "montahy",
          sortable: true
        },
        {
          text: "سبب الإنهاء",
          value: "enha2",
          sortable: true
        },
        {
          text: "وقت الإنهاء",
          value: "timeEnha2",
          sortable: true
        }
      ]
    }
  }),
  methods: {
    searchRequestsToday(showToday = false) {
      this.$set(this, "showToday", showToday);
      this.searchRequests();
    },
    async searchRequests() {
      this.$set(this, "loading", true);
      let showToday = this.showToday,
        search = this.search,
        likes = ["name", "address", "khedma", "matam", "notes"],
        dateExploder = "-date-",
        where = {};
      Object.keys(search).forEach(key => {
        let val = search[key];
        if (val || val === false || val === 0) {
          if (likes.includes(key)) {
            where[key] = {
              $like: `${val}%`
            };
          } else if (key.includes(dateExploder)) {
            let explode = key.split(dateExploder),
              nkey = explode[0],
              n = explode[1],
              nval_1 = n == "1" ? val : search[nkey + dateExploder + "1"],
              nval_2 = n == "2" ? val : search[nkey + dateExploder + "2"];
            where[nkey] =
              nval_1 && nval_2
                ? {
                    $between: [nval_1, nval_2]
                  }
                : nval_1 && !nval_2
                ? {
                    $gte: nval_1
                  }
                : {
                    $lte: nval_2
                  };
          } else {
            if (["yes", "no"].includes(val)) {
              where[key] = val == "yes" ? true : false;
            } else {
              where[key] = val;
            }
          }
        }
      });
      // console.log(where);
      let items = await this.api(
        "global/get_all",
        {
          table: "tasks",
          where: showToday
            ? {
                timeEnter: {
                  $between: [
                    new Date(new Date().toISOString().substring(0, 10)),
                    new Date(
                      new Date(new Date().setDate(new Date().getDate() + 1))
                        .toISOString()
                        .substring(0, 10)
                    )
                  ]
                }
              }
            : where,
          include: [
            {
              model: "units"
            },
            {
              model: "aksams"
            },
            {
              model: "mo5Tasen"
            },
            {
              model: "degrees"
            }
          ]
        },
        "so"
      );
      this.$set(
        this.results,
        "items",
        this.fixDates(items.data, ["timeEnha2", "timeEnter"])
      );
      this.$set(this, "loading", false);
    },
    init(specificTable = "") {
      // Get selects
      Object.keys(this.selects).forEach(key => {
        let { table, localTable, attrs } = this.selects[key];
        if (table) {
          let obj = {
            table
          };
          if (attrs && attrs.length > 0) {
            obj.attrs = attrs;
          }
          this.$set(this.selects[key], "loading", true);
          this.api("global/get_all", obj, "so")
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
