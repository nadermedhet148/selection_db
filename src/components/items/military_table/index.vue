<template>
  <v-card class="military-table-container">
    <div class="military-table">
      <v-progress-linear indeterminate v-if="loading"></v-progress-linear>
      <table>
        <thead>
          <template v-for="(header, i) in headers">
            <th :key="i">
              <v-chip v-if="header.text" dark color="transparent">
                <span v-if="sort == header.value">
                  <v-icon small dark> mdi-chevron-{{ sortType }} </v-icon>
                </span>
                <v-btn @click="toggleSort(header.value)" small text>
                  {{ header.text }}
                </v-btn>
                <v-menu
                  v-if="
                    !header.noFilter &&
                      (!Object.keys(header).includes('sortable') ||
                        header.sortable)
                  "
                  :close-on-content-click="false"
                >
                  <template v-slot:activator="{ on }">
                    <v-btn dark v-on="on" icon small>
                      <v-icon small>mdi-filter-variant</v-icon>
                    </v-btn>
                  </template>
                  <v-sheet width="250" min-height="60">
                    <div class="py-1">
                      <v-autocomplete
                        clearable
                        multiple
                        :items="
                          dataFilters[header.value]
                            ? dataFilters[header.value]
                            : []
                        "
                        item-text="text"
                        item-value="value"
                        filled
                        :label="header.text"
                        hide-details
                        @change="toggleFilter()"
                        v-model="filters[header.value]"
                      ></v-autocomplete>
                    </div>
                  </v-sheet>
                </v-menu>
              </v-chip>
            </th>
          </template>
        </thead>
        <tbody>
          <template v-for="(item, i) in items">
            <tr :key="i">
              <template v-for="(header, hi) in headers">
                <td :key="hi">
                  <slot :name="`item.${header.value}`" :item="item">
                    <span v-if="header.value.includes('.')">
                      {{ getObjectValueByPath(item, header.value) }}
                    </span>
                    <span v-else>
                      {{ item[header.value] }}
                    </span>
                  </slot>
                </td>
              </template>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
    <v-card-actions class="px-4 mt-2">
      <v-spacer></v-spacer>
      <v-select
        style="max-width: 160px"
        v-model.number="perPage"
        :items="perPageItems"
        label="العناصر لكل صفحة"
      ></v-select>
      <div class="ms-5">
        <span style="font-size: 14px">
          عرض من
          {{ (page - 1) * perPage + 1 }}
          الى
          {{ page * perPage > items.length ? items.length : page * perPage }}
          من أصل
          {{ items.length }}
        </span>
        <v-btn @click="page--" :disabled="page == 1" icon>
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
        <span class="mx-1"></span>
        <v-btn icon @click="page++">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
      </div>
    </v-card-actions>
    <v-card-text>
      <pre dir="ltr" class="text-left">
        {{ filters }}
      </pre>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "MilitaryTable",
  mounted() {
    // this.fillFilters();
    // this.runFuns();
  },
  filters: {
    // getValue(key, item) {
    //   return "Google";
    // }
  },
  props: {
    items: {
      type: Array,
      default: () => []
    },
    headers: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    // fillFilters() {
    //   let keys = this.headers.map(h => h.value);
    //   keys.forEach(key => {
    //     this.$set(this.filters, key, []);
    //   });
    // },
    // onScroll(e) {
    //   console.log("Table scrolled");
    // },
    toggleFilter() {
      //
    },
    toggleSort(key) {
      let sort = this.sort,
        found = sort == key;
      if (found) {
        if (this.sortType == "down") {
          this.$set(this, "sort", null);
          this.$set(this, "sortType", "up");
        } else {
          this.$set(this, "sortType", "down");
        }
      } else {
        this.$set(this, "sort", key);
      }
    },
    getObjectValueByPath(obj, path, fallback = "") {
      // credit: http://stackoverflow.com/questions/6491463/accessing-nested-javascript-objects-with-string-key#comment55278413_6491621
      if (obj == null || !path || typeof path !== "string") return fallback;
      if (obj[path] !== undefined) return obj[path];
      path = path.replace(/\[(\w+)\]/g, ".$1"); // convert indexes to properties
      path = path.replace(/^\./, ""); // strip a leading dot
      return this.getNestedValue(obj, path.split("."), fallback);
    },
    getNestedValue(obj, path, fallback) {
      const last = path.length - 1;
      if (last < 0) return obj === undefined ? fallback : obj;
      for (let i = 0; i < last; i++) {
        if (obj == null) {
          return fallback;
        }
        obj = obj[path[i]];
      }
      if (obj == null) return fallback;
      return obj[path[last]] === undefined ? fallback : obj[path[last]];
    }
    // runFuns() {
    //   this.filterItems();
    // },
    // filterItems() {
    //   this.$set(this, "filteredItems", [...this.items]);
    //   this.renderItems();
    // },
    // renderItems() {
    //   this.$set(this, "renderedItems", this.filteredItems);
    // }
  },
  data: () => ({
    perPage: 10,
    page: 1,
    sort: null,
    sortType: "up",
    filters: {},
    perPageItems: [5, 10, 15],
    // filteredItems: [],
    // renderedItems: [],
    dataFilters: {}
  }),
  watch: {
    // itemsLength(v) {
    //   this.runFuns();
    // }
  },
  computed: {
    itemsLength() {
      return this.items.length;
    }
    // dataFilters() {
    //   let keys = this.headers.map(h => h.value),
    //     obj = {};
    //   keys.forEach(key => {
    //     let items = this.__itemsFilterd.map(m =>
    //         this.getObjectValueByPath(m, key)
    //       ),
    //       data = [...new Set([...items])];
    //     obj[key] = [];
    //     data.forEach(d => {
    //       obj[key].push({
    //         text: `${d} [${
    //           items.filter(f => this.getObjectValueByPath(f, key) == d).length
    //         }]`,
    //         value: d
    //       });
    //     });
    //   });
    //   return obj;
    // },
    // __itemsFilterd() {
    //   let items = [...this.items],
    //     filters = this.filters;
    //   if (
    //     Object.values(filters).filter(
    //       f => f && Array.isArray(f) && f.length > 0
    //     ).length > 0
    //   ) {
    //     //
    //   }
    //   return items;
    // },
    // __items() {
    //   let page = this.page,
    //     perPage = this.perPage,
    //     items = [...this.__itemsFilterd],
    //     sort = this.sort,
    //     sortType = this.sortType;
    //   if (sort) {
    //     const stringCollator = new Intl.Collator("ar", {
    //       sensitivity: "accent",
    //       usage: "sort"
    //     });
    //     items = items.sort((a, b) => {
    //       const sortKey = sort;
    //       let sortA = this.getObjectValueByPath(a, sortKey);
    //       let sortB = this.getObjectValueByPath(b, sortKey);
    //       if (sortType == "down") {
    //         [sortA, sortB] = [sortB, sortA];
    //       }
    //       if (sortA === null && sortB === null) {
    //         return 0;
    //       }
    //       [sortA, sortB] = [sortA, sortB].map(s =>
    //         (s || "").toString().toLocaleLowerCase()
    //       );
    //       if (sortA !== sortB) {
    //         if (!isNaN(sortA) && !isNaN(sortB))
    //           return Number(sortA) - Number(sortB);
    //         return stringCollator.compare(sortA, sortB);
    //       }
    //       return 0;
    //     });
    //   }
    //   items = items.slice((page - 1) * perPage, page * perPage);
    //   return items;
    // }
  }
};
</script>
