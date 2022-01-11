<template>
  <div>
    <v-dialog
      v-if="isCurrentRoute(componentName)"
      scrollable
      :persistent="!search.model_reselct"
      v-model="search.model"
      max-width="450"
    >
      <v-card>
        <v-card-title>
          من فضلك حدد نطاق البحث
          <v-spacer></v-spacer>
          <v-btn icon @click="goThere('/'), deleteRouteByName(componentName)">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-subtitle class="pt-2">
          التحديد يكون بتاريخ التسريح
        </v-card-subtitle>
        <v-divider></v-divider>
        <v-card-text class="pt-6">
          <template v-for="(item, i) in ['from', 'to']">
            <v-text-field
              type="date"
              :key="i"
              filled
              v-model="search[item]"
              :hint="`تاريخ ${i == 0 ? 'بداية' : 'نهاية'} البحث`"
              persistent-hint
              :label="i == 0 ? 'من' : 'الى'"
            ></v-text-field>
          </template>
        </v-card-text>
        <v-card-actions class="px-4">
          <v-spacer></v-spacer>
          <v-btn
            @click="search.model_reselct ? (search.model = false) : goBack()"
            large
            color="primary"
            outlined
            class="px-6"
          >
            رجوع
          </v-btn>
          <v-btn @click="getCons()" large color="primary" class="px-6">
            بحث
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-card>
      <v-card-title>
        أفراد لهم بيانات ناقصة
        <v-spacer></v-spacer>
        <v-menu
          transition="slide-y-transition"
          bottom
          :close-on-content-click="false"
        >
          <template v-slot:activator="{ on }">
            <v-btn v-on="on">
              تخصيص
              <v-icon class="ms-2">mdi-chevron-down</v-icon>
            </v-btn>
          </template>
          <v-list min-width="250">
            <v-list-item-group v-model="results.filterBy" multiple>
              <template v-for="(head, i) in results.headers">
                <v-list-item
                  active-class="blue lighten-5 primary--text"
                  :key="i"
                  :value="head.filterBy"
                >
                  <v-list-item-content>
                    <v-list-item-title v-text="head.text"></v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-icon
                      color="primary"
                      v-if="results.filterBy.includes(head.filterBy)"
                      >mdi-checkbox-marked-circle-outline</v-icon
                    >
                  </v-list-item-action>
                </v-list-item>
              </template>
            </v-list-item-group>
          </v-list>
        </v-menu>
      </v-card-title>
      <v-card-text>
        عرض من {{ search.from }} الى {{ search.to }}
        <v-btn
          color="primary"
          icon
          @click="(search.model = true), (search.model_reselct = true)"
        >
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
      </v-card-text>
      <v-divider></v-divider>
      <!-- <v-text-field
        prepend-inner-icon="mdi-magnify"
        v-model.lazy="results.search"
        filled
        dense
      ></v-text-field> -->
      <v-data-table
        class="empty-cells-table"
        :headers="results.headers"
        :items="computedItems"
        fixed-header
        :search.sync="results.search"
        v-model="results.selected"
        :loading="results.loading"
        hide-default-header
        multi-sort
      >
        <template v-slot:header="table">
          <table-header-filters
            :items="computedItems"
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
  name: "missed_data_admin",
  computed: {
    computedItems() {
      let items = this.results.items,
        filters = this.results.filterBy;
      if (filters && filters.length > 0) {
        filters.forEach(filter => {
          items = items.filter(f => !f[filter]);
        });
      }
      return items;
    }
  },
  data: () => ({
    componentName: "missed_data_admin",
    tableFilters: {},
    results: {
      loading: false,
      selected: [],
      items: [],
      filterBy: [],
      headers: [
        {
          text: "الرقم العسكري",
          value: "militaryId",
          filterBy: "militaryId",
          sortable: true
        },
        {
          text: "الدرجة",
          value: "degree.degreeType",
          filterBy: "degreeId",
          sortable: true
        },
        {
          text: "الإسم",
          value: "fullName",
          filterBy: "fullName",
          sortable: true
        },
        {
          text: "تاريخ التجنيد",
          value: "conscriptionDate",
          filterBy: "conscriptionDate",
          sortable: true
        },
        {
          text: "الوحدة",
          value: "unit.unitText",
          filterBy: "unitId",
          sortable: true
        },
        {
          text: "حالة الفرد",
          value: "dutyCurrentState.text",
          filterBy: "stateIdCurrent",
          sortable: true
        }
      ],
      search: ""
    },
    search: {
      model: true,
      model_reselct: false,
      from: new Date().toISOString().substring(0, 10),
      to: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
        .toISOString()
        .substring(0, 10)
    }
  }),
  methods: {
    async getCons() {
      this.$set(this.results, "loading", true);
      this.$set(this.search, "model", false);
      let { from, to } = this.search,
        items = await this.api("global/get_all", {
          table: "conscriptes",
          where: {
            $or: [
              {
                militaryId: ""
              },
              {
                fullName: {
                  $or: {
                    $is: null,
                    $eq: ""
                  }
                }
              },
              // {
              //   $and: [
              //     {
              //       degreeId: {
              //         $is: null
              //       }
              //     },
              //     {
              //       webDegreeId: {
              //         $is: null
              //       }
              //     }
              //   ]
              // },
              {
                $and: [
                  {
                    unitId: {
                      $is: null
                    }
                  },
                  {
                    webUnitId: {
                      $is: null
                    }
                  }
                ]
              }
            ]
          },
          include: [
            {
              model: "units",
              required: false
            },
            {
              model: "degrees",
              required: false
            },
            {
              model: "dutyCurrentStates",
              required: false
            }
          ]
        });
      if (items && items.ok && items.data) {
        let fixedData = this.fixDates(items.data, [
          "demobilizationDate",
          "conscriptionDate"
        ]);
        fixedData.forEach(el => {
          el.fullName = el.fullName ? el.fullName.trim() : "";
        });
        this.$set(this.results, "items", fixedData);
      } else {
        this.showError("حدث خطأ أثناء الإتصال بقاعدة البيانات.");
      }
      this.$set(this.results, "loading", false);
    }
  }
};
</script>
