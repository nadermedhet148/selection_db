<template>
  <div>
    <v-card :loading="searchLoading" :disabled="searchLoading">
      <v-card-text>
        <v-row>
          <template v-for="(h, i) in mainTable.headers.filter(h => h.inSearch)">
            <v-col v-if="h.type !== 'date'" :key="i" cols="6" lg="4">
              <v-autocomplete
                v-if="h.type == 'select'"
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
            </v-col>
          </template>
        </v-row>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions class="px-4 py-4">
        <v-btn
          class="px-6"
          @click="calculateStats()"
          large
          color="primary"
          v-text="'انشاء الاحصائيات'"
        ></v-btn>
      </v-card-actions>
    </v-card>

    <v-spacer></v-spacer>

    <v-row>
      <template v-for="(c, key, i) in charts">
        <v-col :key="i" cols="12" :xl="c.expand ? '12' : '6'">
          <v-card :loading="c.loading" class="mb-8">
            <v-card-title class="pb-2">
              {{ c.title }}
              <v-spacer></v-spacer>
              <v-btn
                :disabled="c.fixedExpand ? true : false"
                icon
                @click="c.expand = !c.expand"
              >
                <v-icon
                  >mdi-{{
                    c.expand ? "arrow-collapse-horizontal" : "arrow-expand"
                  }}
                </v-icon>
              </v-btn>
            </v-card-title>
            <v-card-text v-text="c.desc"></v-card-text>
            <v-divider></v-divider>
            <v-card-text>
              <stats-pie
                v-if="c.type == 'pie' && !c.loading"
                :labels="c.labels"
                :series="c.series"
                :height="c.expand ? '700' : '400'"
              ></stats-pie>
              <stats-line
                v-else-if="c.type == 'line' && !c.loading"
                :labels="c.labels"
                :categories="c.categories"
                :series="c.series"
                :height="c.expand ? '700' : '400'"
              ></stats-line>
              <bar-line
                v-else-if="c.type == 'bar' && !c.loading"
                :labels="c.labels"
                :categories="c.categories"
                :series="c.series"
                :height="c.expand ? '700' : '400'"
              ></bar-line>
            </v-card-text>
          </v-card>
        </v-col>
      </template>
    </v-row>
  </div>
</template>

<script>
const lodash = require("lodash");
import constants from "./../../assets/constants.json";

export default {
  name: "admin-stats",
  mounted() {
    this.selects.RecuStage.data = lodash.flattenDeep(
      this.$store.state.constants.years
        .sort((a, b) => b - a)
        .map(year =>
          this.$store.state.constants.RecuStage.data.map(stage => ({
            text: `${stage.text}-${year}`
          }))
        )
    );
  },
  components: {
    StatsPie: () => import("@/components/sections/admin/stats/pie.vue"),
    StatsLine: () => import("@/components/sections/admin/stats/line.vue"),
    BarLine: () => import("@/components/sections/admin/stats/bar.vue")
  },
  data: () => ({
    charts: {
      days_plan: {
        title: "مقارنة المراحل",
        desc: "عرض رسم بياني يوضح عدد المجندين التي تم اختبارهم في كل مرحلة.",
        loading: true,
        categories: [],
        series: [],
        expand: false,
        type: "line"
      }
    },
    search: {},
    searchLoading: false,
    mainTable: {
      headers: [
        {
          text: "المرحلة التجندية",
          value: "RecuStage",
          searchValue: "RecuStage",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: false,
          multiple: true,
          inModel: false,
          readonly: true,
          sort: 1
        }
      ],
      items: [],
      printer: {}
    },
    selects: {
      RecuStage: {
        text: "text",
        value: "text",
        data: lodash.flattenDeep(
          constants.years.map(year =>
            constants.RecuStage.data.map(stage => `${stage.text}-${year}`)
          )
        )
      }
    }
  }),
  methods: {
    async calculateStats() {
      if (!this.search.RecuStage) {
        return this.showError(`برجاء اختيار المرحلة اولا`);
      }
      let items = await this.api("global/get_all", {
        table: "Soldier",
        where: {
          RecuStage: {
            $in: this.search.RecuStage
          }
        },
        include: [
          {
            model: "Notes"
          }
          //   {
          //     model: "Action"
          //   }
        ]
      });
      if (items && items.ok && items.data) {
        let dataFlatted = lodash.flattenDeep(
          items.data.map(ele => ele.Actions)
        );
        let groupedDataByRecuStage = lodash.groupBy(
          items.data,
          ele => ele.RecuStage
        );

        this.$set(this.charts.days_plan, "series", [
          {
            name: "ملحوظ",
            data: Object.values(groupedDataByRecuStage).map(
              data => data.filter(ele => ele.Notes.length > 0).length
            )
          },
          {
            name: "لائق",
            data: Object.values(groupedDataByRecuStage).map(
              data => data.filter(ele => ele.Notes.length == 0).length
            )
          }
        ]);

        this.$set(
          this.charts.days_plan,
          "categories",
          Object.keys(groupedDataByRecuStage)
        );
      } else {
        this.showError(`لم يعمل أحد خلال الـ ${days} يوماً الماضية.`);
      }
      this.$set(this.charts.days_plan, "loading", false);
    }
  }
};
</script>
