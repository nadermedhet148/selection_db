<template>
  <div>
    <template v-for="(card, i) in cards">
      <v-card
        class="mb-8"
        :key="i"
        :loading="card.loading"
        :disabled="card.loading"
      >
        <v-card-title>
          {{ card.title }}
          <v-spacer></v-spacer>
          <printer-menu
            :disabled="card.items.length == 0"
            :data="card.printer"
            :fab="false"
          ></printer-menu>
        </v-card-title>
        <v-card-subtitle>
          {{ card.desc }}
        </v-card-subtitle>
        <v-divider></v-divider>
        <v-data-table
          hide-default-header
          fixed-header
          :items="card.items"
          :headers="
            newHeaders[i]
              ? newHeaders[i].filter(h => !h.onlyFor || h.onlyFor == i)
              : []
          "
          multi-sort
          @current-items="tableUpdated"
          ref="mainTable"
        >
          <template v-slot:header="table">
            <table-header-filters
              :items="card.items"
              :table="table"
              :filters.sync="tableFilters[i]"
            ></table-header-filters>
          </template>
          <template v-slot:footer="table">
            <table-footer-filters
              :filters.sync="tableFilters[i]"
              :table="table"
            ></table-footer-filters>
          </template>
          <template v-slot:item.conscripte.militaryId="{ item }">
            <v-chip
              color="transparent"
              :to="`/ended_duty_main_data/${item.conscripte.militaryId}`"
              @click.right="copyText(item.conscripte.militaryId)"
            >
              {{ item.conscripte.militaryId }}
            </v-chip>
          </template>
          <template v-slot:item.conscripte.fullName="{ item }">
            <v-chip
              color="transparent"
              :to="`/ended_duty_main_data/${item.conscripte.militaryId}`"
              @click.right="copyText(item.conscripte.fullName)"
            >
              {{ item.conscripte.fullName }}
            </v-chip>
          </template>
          <template v-slot:item.militaryId="{ item }">
            <v-chip
              color="transparent"
              :to="`/ended_duty_main_data/${item.militaryId}`"
              @click.right="copyText(item.militaryId)"
            >
              {{ item.militaryId }}
            </v-chip>
          </template>
          <template v-slot:item.fullName="{ item }">
            <v-chip
              color="transparent"
              :to="`/ended_duty_main_data/${item.militaryId}`"
              @click.right="copyText(item.fullName)"
            >
              {{ item.fullName }}
            </v-chip>
          </template>
        </v-data-table>
      </v-card>
    </template>
  </div>
</template>

