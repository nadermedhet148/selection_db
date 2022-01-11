<template>
  <div>
    <template v-for="(kind, ki) in kinds">
      <v-card class="mb-8" :key="ki">
        <v-card-title>
          {{ kind.text }}
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="px-0">
          <v-list>
            <v-row>
              <template
                v-for="(item, i) in mainList.filter(
                  m => m.kind && m.kind == kind.value
                )"
              >
                <v-col class="py-0" cols="6" md="6" lg="4" xl="3" :key="i">
                  <v-hover>
                    <template v-slot:default="{ hover }">
                      <v-list-item
                        style="position: relative"
                        :class="{
                          wrap: true,
                          grey: hover,
                          'lighten-4': !$vuetify.theme.dark,
                          'darken-3': $vuetify.theme.dark
                        }"
                      >
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
                                    d =>
                                      d[selects[item.model].value] == item.value
                                  )
                                  ? selects[item.model].data.find(
                                      d =>
                                        d[selects[item.model].value] ==
                                        item.value
                                    )[selects[item.model].text]
                                  : '--'
                                : item.value
                            "
                          ></v-list-item-subtitle>
                        </v-list-item-content>
                        <v-list-item-action-text
                          :class="{
                            grey: hover,
                            'lighten-4': !$vuetify.theme.dark,
                            'darken-3': $vuetify.theme.dark
                          }"
                          style="position: absolute; top: 50%; left: 5px; transform: translate(0%, -50%)"
                          v-if="item.editable !== false"
                        >
                          <div v-if="hover">
                            <v-btn @click="changeModel(item.model)" icon>
                              <v-icon>mdi-pencil</v-icon>
                            </v-btn>
                            <v-btn @click="historyModel(item.model)" icon>
                              <v-icon>mdi-history</v-icon>
                            </v-btn>
                          </div>
                        </v-list-item-action-text>
                      </v-list-item>
                    </template>
                  </v-hover>
                </v-col>
              </template>
            </v-row>
          </v-list>
        </v-card-text>
      </v-card>
    </template>
  </div>
</template>

<script>
export default {
  name: "social-main-data",
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
    kinds: [
      {
        text: "بيانات تجنيدية",
        value: "m" // Military Conscription Information
      },
      {
        text: "بيانات شخصية",
        value: "p" // Personal Information
      }
    ],
    mainList: [
      {
        label: "الرقم العسكري",
        model: "militaryId",
        type: "text",
        icon: "mdi-numeric-0-box-multiple-outline",
        kind: "m"
      },
      {
        label: "الرقم الثلاثي",
        model: "tripartiteNumber",
        type: "text",
        icon: "mdi-numeric-3-box-multiple-outline",
        kind: "m"
      },
      {
        label: "منطقة التجنيد",
        model: "areaId",
        type: "select",
        icon: "",
        kind: "m"
      },
      {
        label: "القوات",
        model: "powerId",
        type: "select",
        icon: "",
        kind: "m"
      },
      {
        label: "التمركز",
        model: "zoneId",
        type: "select",
        icon: "",
        kind: "m"
      },
      {
        label: "تاريخ الإلحاق",
        model: "conscriptionDate",
        type: "date",
        icon: "mdi-clock-outline",
        kind: "m"
      },
      {
        label: "تاريخ التسريح المبدئي",
        model: "demobilizationDateStarter",
        type: "date",
        icon: "mdi-clock-outline",
        editable: false
      },
      {
        label: "تاريخ التسريح المقرر",
        model: "demobilizationDate",
        type: "date",
        icon: "mdi-clock-outline",
        editable: false
      },
      {
        label: "تاريخ الإنهاء",
        model: "endingDutyDate",
        type: "date",
        icon: "mdi-clock-outline",
        editable: false
      },
      {
        label: "نوع التجنيد",
        model: "additionalYearStateId",
        type: "select",
        icon: ""
      },
      {
        label: "الحالة",
        model: "stateId",
        type: "select",
        icon: ""
      },
      {
        label: "المؤهل",
        model: "qualificationId",
        type: "select",
        icon: ""
      }
      // {
      //   label: "عمليات حربيه",
      //   model: "isPartInMilitaryOperation",
      //   type: "checkbox",
      //   icon: ""
      // }
    ],
    c: {},
    selects: {
      areaId: {
        table: "mobilizationAreas",
        text: "name",
        value: "areaId"
      },
      powerId: {
        table: "webPowers",
        text: "displayedText",
        value: "id"
      },
      zoneId: {
        table: "zones",
        text: "zoneText",
        value: "zoneId"
      },
      additionalYearStateId: {
        table: "additionalYears",
        text: "state",
        value: "additionalYearStateId"
      },
      stateId: {
        table: "dutyStates",
        text: "text",
        value: "stateId"
      },
      qualificationId: {
        table: "qualifications",
        text: "name",
        value: "qualificationId"
      }
    }
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
          id
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
