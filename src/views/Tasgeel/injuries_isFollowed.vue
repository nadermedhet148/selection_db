<template>
  <div>
    <v-card>
      <v-card-title>
        <v-spacer></v-spacer>
        <printer-menu
          :disabled="result.items.length == 0"
          :data="printer"
          :fab="false"
        ></printer-menu>
      </v-card-title>
      <v-data-table
        :items="result.items"
        :headers="result.headers"
        fixed-header
        :search.sync="result.search"
        v-model="result.selected"
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
      </v-data-table>
    </v-card>
    <v-card>
      <v-card-title>
        <v-spacer></v-spacer>
        <printer-menu
          :disabled="result.units.length == 0"
          :data="printerUnits"
          :fab="false"
        ></printer-menu>
      </v-card-title>
      <v-data-table
        :items="result.units"
        :headers="result.unitsHeaders"
        fixed-header
        hide-default-header
        multi-sort
      >
        <template v-slot:header="table">
          <table-header-filters
            :items="result.units"
            :table="table"
            :filters.sync="tableFiltersUnits"
          ></table-header-filters>
        </template>
        <template v-slot:footer="table">
          <table-footer-filters
            :filters.sync="tableFiltersUnits"
            :table="table"
          ></table-footer-filters>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "injuries_isFollowed",
  data: () => ({
    componentName: "injuries_isFollowed",
    tableFilters: {},
    tableFiltersUnits: {},
    printer: {},
    printerUnits: {},
    result: {
      units: [],
      unitsHeaders: [
        {
          value: "unitText",
          text: "الوحدة",
          sortable: true
        },
        {
          value: "counter",
          text: "العدد",
          sortable: true
        }
      ],
      items: [],
      headers: [
        {
          value: "militaryId",
          text: "الرقم العسكري",
          sortable: true
        },
        {
          value: "conscripte.degree.degreeType",
          text: "الدرجة",
          sortable: true
        },
        {
          value: "conscripte.fullName",
          text: "الإسم",
          sortable: true
        },
        {
          value: "conscripte.unit.unitText",
          text: "الوحدة",
          sortable: true
        },
        {
          value: "injuryDate",
          text: "تاريخ الحالة",
          sortable: true
        },
        {
          value: "diagnosis",
          text: "التشخيص",
          sortable: true
        },
        {
          value: "lastUnitReply",
          text: "آخر رد للوحدة",
          sortable: true
        },
        {
          value: "lastBranchReply",
          text: "آخر رد للفرع",
          sortable: true
        },
        {
          value: "isFollowed",
          text: "متابعه",
          sortable: true
        }
      ]
    }
  }),
  methods: {
    async getInjuries_IsFollowed() {
      let items = await this.api("global/get_all", {
          table: "injuries",
          where: {
            isFollowed: true
          },
          include: [
            {
              model: "conscriptes",
              required: true,
              where: {
                $or: {
                  stateId: 101,
                  stateIdCurrent: 1
                }
              },
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
        }),
        fixedItems = this.fixDates(items.data, [
          "injuryDate",
          "lastBranchReply",
          "lastUnitReply"
        ]);
      // console.log(fixedItems);
      let fixedUnits = [],
        units = fixedItems.map(item =>
          item.conscripte ? item.conscripte.unitId : null
        ),
        unitTexts = fixedItems.map(item => ({
          unitId: item.conscripte.unitId,
          unitText: item.conscripte.unitId ? item.conscripte.unit.unitText : ""
        }));
      units = [...new Set(units)];
      // console.log(units);
      units.forEach(unitId => {
        let obj = {
          unitId: unitId,
          // unitText: unitTexts.find(f => f.unitId == unitId).unitText,
          // counter: fixedItems.filter(item => item.conscripte.unitId == unitId)
          //   .length,
          unitText: unitTexts.find(f => f.unitId == unitId).unitText
            ? unitTexts.find(f => f.unitId == unitId).unitText
            : "غير مسجل لهم وحدات",
          counter: fixedItems.filter(item => item.conscripte.unitId == unitId)
            .length
        };
        fixedUnits.push(obj);
      });

      this.$set(this.result, "items", fixedItems);
      this.$set(this.result, "units", fixedUnits);
      let printerItems = {
        cons: [...fixedItems],
        excelKey: "cons",
        excelHeaders: this.result.headers
      };
      this.$set(this, "printer", printerItems);
      let printerUnits = {
        cons: [...fixedUnits],
        excelKey: "cons",
        excelHeaders: this.result.unitsHeaders
      };
      this.$set(this, "printerUnits", printerUnits);
    }
  },
  mounted() {
    this.getInjuries_IsFollowed();
  }
};
</script>
