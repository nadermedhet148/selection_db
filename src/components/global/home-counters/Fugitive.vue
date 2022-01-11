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
              :to="`/fugitives/${item.conscripte.militaryId}`"
              @click.right="copyText(item.conscripte.militaryId)"
            >
              {{ item.conscripte.militaryId }}
            </v-chip>
          </template>
          <template v-slot:item.conscripte.fullName="{ item }">
            <v-chip
              color="transparent"
              :to="`/fugitives/${item.conscripte.militaryId}`"
              @click.right="copyText(item.conscripte.fullName)"
            >
              {{ item.conscripte.fullName }}
            </v-chip>
          </template>
          <template v-slot:item.militaryId="{ item }">
            <v-chip
              color="transparent"
              :to="`/fugitives/${item.militaryId}`"
              @click.right="copyText(item.militaryId)"
            >
              {{ item.militaryId }}
            </v-chip>
          </template>
          <template v-slot:item.fullName="{ item }">
            <v-chip
              color="transparent"
              :to="`/fugitives/${item.militaryId}`"
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
        desc: "يقوم بعرض الهروب الذي مر عليه أكثر من عام ولم تسجل له إجراءات",
        items: [],
        printer: {},
        loading: false
      },
      {
        title: "الجدول الثاني",
        desc:
          "يقوم بعرض الهروب الذي مر عليه أكثر من 21 يوماً ولم تسجل له إجراءات",
        items: [],
        printer: {},
        loading: false
      }
    ],
    newHeaders: {},
    headers: [
      {
        text: "الرقم العسكري",
        value: "conscripte.militaryId",
        sortable: true
      },
      {
        text: "الدرجة",
        value: "conscripte.degree.degreeType"
      },
      {
        text: "الإسم",
        value: "conscripte.fullName"
      },
      {
        text: "الوحدة",
        value: "conscripte.unit.unitText"
      },
      {
        text: "تاريخ الغياب",
        value: "absenceDate"
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
        past21Days = new Date(new Date(now).setDate(now.getDate() - 21)),
        past1Month = new Date(new Date(now).setMonth(now.getMonth() - 1)),
        past3Months = new Date(new Date(now).setMonth(now.getMonth() - 3)),
        next1Month = new Date(new Date(now).setMonth(now.getMonth() + 1)),
        next6Months = new Date(new Date(now).setMonth(now.getMonth() + 6));
      let s1 = await this.api("global/get_all", {
        table: "fugitives",
        where: {
          returnDate: {
            $is: null
          },
          s1ReceptionDate: {
            $is: null
          },
          s1ExecutionCommiteeDate: {
            $is: null
          },
          isNonCommissioned: false,
          absenceDate: {
            $between: [past13Years, pastYear]
          }
        },
        include: [
          {
            model: "conscriptes",
            include: [
              {
                model: "units"
              },
              {
                model: "degrees"
              }
            ]
          }
        ]
      });
      let fixedItems1 = this.fixDates(s1.data, [
        "conscriptionDate",
        "demobilizationDate",
        "absenceDate"
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
        table: "fugitives",
        where: {
          returnDate: {
            $is: null
          },
          $and: {
            $or: [
              {
                $and: [
                  {
                    s1AttachmentsAfter21Days: {
                      $notLike: "%1%2%3%"
                    }
                  },
                  {
                    s1AttachmentsAfter21Days: {
                      $notLike: "%1%3%2%"
                    }
                  },
                  {
                    s1AttachmentsAfter21Days: {
                      $notLike: "%2%1%3%"
                    }
                  },
                  {
                    s1AttachmentsAfter21Days: {
                      $notLike: "%2%3%1%"
                    }
                  },
                  {
                    s1AttachmentsAfter21Days: {
                      $notLike: "%3%2%1%"
                    }
                  },
                  {
                    s1AttachmentsAfter21Days: {
                      $notLike: "%3%1%2%"
                    }
                  }
                ]
              },
              {
                s1AttachmentsAfter21Days: {
                  $is: null
                }
              }
            ]
          },
          isNonCommissioned: false,
          absenceDate: {
            $between: [pastYear, past21Days]
          }
        },
        include: [
          {
            model: "conscriptes",
            include: [
              {
                model: "units"
              },
              {
                model: "degrees"
              }
            ]
          }
        ]
      });
      let fixedItems2 = this.fixDates(s2.data, [
        "conscriptionDate",
        "demobilizationDate",
        "absenceDate"
      ]);
      console.log(fixedItems2.map(f => f.s1AttachmentsAfter21Days));
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
