<template>
  <div>
    <v-card class="mt-8">
      <v-card-title>
        {{ title }}
        <v-spacer></v-spacer>
        <printer-menu
          :disabled="items.length == 0"
          :data="printer"
          :query="query"
          :fab="false"
        ></printer-menu>
      </v-card-title>
      <v-divider></v-divider>
      <v-data-table
        :headers="headers.filter(h => h.inTable)"
        :items="items"
        hide-default-header
        fixed-header
        ref="mainTable"
        :sortable="false"
        @current-items="tableUpdated"
      >
        <template v-slot:header="table">
          <table-header-filters
            :items="items"
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

        <template
          v-for="slot in Object.keys($scopedSlots)"
          :slot="slot"
          slot-scope="scope"
        >
          <slot :name="slot" v-bind="scope"
        /></template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "table-bulider",
  filters: {
    filterStrLimit(str, limit) {
      return `${str.length <= limit ? str : str.substr(0, limit) + ".."}`;
    }
  },
  props: {
    headers: {
      type: Array,
      default: () => []
    },
    items: {
      type: Array,
      default: () => []
    },
    printer: {
      type: Object,
      default: () => ({})
    },
    query: {
      type: String,
      default: () => ""
    },
    title: {
      type: String,
      default: () => ""
    }
  },
  data: () => ({
    tableFilters: {}
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
            console.log(sorted);
            // this.printer = sorted;
          }
        }
      }
    },
    removeFilter(key) {
      this.$set(this.filters, key, undefined);
    }
  }
};
</script>
