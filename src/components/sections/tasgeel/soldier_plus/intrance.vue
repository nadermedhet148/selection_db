<template>
  <div>
    <v-dialog
      v-model="model"
      scrollable
      :max-width="
        windows[window] && windows[window].width ? windows[window].width : '500'
      "
      persistent
      internal-activator
      v-if="isCurrentRoute(componentName)"
    >
      <v-card
        :loading="
          results.loading ? (window !== 0 ? 'white' : 'primary') : false
        "
        :disabled="results.loading"
      >
        <v-card-title
          :class="`${window !== 0 ? 'primary white--text' : ''} px-6 d-block`"
        >
          <v-row class="my-0 py-0">
            <v-col class="my-0 py-0 text-center align-self-center" cols="auto">
              <v-btn icon @click="tabTo()" v-if="window !== 0" dark>
                <v-icon>mdi-keyboard-backspace mdi-rotate-180</v-icon>
              </v-btn>
            </v-col>
            <v-col class="py-0 my-0 text-center">
              <div :class="`${window !== 0 ? '' : 'primary--text'}`">
                <div v-text="windows[window].title"></div>
                <div
                  v-if="windows[window].desc"
                  class="mt-2 text-body-1"
                  v-text="windows[window].desc"
                ></div>
              </div>
            </v-col>
            <v-col class="my-0 py-0 text-center align-self-center" cols="auto">
              <v-btn
                icon
                @click="goThere('/'), deleteRouteByName(componentName)"
                :dark="window !== 0"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pa-0 ma-0">
          <v-window v-model="window">
            <v-window-item>
              <!-- All Windows Refrences -->
              <v-list>
                <v-list-item-group v-model="window">
                  <template v-for="(w, i) in windows[0].childs">
                    <v-list-item
                      @click="w.goThere ? goThere(w.goThere) : () => {}"
                      class="wrap"
                      :key="i"
                      :value="w.to"
                      :disabled="w.disabled"
                    >
                      <v-list-item-avatar>
                        <v-icon size="30" v-text="w.icon"></v-icon>
                      </v-list-item-avatar>
                      <v-list-item-content>
                        <v-list-item-title
                          class="primary--text font-weight-bold"
                          v-text="w.title"
                        ></v-list-item-title>
                        <v-list-item-subtitle
                          v-text="w.desc"
                        ></v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                  </template>
                </v-list-item-group>
                <v-list-item class="wrap" to="/add_conscripte">
                  <v-list-item-avatar>
                    <v-icon size="30">mdi-plus</v-icon>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title
                      class="primary--text font-weight-bold"
                      v-text="'إضافة / تعديل فرد'"
                    ></v-list-item-title>
                    <v-list-item-subtitle
                      v-text="
                        'اضافة بيانات فرد جديد او تعديل بيانات فرد موجود '
                      "
                    ></v-list-item-subtitle>
                    <!-- <v-list-item-subtitle class="error--text">
                      -- تم تعطيل هذا الزر لحل بعض المشكلات --
                    </v-list-item-subtitle> -->
                  </v-list-item-content>
                </v-list-item>
                <v-list-item class="wrap" to="/buck_conscript">
                  <v-list-item-avatar>
                    <v-icon size="30">mdi-plus</v-icon>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title
                      class="primary--text font-weight-bold"
                      v-text="'إضافة افراد'"
                    ></v-list-item-title>
                    <v-list-item-subtitle
                      v-text="'اضافة مجندين عن طريق رفع excel '"
                    ></v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item
                  class="wrap"
                  to="/soldiers_plus/advanced_search/conscriptes"
                >
                  <v-list-item-avatar>
                    <v-icon size="30">mdi-eye</v-icon>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title
                      class="primary--text font-weight-bold"
                      v-text="'بحث متقدم عن المجندين'"
                    ></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-window-item>
          </v-window>
        </v-card-text>
        <v-divider v-if="windows[window].hasFooter"></v-divider>
        <v-card-actions class="px-4" v-if="windows[window].hasFooter">
          <v-spacer></v-spacer>
          <v-btn
            v-text="'رجوع'"
            @click="tabTo()"
            large
            outlined
            color="primary"
            class="px-6"
          ></v-btn>
          <v-btn
            v-text="windows[window].btnText"
            @click="runFun(windows[window].fun)"
            :disabled="
              (window == 1 && !search.ID) || (window == 2 && !search.fullName)
            "
            large
            color="primary"
            class="px-6"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "intrance",
  data: () => ({
    componentName: "soldiers_plus",
    tableFilters: {},
    model: true,
    search: {
      ID: "",
      fullName: ""
    },
    deleteCon: {
      ID: "",
      notes: ""
    },
    editCon: {
      ID: "",
      newID: "",
      notes: ""
    },
    results: {
      search: "",
      headers: [
        {
          text: "الرقم العسكري",
          value: "ID"
        },
        {
          text: "الدرجة",
          value: "degree.degreeType"
        },
        {
          text: "الإسم",
          value: "fullName"
        },
        {
          text: "الوحدة",
          value: "unit.unitText"
        },
        {
          text: "الحالة",
          value: "dutyCurrentState.text"
        }
      ],
      items: [],
      loading: false
    },
    window: 0,
    windows: [
      {
        title: " المجندين",
        desc: "[ بحث - تعديل - حذف ]",
        childs: [
          {
            title: "بحث بالرقم العسكري",
            desc: "يقوم بالبحث عن شخص واحد فقط, من خلال رقمه العسكري.",
            to: 1,
            icon: ""
          }
        ]
      },
      {
        title: "بحث بالرقم العسكري",
        backTo: 0,
        hasFooter: true,
        btnText: "بحث",
        fun: "findById"
      },
      {
        title: "بحث بالإسم",
        backTo: 0,
        btnText: "بحث",
        hasFooter: true,
        fun: "findByFullName"
      },
      {
        title: "نتائج البحث",
        backTo: 2,
        width: "800"
      },
      {
        title: "إضافة جديد",
        backTo: 0
      }
    ],
    msg: "Light"
  }),
  methods: {
    tabTo() {
      return (this.window = this.windows[this.window].backTo
        ? this.windows[this.window].backTo
        : 0);
    },
    findById() {
      let ID = this.search.ID;
      this.$set(this.results, "loading", true);
      this.api("global/get_one", {
        table: "Soldier",
        where: {
          ID
        },
        attrs: ["ID"]
      })
        .then(async x => {
          if (x.data) {
            // this.goThere(`/social_profile/${x.data.ID}`);
            this.goThere(`/soldiers_plus/${x.data.ID}`);
          } else {
            this.showError("الرقم العسكري غير صحيح.");
          }
        })
        .catch(error => {
          if (error.data) {
            this.showError(
              "حدث خطأ أثناء البحث بالرقم العسكري. من فضلك أعد المحاولة"
            );
          } else {
            this.showError("الرقم العسكري غير صحيح.");
          }
        })
        .finally(() => {
          this.$set(this.results, "loading", false);
        });
    }
  }
};
</script>
