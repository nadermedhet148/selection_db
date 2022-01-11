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
          multi-sort
          fixed-header
          :items="card.items"
          :headers="
            newHeaders[i]
              ? newHeaders[i].filter(h => !h.onlyFor || h.onlyFor == i)
              : []
          "
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
  name: "TasgeelCounters",
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
        desc:
          "يقوم بعرض من هو بالخدمة وعاد من الهروب, وغير مسجل له محكمة وغير مسجل له عقوبة",
        items: [],
        printer: {},
        loading: false
      }
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
      let s1 = await this.api("global/get_all", {
        table: "conscriptes",
        where: {
          stateIdCurrent: 1,
          "$fugitives.returnDate$": {
            $not: null
          },
          "$courts.courtId$": {
            $is: null
          },
          "$penalties.injuryId$": {
            $is: null
          },
          $and: {
            $or: [
              {
                ispunished: false
              },
              {
                ispunished: {
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
            model: "fugitives",
            required: false
          },
          {
            model: "penalties",
            required: false
          },
          {
            model: "injuries",
            required: false
          },
          {
            model: "courts",
            required: false
          }
        ]
      });
      let fixedItems1 = this.fixDates(s1.data, []);
      let printer1 = {
        cons: fixedItems1,
        excelKey: "cons",
        excelHeaders: this.headers
      };
      this.$set(this.cards[0], "items", fixedItems1);
      this.$set(this.cards[0], "printer", printer1);
      this.$set(this.cards[0], "loading", false);
    }
  }
};
</script>
