<template>
  <div>
    <div v-if="filters && Object.keys(filters).length > 0">
      <v-container>
        <template v-for="(f, i) in Object.keys(filters).reverse()">
          <v-chip
            v-if="filters[f] !== undefined && filters[f].length > 0"
            :key="i"
            close
            @click:close="removeFilter(f)"
          >
            {{
              table.headers && table.headers.find(h => h.value == f)
                ? table.headers.find(h => h.value == f).text
                : ""
            }}
            :
            <template v-for="(fi, ii) in filters[f]">
              <span
                :key="ii"
                v-text="
                  !fi || fi === true || typeof fi == 'number' || fi.length <= 35
                    ? fi
                    : fi.substr(0, 35) + '...'
                "
              ></span>
              <span
                :key="'d_' + ii"
                v-if="filters[f].length > ii + 1"
                class="px-1"
                >-</span
              >
            </template>
          </v-chip>
        </template>
      </v-container>
    </div>
  </div>
</template>

<script>
export default {
  name: "footer-filters",
  props: {
    table: {
      type: Object,
      default: () => ({})
    },
    filters: {
      type: Object,
      default: () => ({})
    }
  },
  data: () => ({}),
  methods: {
    removeFilter(key) {
      this.$set(this.filters, key, undefined);
    }
  }
};
</script>
