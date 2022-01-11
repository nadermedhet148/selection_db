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
          fixed-header
          :items="card.items"
          :headers="
            newHeaders[i]
              ? newHeaders[i].filter(h => !h.onlyFor || h.onlyFor == i)
              : []
          "
          hide-default-header
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
              :to="`/soldiers_plus/${item.conscripte.militaryId}`"
              @click.right="copyText(item.conscripte.militaryId)"
            >
              {{ item.conscripte.militaryId }}
            </v-chip>
          </template>
          <template v-slot:item.conscripte.fullName="{ item }">
            <v-chip
              color="transparent"
              :to="`/soldiers_plus/${item.conscripte.militaryId}`"
              @click.right="copyText(item.conscripte.fullName)"
            >
              {{ item.conscripte.fullName }}
            </v-chip>
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
        </v-data-table>
      </v-card>
    </template>
  </div>
</template>

<script>
export default {
  name: "EhtyatCounters",
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
        desc: "يقوم بعرض من تم نقله على الإحتياط ولديه إصابة أو محكمة متابعة",
        items: [],
        printer: {},
        loading: false
      },
      {
        title: "الجدول الثاني",
        desc:
          "يقوم بعرض من له إصابة متابعة أو مجلس طبي متابع, أو أمي, ولا يزال بالخدمة ومتبقي على تسريحه أقل من 6 أشهر",
        items: [],
        printer: {},
        loading: false
      }
      // {
      //   title: "الجدول الثالث",
      //   desc:
      //     "يقوم بعرض الأمي الذي لم يسجل له مؤيد محو أمية - ويظهر هنا من بعد تاريخ تجنيده بـ 3 أشهر",
      //   items: [],
      //   printer: {},
      //   loading: false
      // },
      // {
      //   title: "الجدول الرابع",
      //   desc: "يعرض من يستحق التسريح ولم يسرح حتى الآن",
      //   items: [],
      //   printer: {},
      //   loading: false
      // }
    ],
    newHeaders: {},
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
        text: "تاريخ التجنيد",
        value: "conscriptionDate",
        sortable: true
      },
      {
        text: "تاريخ التسريح",
        value: "demobilizationDate",
        sortable: true
      },
      {
        text: "الموقف",
        value: "bayan",
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
        ),
        past1Month = new Date(new Date(now).setMonth(now.getMonth() - 1)),
        past3Months = new Date(new Date(now).setMonth(now.getMonth() - 3)),
        next1Month = new Date(new Date(now).setMonth(now.getMonth() + 1)),
        next6Months = new Date(new Date(now).setMonth(now.getMonth() + 6));
      let s1 = await this.api("global/get_all", {
        table: "conscriptes",
        where: {
          typeId: 1,
          demobilizationDate: {
            $lte: now
            // $and: {
            // $gte: new Date("2020-01-01"),
            // }
          },
          stateId: 105,
          $and: {
            $or: [
              {
                "$injuries.InjuryId$": {
                  $not: null
                },
                "$injuries.HealingReportId$": {
                  $is: null
                }
              },
              {
                "$courts.NotFollowingEhtyat$": false,
                "$courts.Judgment$": {
                  $is: null
                }
              }
            ]
          }
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
            required: false
          },
          {
            model: "injuries",
            required: false
          },
          {
            model: "ignorants",
            required: false
          },
          {
            model: "medicalCommittees",
            required: false
          }
        ]
      });
      console.log("s1", s1);
      s1.data.forEach(con => {
        con.bayan = [];
        if (con.ignorantId == 1 && con.qualificationId == 0) {
          con.bayan.push("أمي");
        }
        if (con.courts && con.courts.length > 0) {
          con.bayan.push("محكمة");
        }

        if (con.injuries && con.injuries.length > 0) {
          con.bayan.push("إصابة");
        }
        if (con.medicalCommittees && con.medicalCommittees.length > 0) {
          con.bayan.push("لجنه طبية");
        }
        if ((con.fugitives && con.fugitives.length > 0) || con.stateId == 102) {
          con.bayan.push("هروب");
        }
      });
      let fixedItems1 = this.fixDates(s1.data, [
        "conscriptionDate",
        "demobilizationDate"
      ]);

      let printer1 = {
        cons: fixedItems1,
        excelKey: "cons",
        excelHeaders: this.headers
      };
      this.$set(this.cards[0], "items", fixedItems1);
      this.$set(this.cards[0], "printer", printer1);
      this.$set(this.cards[0], "loading", false);
      let s2 = await this.api("global/get_all", {
        table: "conscriptes",
        where: {
          typeId: 1,
          demobilizationDate: {
            // قبل تسريحه بـ 6 شهور
            $between: [now, next6Months]
            // $and: {
            // $gte: new Date("2020-01-01"),
            // }
          },
          $and: [
            {
              $or: [
                {
                  stateId: 101
                },
                {
                  stateIdCurrent: 1
                }
              ]
            },
            {
              $or: [
                {
                  // ليس له تقرير شفاء نهائي
                  "$injuries.InjuryId$": {
                    $not: null
                  },
                  "$injuries.HealingReportId$": {
                    $or: {
                      $is: null,
                      $eq: 2
                    }
                  }
                },
                {
                  ignorantId: 1,
                  qualificationId: 0
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
            required: false
          },
          {
            model: "injuries",
            required: false
          },
          {
            model: "ignorants",
            required: false
          },
          {
            model: "medicalCommittees",
            required: false
          }
        ]
      });

      s2.data.forEach(con => {
        con.bayan = [];
        if (con.ignorantId == 1 && con.qualificationId == 0) {
          con.bayan.push("أمي");
        }
        if (con.courts && con.courts.length > 0) {
          con.bayan.push("محكمة");
        }

        if (con.injuries && con.injuries.length > 0) {
          con.bayan.push("إصابة");
        }
        if (con.medicalCommittees && con.medicalCommittees.length > 0) {
          con.bayan.push("لجنه طبية");
        }
        if ((con.fugitives && con.fugitives.length > 0) || con.stateId == 102) {
          con.bayan.push("هروب");
        }
      });

      let fixedItems2 = this.fixDates(s2.data, [
        "conscriptionDate",
        "demobilizationDate"
      ]);
      let printer2 = {
        cons: fixedItems2,
        excelKey: "cons",
        excelHeaders: this.headers
      };

      this.$set(this.cards[1], "items", fixedItems2);
      this.$set(this.cards[1], "printer", printer2);
      this.$set(this.cards[1], "loading", false);
    }
  }
};
</script>
