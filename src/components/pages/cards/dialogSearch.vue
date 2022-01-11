<template>
  <v-dialog
    v-model="model"
    scrollable
    :max-width="
      windows[window] && windows[window].width ? windows[window].width : '500'
    "
    persistent
    internal-activator
    v-if="isCurrentRoute('cards/search')"
  >
    <v-card
      :loading="results.loading ? (window !== 0 ? 'white' : 'primary') : false"
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
                    @click="w.close ? closeRoute() : () => {}"
                    class="wrap"
                    :key="i"
                    :value="w.href ? false : w.to"
                    :disabled="w.disabled"
                    :to="w.href ? w.href : ''"
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
            </v-list>
          </v-window-item>
          <v-window-item>
            <!-- Search by MilitaryId -->
            <v-card-text>
              <v-text-field
                prepend-inner-icon="mdi-magnify"
                filled
                label="الرقم العسكري"
                hint="من فضلك أدخل الرقم العسكري"
                counter="13"
                @keypress.enter="findById()"
                v-model="search.militaryId"
                persistent-hint
              ></v-text-field>
            </v-card-text>
          </v-window-item>
          <v-window-item>
            <!-- Search by name -->
            <v-card-text>
              <v-text-field
                prepend-inner-icon="mdi-magnify"
                filled
                label="الإسم"
                hint="بإمكانك استخدام الرمز % في حالة عدم معرفة كلمة أو حرف من ضمن الإسم بالكامل"
                @keypress.enter="findByFullName()"
                v-model="search.fullName"
                persistent-hint
              ></v-text-field>
            </v-card-text>
          </v-window-item>
          <v-window-item>
            <!-- Search by name - Results -->
            <!-- <v-text-field
                v-model.lazy="results.search"
                filled
                dense
                hide-details
                prepend-inner-icon="mdi-magnify"
              ></v-text-field> -->
            <v-data-table
              :headers="results.headers"
              :items="results.items"
              fixed-header
              :search.sync="results.search"
              hide-default-header
              multi-sort
            >
              <template v-slot:header="table">
                <table-header-filters
                  :items="results.items"
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
              <template v-slot:item.militaryId="{ item }">
                <v-chip
                  :to="`/cards/profile/${item.militaryId}`"
                  @click.right="copyText(item.militaryId)"
                  class="transparent"
                >
                  {{ item.militaryId }}
                </v-chip>
              </template>
              <template v-slot:item.fullName="{ item }">
                <v-chip class="transparent">
                  {{ item.fullName }}
                </v-chip>
              </template>
              <template v-slot:item.dutyCurrentState.text="{ item }">
                <v-chip
                  :color="
                    item.stateIdCurrent == '1'
                      ? 'success'
                      : item.stateIdCurrent == 2
                      ? 'error'
                      : 'orange white--text'
                  "
                  small
                  class="font-weight-bold"
                >
                  {{
                    item && item.dutyCurrentState && item.dutyCurrentState.text
                      ? item.dutyCurrentState.text
                      : "غير معروف"
                  }}
                </v-chip>
              </template>
            </v-data-table>
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
            (window == 1 && !search.militaryId) ||
              (window == 2 && !search.fullName)
          "
          large
          color="primary"
          class="px-6"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "dialogSearch",
  data: () => ({
    componentName: "cards/search",
    tableFilters: {},
    model: true,
    search: {
      militaryId: "",
      fullName: ""
    },
    deleteCon: {
      militaryId: "",
      notes: ""
    },
    editCon: {
      militaryId: "",
      newMilitaryId: "",
      notes: ""
    },
    results: {
      search: "",
      headers: [
        {
          text: "الرقم العسكري",
          value: "militaryId"
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
        title: "البطاقات العلاجية",
        desc: "[بحث]",
        childs: [
          {
            title: "بحث بالرقم العسكري",
            desc: "يقوم بالبحث عن شخص واحد فقط, من خلال رقمه العسكري.",
            to: 1,
            icon: ""
          },
          {
            title: "بحث بالإسم",
            desc:
              "يقوم بالبحث عن عدة أشخاص تحتوي أسمائم على الإسم الذي ستكتبه.",
            to: 2,
            icon: ""
          },
          {
            title: "بحث متقدم",
            desc: "يوفر لك العديد من الخيارات للبحث",
            icon: "",
            to: "/cards/search/advancedSearch/",
            href: "/cards/search/advancedSearch",
            close: true
          }
          // {
          //   title: "إضافة جديد",
          //   desc: "إضافة مجند أو راتب عالي غير موجود",
          //   goThere: "/add_conscripte",
          //   to: 16,
          //   icon: ""
          // },
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
      }
    ],
    msg: "Light"
  }),
  methods: {
    runFun(fun) {
      return this[fun]();
    },
    tabTo() {
      return (this.window = this.windows[this.window].backTo
        ? this.windows[this.window].backTo
        : 0);
    },
    closeRoute() {
      console.log("test");
      this.deleteRouteByName(this.componentName);
    },
    findByFullName() {
      let fullName = this.fixName(this.search.fullName),
        // 0 => manger
        // 1 => tasgeel
        // 3 => enhaa
        section = this.$store.getters.getCurrSection,
        whereSec =
          section == 3
            ? { text: "منتهى خدمته" }
            : section == 1
            ? { text: "بالخدمة" }
            : { text: { $not: "0" } };
      console.log("section: ", section);
      this.$set(this.results, "loading", true);
      this.api("global/get_all", {
        table: "conscriptes",
        where: {
          fullName: {
            $like: `${fullName}%`
          }
        },
        attrs: ["militaryId", "stateIdCurrent", "fullName"],
        include: [
          {
            model: "units",
            attrs: ["unitText"]
          },
          {
            model: "degrees",
            attrs: ["degreeType"]
          },
          {
            model: "dutyCurrentStates",
            attrs: ["text"],
            where: whereSec
          }
        ]
      })
        .then(x => {
          console.log(x);
          this.$set(this.results, "items", x.data);
          this.$set(this, "window", 3);
        })
        .catch(error => {
          console.log(error);
          this.showError("حدث خطأ أثناء البحث بالإسم. من فضلك أعد المحاولة");
        })
        .finally(() => {
          this.$set(this.results, "loading", false);
        });
    },
    findById() {
      let militaryId = this.search.militaryId;
      this.$set(this.results, "loading", true);
      this.api("global/get_one", {
        table: "conscriptes",
        where: {
          militaryId
        },
        attrs: ["militaryId", "DegreeId"]
      })
        .then(x => {
          console.log(x);
          if (x.data) {
            // this.goThere(`/social_profile/${x.data.militaryId}`);
            this.goThere(`/cards/profile/${x.data.militaryId}`);
          } else {
            this.showError("الرقم العسكري غير صحيح.");
          }
        })
        .catch(error => {
          console.log(error);
          if (error.data) {
            this.showError(
              "حدث خطأ أثناء البحث بالرقم العسكري. من فضلك أعد المحاولة"
            );
          } else {
            this.showError("الرقم العسكري غير صحيح.");
          }
        })
        .finally(data => {
          this.$set(this.results, "loading", false);
        });
    }
  }
};
</script>
