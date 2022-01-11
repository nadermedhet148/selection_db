<template>
  <div>
    <!-- 
      - Soldiers : Non-Commesioned
      - Soldier Types [ كاتب - صف - سائق - الخ ]
      - Non-Commesioned Types
      - Up-Comming Radeef Dof3a Types
      - Users Usage over last week [ Or any week ] -- {{Done}}
      - Sections Usage over last week
      - Ignorant Types in a specific unit, zone and in general
      - Duty States or Ended Duty States -- {{Done}}
    -->
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
            </v-card-text>
          </v-card>
        </v-col>
      </template>
    </v-row>
  </div>
</template>

<script>
export default {
  name: "admin-stats",
  mounted() {
    this.soldier_ended_duty_status();
    this.users_usage();
    this.soldier_general_duty_status();
  },
  components: {
    StatsPie: () => import("@/components/sections/admin/stats/pie.vue"),
    StatsLine: () => import("@/components/sections/admin/stats/line.vue")
  },
  data: () => ({
    charts: {
      soldier_general_duty_status: {
        title: "حالة المجندين العامة",
        desc:
          "عرض رسم بياني يوضح عدد المجندين بالخدمة, بالمقارنة مع المنقولين على الإحتياط والمنتهي خدمتهم لأسباب.",
        loading: true,
        labels: [
          "بالخدمة",
          "نقل على الإحتياط",
          "منتهي لأسباب",
          "غير مسجل له أي شيء"
        ],
        series: [],
        expand: false,
        type: "pie"
      },
      soldier_ended_duty_status: {
        title: "المجندين المنتهي خدمتهم لأسباب",
        desc:
          "عرض رسم بياني يوضح عدد المجندين المنتهي خدمتهم لأسباب, كل سبب بلون مختلف ونسبته بين باقي الأسباب.",
        loading: true,
        labels: [],
        series: [],
        expand: false,
        type: "pie"
      },
      users_usage: {
        title: "المستخدمين المفعلين",
        desc:
          "عرض رسم بياني يوضح شغل المستخدمين الحاليين (غير المحذوفين) للمنظومة من حيث الإضافة والتعديل والحذف خلال الثلاثين يوماً الماضية.",
        loading: true,
        labels: [],
        series: [],
        categories: [], // Array of dates
        expand: true,
        fixedExpand: true,
        type: "line"
      }
    }
  }),
  methods: {
    async users_usage() {
      this.$set(this.charts.users_usage, "loading", true);
      let items = await this.api("sections/admin/stats/users_usage", {
        days: 30
      });
      if (items && items.ok && items.data) {
        this.$set(this.charts.users_usage, "categories", items.data.categories);
        this.$set(this.charts.users_usage, "series", items.data.series);
      } else {
        this.showError(`لم يعمل أحد خلال الـ ${days} يوماً الماضية.`);
      }
      this.$set(this.charts.users_usage, "loading", false);
    },
    async soldier_ended_duty_status() {
      this.$set(this.charts.soldier_ended_duty_status, "loading", true);
      let items = await this.api("global/withLiterals", {
          table: "dutyStates",
          where: {
            stateId: {
              $notIn: [101, 105]
            }
          },
          literals: [
            {
              query: `(
                    SELECT COUNT(*)
                    FROM conscriptes AS conscripte
                    WHERE
                    conscripte.stateId = DutyStates.stateId
                    and
                    conscripte.typeId = 1
                )`,
              key: "consCounter"
            }
          ]
        }),
        itemsVals = items.data.map(m => m.consCounter),
        itemsText = items.data.map(m => m.text);
      this.$set(this.charts.soldier_ended_duty_status, "labels", itemsText);
      this.$set(this.charts.soldier_ended_duty_status, "series", itemsVals);
      this.$set(this.charts.soldier_ended_duty_status, "loading", false);
    },
    async soldier_general_duty_status() {
      this.$set(this.charts.soldier_general_duty_status, "loading", true);
      let inService = await this.api("global/count", {
          table: "conscriptes",
          where: {
            typeId: 1,
            stateId: 101
          }
        }),
        e7tayt = await this.api("global/count", {
          table: "conscriptes",
          where: {
            typeId: 1,
            stateId: 105
          }
        }),
        others = await this.api("global/count", {
          table: "conscriptes",
          where: {
            typeId: 1,
            stateId: {
              $and: [
                {
                  $not: null
                },
                {
                  $notIn: [101, 105]
                }
              ]
            }
          }
        }),
        nulls = await this.api("global/count", {
          table: "conscriptes",
          where: {
            typeId: 1,
            stateId: {
              $is: null
            }
          }
        }),
        all = [inService.data, e7tayt.data, others.data, nulls.data];
      this.$set(this.charts.soldier_general_duty_status, "series", all);
      this.$set(this.charts.soldier_general_duty_status, "loading", false);
    }
  }
};
</script>
