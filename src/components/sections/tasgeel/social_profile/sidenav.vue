<template>
  <div>
    <!-- border-right: 2px dashed var(--v-secondary-${
          $vuetify.theme.dark ? 'darken4' : 'lighten5'
        }) -->
    <v-card :style="`position: sticky;`">
      <v-card-text class="px-0">
        <v-list>
          <template v-for="(item, i) in mainList">
            <v-hover :key="i">
              <template v-slot:default="{ hover }">
                <v-list-item>
                  <v-list-item-avatar>
                    <v-icon color="primary" v-text="item.icon"></v-icon>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title
                      class="primary--text"
                      v-text="item.label"
                    ></v-list-item-title>
                    <v-list-item-subtitle
                      v-text="
                        item.type == 'select'
                          ? selects &&
                            selects[item.model] &&
                            selects[item.model].data &&
                            selects[item.model].text &&
                            selects[item.model].data.find(
                              d => d[selects[item.model].value] == item.value
                            )
                            ? selects[item.model].data.find(
                                d => d[selects[item.model].value] == item.value
                              )[selects[item.model].text]
                            : '--'
                          : item.value
                          ? item.value
                          : '--'
                      "
                    ></v-list-item-subtitle>
                  </v-list-item-content>
                  <!-- <v-list-item-action-text v-if="item.editable !== false">
                    <div v-if="hover">
                      <v-btn @click="changeModel(item.model)" icon>
                        <v-icon>mdi-pencil</v-icon>
                      </v-btn>
                      <v-btn @click="historyModel(item.model)" icon>
                        <v-icon>mdi-history</v-icon>
                      </v-btn>
                    </div>
                  </v-list-item-action-text> -->
                </v-list-item>
              </template>
            </v-hover>
          </template>
        </v-list>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "social-sidenav",
  props: {
    id: {
      type: String,
      default: ""
    },
    rerun: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    rerun(v) {
      if (v === true) {
        this.loadConscripte();
        this.init();
      }
    }
  },
  mounted() {
    if (this.id) {
      this.loadConscripte();
      this.init();
    }
  },
  data: () => ({
    mainList: [
      {
        label: "آخر تعديل من الشبكة",
        model: "webAt",
        type: "date",
        icon: "mdi-clock-outline",
        editable: false
      },
      {
        label: "آخر تعديل من الأفراد",
        model: "afraadAt",
        type: "date",
        icon: "mdi-clock-outline",
        editable: false
      },
      {
        label: "آخر تعديل يدوي",
        model: "localAt",
        type: "date",
        icon: "mdi-clock-outline",
        editable: false
      }
    ],
    c: {},
    selects: {}
  }),
  methods: {
    changeModel(model = "") {
      //
    },
    historyModel(model = "") {
      //
    },
    async loadConscripte() {
      let id = this.id,
        conscripte = await this.socialApi({
          id,
          attrs: ["militaryId", "localAt", "webAt"],
          dateKeys: ["localAt", "webAt"]
        });
      if (conscripte && conscripte.militaryId) {
        this.$set(this, "c", { ...conscripte });
        this.mainList.forEach((item, i) => {
          if (conscripte[item.model]) {
            this.$set(this.mainList[i], "value", conscripte[item.model]);
          }
        });
      }
    },
    init(specificTable = "") {
      // Get selects
      Object.keys(this.selects).forEach(key => {
        let { table, localTable, attrs } = this.selects[key];
        if (table) {
          let obj = {
            table
          };
          if (attrs && attrs.length > 0) {
            obj.attrs = attrs;
          }
          this.$set(this.selects[key], "loading", true);
          this.api("global/get_all", obj)
            .then(x => {
              this.$set(this.selects[key], "data", x.data);
            })
            .catch(error => {
              console.log(error);
              this.$set(
                this.selects[key],
                "error",
                "حدث خطأ أثناء استدعاء الداتا من قاعدة البيانات"
              );
            })
            .finally(() => {
              this.$set(this.selects[key], "loading", false);
            });
        } else if (localTable) {
          this.$set(this.selects[key], "loading", true);
          let data = this.localTable(localTable);
          this.$set(this.selects[key], "data", data);
          this.$set(this.selects[key], "loading", false);
        }
      });
    }
  }
};
</script>
