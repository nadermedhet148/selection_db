<template>
  <div>
    <v-dialog
      v-if="isCurrentRoute(componentName)"
      v-model="search.model"
      :persistent="query && query.length > 0 ? false : true"
      scrollable
      max-width="450"
    >
      <v-card>
        <v-card-title :class="'primary white--text'">
          <v-btn dark v-if="window > 0" icon @click="window = 0" class="me-4">
            <v-icon>mdi-keyboard-backspace mdi-rotate-180</v-icon>
          </v-btn>
          {{
            window > 0 && windows[0][window] && windows[0][window].title
              ? windows[0][window].title
              : "التقارير"
          }}
          <v-spacer></v-spacer>
          <v-btn
            dark
            icon
            @click="
              query && query.length > 0
                ? (search.model = false)
                : (goThere('/'), deleteRouteByName(componentName))
            "
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="px-0">
          <v-window v-model="window">
            <template v-for="(wins, ii) in windows">
              <v-window-item :key="ii">
                <v-list>
                  <v-list-item-group v-model="window">
                    <template v-for="(w, i) in wins">
                      <v-list-item
                        :disabled="w.disabled"
                        class="wrap"
                        :value="w.window ? w.window : 99"
                        @click="w.click ? searchReports(w.click) : () => {}"
                        :key="i"
                      >
                        <v-list-item-avatar>
                          <v-icon
                            v-text="
                              w.icon ? w.icon : 'mdi-chart-timeline-variant'
                            "
                          ></v-icon>
                        </v-list-item-avatar>
                        <v-list-item-content>
                          <v-list-item-title
                            class=""
                            v-text="w.title"
                          ></v-list-item-title>
                          <v-list-item-subtitle
                            v-text="w.desc"
                          ></v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                      <v-divider :key="i + '_d'"></v-divider>
                    </template>
                  </v-list-item-group>
                </v-list>
              </v-window-item>
            </template>
            <v-window-item>
              <v-card-text>
                <v-autocomplete
                  label="الجيش / المنطقة"
                  hint="من فضلك قم بتحديد الجيش أو المنطقة."
                  persistent-hint
                  :items="zones.data"
                  :error-messages="zones.error"
                  :loading="zones.loading"
                  :append-icon="zones.error ? 'mdi-reload' : 'mdi-chevron-down'"
                  @click:append="initZones()"
                  item-text="zoneText"
                  item-value="zoneId"
                  v-model="search.zoneId"
                  filled
                ></v-autocomplete>
              </v-card-text>
            </v-window-item>
          </v-window>
        </v-card-text>
        <v-card-actions v-show="window == 2">
          <v-spacer></v-spacer>
          <v-btn
            v-text="'رجوع'"
            @click="window = 0"
            color="primary"
            outlined
            large
            class="px-6"
          ></v-btn>
          <v-btn
            v-text="'بحث'"
            @click="searchReports('get_zone_report')"
            color="primary"
            large
            class="px-6"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-card v-show="query && query.length > 0">
      <v-card-title>
        {{
          result.headers[query] && result.headers[query].title
            ? result.headers[query].title
            : "النتائج"
        }}
        <v-spacer></v-spacer>
        <v-btn icon @click="search.model = true">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <printer-menu
          :disabled="result.items.length == 0"
          :query="`tasgeel/${query}`"
          :data="
            result.headers[query] && result.headers[query].printer
              ? result.headers[query].printer
              : {}
          "
          :fab="false"
        ></printer-menu>
      </v-card-title>
      <v-divider></v-divider>
      <!-- <v-text-field
        prepend-inner-icon="mdi-magnify"
        v-model="result.search"
        filled
        dense
      > -->
      <!-- <template v-slot:append-outer>
          <table-header-filters
            @filteron="filteron"
            :headers="
              result.headers[query] ? result.headers[query].headers : []
            "
            :items.sync="result.items"
            :filter-key="'primary'"
          ></table-header-filters>
        </template> -->
      <!-- </v-text-field> -->
      <v-data-table
        :loading="loading"
        :headers="result.headers[query] ? result.headers[query].headers : []"
        :items="result.items"
        :search="result.search"
        hide-default-header
        multi-sort
      >
        <!-- <template v-slot:header="table">
          <table-header-groups
            :headers="table.props.headers"
            :groups="result.headers[query] ? result.headers[query].groups : []"
          ></table-header-groups>
        </template> -->
        <template v-slot:header="table">
          <table-header-groups
            :headers="table.props.headers"
            :groups="result.headers[query] ? result.headers[query].groups : []"
          ></table-header-groups>
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
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "TasgeelReports",
  mounted() {
    this.initZones();
  },
  data: () => ({
    componentName: "tasgeel_reports",
    tableFilters: {},
    query: null,
    loading: false,
    result: {
      search: "",
      items: [],
      headers: {
        global_zones_report: {
          headers: [
            {
              text: "المنطقة",
              value: "zoneText",
              sortable: false,
              group: "no-group"
            },
            {
              text: "كاتب",
              value: "writers",
              sortable: false,
              group: "no-group"
            },
            {
              text: "سائق",
              value: "drivers",
              sortable: false,
              group: "no-group"
            },
            {
              text: "إجمالي الصف",
              value: "sumAllSaf",
              sortable: false,
              group: "saf"
            },
            {
              text: "حدود",
              value: "guards",
              sortable: false,
              group: "saf"
            },
            {
              text: "مشاة",
              value: "walkers",
              sortable: false,
              group: "saf"
            },
            {
              text: "نظم",
              value: "programers",
              sortable: false,
              group: "saf"
            },
            {
              text: "موسيقى",
              value: "musicians",
              sortable: false,
              group: "saf"
            },
            {
              text: "الإجمالي",
              value: "sumAll",
              sortable: false,
              group: "no-group-2"
            }
          ],
          groups: [
            {
              title: "",
              id: "no-group"
            },
            {
              title: "صف",
              id: "saf"
            },
            {
              title: "",
              id: "no-group-2"
            }
          ],
          title: "عرض تقرير بالقوة العاملة ( جيوش / مناطق ) لحرس الحدود",
          printer: {}
        },
        global_security_report: {
          headers: [],
          groups: [],
          title: "",
          printer: {}
        },
        global_radeef_report: {
          headers: [],
          groups: [],
          title: "",
          printer: {}
        },
        get_zone_report: {
          headers: [],
          groups: [],
          title: "",
          printer: {}
        },
        global_report_soldiers: {
          headers: [
            {
              text: "كاتب",
              value: "writers",
              sortable: false,
              group: "no-group"
            },
            {
              text: "سائق",
              value: "drivers",
              sortable: false,
              group: "no-group"
            },
            {
              text: "إجمالي الصف",
              value: "sumAllSaf",
              sortable: false,
              group: "saf"
            },
            {
              text: "حدود",
              value: "guards",
              sortable: false,
              group: "saf"
            },
            {
              text: "مشاة",
              value: "walkers",
              sortable: false,
              group: "saf"
            },
            {
              text: "نظم",
              value: "programers",
              sortable: false,
              group: "saf"
            },
            {
              text: "موسيقى",
              value: "musicians",
              sortable: false,
              group: "saf"
            },
            {
              text: "الإجمالي",
              value: "sumAll",
              sortable: false,
              group: "no-group-2"
            }
          ],
          groups: [
            {
              title: "",
              id: "no-group"
            },
            {
              title: "صف",
              id: "saf"
            },
            {
              title: "",
              id: "no-group-2"
            }
          ],
          title: "عرض تقرير مجمل بقوة المجندين العاملين بحرس الحدود",
          printer: {}
        },
        global_report_noncom: {
          headers: [
            {
              text: "كاتب",
              value: "writers",
              sortable: false,
              group: "no-group"
            },
            {
              text: "سائق",
              value: "drivers",
              sortable: false,
              group: "no-group"
            },
            {
              text: "إجمالي الصف",
              value: "sumAllSaf",
              sortable: false,
              group: "saf"
            },
            {
              text: "حدود",
              value: "guards",
              sortable: false,
              group: "saf"
            },
            {
              text: "مشاة",
              value: "walkers",
              sortable: false,
              group: "saf"
            },
            {
              text: "نظم",
              value: "programers",
              sortable: false,
              group: "saf"
            },
            {
              text: "موسيقى",
              value: "musicians",
              sortable: false,
              group: "saf"
            },
            {
              text: "الإجمالي",
              value: "sumAll",
              sortable: false,
              group: "no-group-2"
            }
          ],
          groups: [
            {
              title: "",
              id: "no-group"
            },
            {
              title: "صف",
              id: "saf"
            },
            {
              title: "",
              id: "no-group-2"
            }
          ],
          title: "عرض تقرير مجمل بقوة   العاملين بحرس الحدود",
          printer: {}
        }
      }
    },
    search: {
      model: true,
      zoneId: null
    },
    zones: {
      loading: false,
      error: "",
      data: []
    },
    window: 0,
    windows: [
      [
        {
          title: "يومية عددية بإجمالي قوة ح ح",
          desc:
            "عرض تقرير مجمل بقوة المجندين أو   العاملين بحرس الحدود",
          window: 1
        },
        {
          title: "تقرير يومية عددية بقوة ح ح",
          desc: "عرض تقرير بالقوة العاملة ( جيوش / مناطق ) لحرس الحدود.",
          click: "global_zones_report"
        },
        {
          title: "تقارير يومية عددية مفصلة",
          desc:
            "اختيار جيش أو منطقة, وعرض تقرير يومية عددية للوحدات التابعة له.",
          window: 2,
          disabled: true
        },
        {
          title: "تقرير يومية عددية بقوة مج مخ وأمن ح ح",
          desc: "عرض تقرير يومية عددية بقوة مجموعة مخابرات وأمن حرس الحدود",
          click: "global_security_report",
          disabled: true
        },
        {
          title: "تقرير مجمع بالقوة لدفعات الرديف",
          desc: "عرض احصائية عددية لمستحقي التسريح بالوحدات",
          click: "global_radeef_report",
          disabled: true
        }
      ],
      [
        {
          title: "المجندين",
          desc: "عرض تقرير مجمل بقوة المجندين العاملين بحرس الحدود",
          click: "global_report_soldiers"
        },
        {
          title: " ",
          desc: "عرض تقرير مجمل بقوة ضباط الصف العاملين بحرس الحدود",
          click: "global_report_noncom"
        }
      ]
    ]
  }),
  methods: {
    searchReports(query = "") {
      this.$set(this, "loading", true);
      this.$set(this.result, "items", []);
      this.$set(this.search, "model", false);
      this.$set(this, "query", query);
      this.api(`sections/tasgeel/reports/${query}`, {
        search: this.search
      })
        .then(x => {
          let printer = {};
          switch (query) {
            case "global_report_soldiers":
            case "global_report_noncom":
              printer = x.data[0];
              break;
            case "global_zones_report":
              printer = {
                zones: [...x.data],
                excelKey: "zones",
                excelHeaders: this.result.headers[query].headers
              };
              break;
          }
          this.$set(this.result, "items", x.data);
          this.$set(this.result.headers[query], "printer", printer);
        })
        .catch(error => {
          console.log(error);
        })
        .finally(() => {
          this.$set(this, "loading", false);
        });
    },
    initZones() {
      this.$set(this.zones, "loading", true);
      this.api("global/get_all", {
        table: "zones"
      })
        .then(x => {
          this.$set(this.zones, "data", x.data);
        })
        .catch(error => {
          this.$set(
            this.zones,
            "error",
            "تعذر تحميل المناطق, من فضلك اضغط على زر إعادة تحميل المناطق في اليسار."
          );
        })
        .finally(() => {
          this.$set(this.zones, "loading", false);
        });
    }
  }
};
</script>