<script>
export default {
  name: "EnhaaCounters",
  mounted() {
    this.getItems(this.cards.length);
    this.setNewHeaders(this.headers, this.cards.length);
  },
  data: () => ({
    tableFilters: {
      0: {},
      1: {},
      2: {},
      3: {},
      4: {},
      5: {}
    },
    cards: [
      {
        title: "الجدول الأول",
        desc: "يقوم بعرض من هو بالخدمة من المجندين ولديه محكمة أكثر من سنة",
        items: [],
        printer: {},
        loading: false
      },
      {
        title: "الجدول الثاني",
        desc:
          "يقوم بعرض من هو بالخدمة من  لديه محكمة أكثر من 6 أشهر",
        items: [],
        printer: {},
        loading: false
      },
      {
        title: "الجدول الثالث",
        desc: "يقوم بعرض المنتهي خدمته ولم يدرج له سبب إنهاء",
        items: [],
        printer: {},
        loading: false
      }
      // {
      //   title: "الجدول الثالث",
      //   desc: "يقوم بعرض من ليس له قرار لجنة طبية",
      //   items: [],
      //   printer: {},
      //   loading: false
      // },
      // {
      //   title: "الجدول الرابع",
      //   desc: "يقوم بعرض من هو بالخدمة",
      //   items: [],
      //   printer: {},
      //   loading: false
      // },
    ],
    newHeaders: [],
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
        text: "",
        value: "actions",
        sortable: false
      }
    ]
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
            this.cards[i].printer.cons = sorted;
          }
        }
      }
    },
    setNewHeaders(headers, length) {
      for (let i = 0; i < length; i++) {
        this.$set(this.newHeaders, i, {});
        let newHeaders = [];
        [...headers].forEach(header => {
          newHeaders.push({ ...header });
        });
        this.$set(this.newHeaders, i, [...newHeaders]);
      }
    },
    async getItems(length) {
      for (let i = 0; i < length; i++) {
        this.$set(this.cards[i], "loading", true);
      }
      let now = new Date(),
        pastYear = new Date(new Date(now).setFullYear(now.getFullYear() - 1)),
        past13Years = new Date(
          new Date(now).setFullYear(now.getFullYear() - 13)
        );
      // let s1 = await this.api("global/get_all", {
      //   table: "conscriptes",
      //   where: {
      //     stateIdCurrent: 1
      //   },
      //   include: [
      //     {
      //       model: "units"
      //     },
      //     {
      //       model: "degrees"
      //     },
      //     {
      //       model: "medicalCommittees",
      //       where: {
      //         comitDecisionId: 2
      //       }
      //     }
      //   ]
      // });
      // let fixedItems1 = this.fixDates(s1.data, []);
      // let printer1 = {
      //   cons: fixedItems1,
      //   excelKey: "cons",
      //   excelHeaders: this.headers
      // };
      // this.$set(this.cards[0], "items", fixedItems1);
      // this.$set(this.cards[0], "printer", printer1);
      // this.$set(this.cards[0], "loading", false);
      let s2 = await this.api("global/get_all", {
        table: "conscriptes",
        where: {
          stateIdCurrent: 1,
          typeId: 1,
          "$courts.CourtConfermation$": {
            $or: {
              $not: 2,
              $is: null
            }
          },
          $and: [
            {
              $or: [
                {
                  "$courts.ContDuty$": false
                },
                {
                  "$courts.ContDuty$": {
                    $is: null
                  }
                }
              ]
            },
            {
              $or: [
                {
                  "$courts.P_Year$": {
                    $gte: 1
                  }
                },
                {
                  "$courts.P_Year$": 1,
                  $and: {
                    $or: [
                      {
                        "$courts.P_Month$": {
                          $gt: 0
                        }
                      },
                      {
                        "$courts.P_Day$": {
                          $gte: 0
                        }
                      }
                    ]
                  }
                }
              ]
            }
          ]
        },
        include: [
          {
            model: "units"
          },
          {
            model: "degrees"
          },
          {
            model: "courts",
            required: true
          }
        ]
      });
      let fixedItems2 = this.fixDates(s2.data, []);
      let printer2 = {
        cons: fixedItems2,
        excelKey: "cons",
        excelHeaders: this.headers
      };
      this.$set(this.cards[0], "items", fixedItems2);
      this.$set(this.cards[0], "printer", printer2);
      this.$set(this.cards[0], "loading", false);
      let s4 = await this.api("global/get_all", {
        table: "conscriptes",
        where: {
          stateIdCurrent: 1,
          typeId: 2,
          "$courts.CourtConfermation$": {
            $or: {
              $not: 2,
              $is: null
            }
          },
          $and: [
            {
              $or: [
                {
                  "$courts.ContDuty$": false
                },
                {
                  "$courts.ContDuty$": {
                    $is: null
                  }
                }
              ]
            },
            {
              $or: [
                {
                  "$courts.P_Month$": {
                    $gte: 6
                  }
                },
                {
                  "$courts.P_Month$": {
                    $lte: 6
                  },
                  "$courts.P_Year$": {
                    $gte: 1
                  },
                  "$courts.P_Day$": {
                    $gte: 0
                  }
                }
              ]
            }
          ]
        },
        include: [
          {
            model: "units"
          },
          {
            model: "degrees"
          },
          {
            model: "courts",
            required: true
          }
        ]
      });
      let fixedItems4 = this.fixDates(s4.data, []);
      let printer4 = {
        cons: fixedItems4,
        excelKey: "cons",
        excelHeaders: this.headers
      };
      this.$set(this.cards[1], "items", fixedItems4);
      this.$set(this.cards[1], "printer", printer4);
      this.$set(this.cards[1], "loading", false);
      let s5 = await this.api("global/get_all", {
        table: "conscriptes",
        where: {
          /**
           * كان عندنا في جدول DutyStates
           * خانة اسمها "لم يدرج" يعني سبب إنهاء الشخص دا مش موجود في المنظومة
           * فـ مسحنا الخانة دي وحطينا isLamYodraj
           * عشان نقدر نخلي مكتب الإنهاء يشتغل على الناس دي ويشوف ايه سبب إنهائهم
           * بمجرد ما يخلص الناس اللي واخدة الـ property دي
           * هنمسحها من الداتابيز
           */
          isLamYodraj: true,
          stateId: null
        },
        include: [
          {
            model: "units"
          },
          {
            model: "degrees"
          }
        ]
      });
      let fixedItems5 = this.fixDates(s5.data, []);
      let printer5 = {
        cons: fixedItems5,
        excelKey: "cons",
        excelHeaders: this.headers
      };
      this.$set(this.cards[2], "items", fixedItems5);
      this.$set(this.cards[2], "printer", printer5);
      this.$set(this.cards[2], "loading", false);
      // let s3 = await this.api("global/get_all", {
      //   table: "conscriptes",
      //   where: {
      //     stateIdCurrent: 1,
      //     stateId: 129
      //   },
      //   include: [
      //     {
      //       model: "units"
      //     },
      //     {
      //       model: "degrees"
      //     }
      //   ]
      // });
      // let fixedItems3 = this.fixDates(s3.data, []);
      // let printer3 = {
      //   cons: fixedItems3,
      //   excelKey: "cons",
      //   excelHeaders: this.headers
      // };
      // this.$set(this.cards[2], "items", fixedItems3);
      // this.$set(this.cards[2], "printer", printer3);
      // this.$set(this.cards[2], "loading", false);
    }
  }
};
</script>
