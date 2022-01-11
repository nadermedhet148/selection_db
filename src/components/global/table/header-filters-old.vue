<template>
  <!-- eslint-disable vue/valid-v-model -->
  <v-dialog persistent max-width="650" v-model="model" scrollable>
    <template v-slot:activator="{ on }">
      <v-badge color="error" left class="default-badge" overlap>
        <template v-slot:badge>
          <span>
            <!-- values[filterKey]
                ? Object.values(values[filterKey]).filter(
                    v => v || v === false || v === "" || v === 0
                  ).length
                : 0 -->
            {{
              values[filterKey]
                ? Object.values(values[filterKey]).filter(
                    value =>
                      value.length > 0 &&
                      (value.filter(f => f).length > 0 ||
                        value.includes("", 0, false, null, "null"))
                  ).length
                : 0
            }}
          </span>
        </template>
        <v-btn
          :dark="dark"
          :disabled="disabled"
          :icon="!fab"
          :fab="fab"
          v-on="on"
          :small="fab"
          :color="!fab ? 'default' : 'primary'"
          :class="!fab ? '' : 'me-2'"
        >
          <v-icon>mdi-filter-variant</v-icon>
        </v-btn>
      </v-badge>
    </template>
    <v-card>
      <v-card-title class="white--text primary">
        فلترة العناصر
        <v-spacer></v-spacer>
        <v-btn dark icon @click="model = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text class="pt-6">
        <div>
          <pre class="text-left" dir="ltr">
            {{ values[filterKey] }}
          </pre>
        </div>
        <v-row>
          <template v-for="(h, i) in headers">
            <v-col :key="i" cols="6">
              <v-autocomplete
                v-model="values[filterKey][h.dbvalue ? h.dbvalue : h.value]"
                filled
                :hide-details="false"
                :hint="h.dbvalue"
                persistent-hint
                chips
                :label="h.text"
                clearable
                multiple
                :items="
                  items.map(item =>
                    h.value.includes('.')
                      ? item[h.value.split('.')[0]][h.value.split('.')[1]]
                      : item[h.value]
                  )
                "
              ></v-autocomplete>
            </v-col>
          </template>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "header-filters-old",
  created() {
    if (this.filterKey) {
      if (!this.values[this.filterKey]) {
        this.$set(this.values, this.filterKey, {});
      }
    }
  },
  mounted() {
    if (this.filterKey) {
      if (!this.values[this.filterKey]) {
        this.$set(this.values, this.filterKey, {});
      }
    }
  },
  computed: {
    headers_fixed() {
      let header = this.headers;
      return 1;
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
    filterKey: {
      type: String,
      default: ""
    },
    loading: {
      type: Boolean,
      default: false
    },
    dark: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    fab: {
      type: Boolean,
      default: true
    },
    btnText: {
      type: String,
      default: ""
    }
  },
  data: () => ({
    model: false,
    values: {},
    copiedItems: {}
  }),
  watch: {
    // items: {
    //   handler(v) {

    //   },
    //   deep: true
    // },
    filterKey(v) {
      if (v) {
        if (!this.values[v]) {
          this.$set(this.values, v, {});
        }
      }
    },
    values: {
      handler(v) {
        if (
          this.filterKey &&
          v[this.filterKey] &&
          Object.keys(v[this.filterKey]).length > 0
        ) {
          if (
            !this.copiedItems[this.filterKey] ||
            this.copiedItems[this.filterKey].length == 0
          ) {
            this.$set(this.copiedItems, this.filterKey, this.items);
          }
          let copiedItems = this.copiedItems[this.filterKey];
          Object.keys(v[this.filterKey]).forEach(key => {
            let value = v[this.filterKey][key];
            if (
              value.length > 0 &&
              (value.filter(f => f).length > 0 ||
                value.includes("", 0, false, null, "null"))
            ) {
              console.log(value);
              console.log(key);
              copiedItems = copiedItems.filter(c => value.includes(c[key]));
            } else {
              //
            }
          });
          // if (
          //   v[this.filterKey] &&
          //   Object.values(v[this.filterKey]).filter(
          //     vv => vv || vv === false || vv === "" || vv === 0
          //   ).length
          // ) {
          // }
          if (this.items && this.items.length > 0 && !this.loading) {
            this.$emit("filteron", {
              items: copiedItems,
              key: this.filterKey
            });
          }
        }
      },
      deep: true
    }
  },
  methods: {
    getModel(obj, key) {
      return;
    }
  }
};
</script>
