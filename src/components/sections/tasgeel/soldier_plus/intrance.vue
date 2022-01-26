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
                        'إضافة مجند أو راتب عالي غير موجود أو تعديل من هو موجود'
                      "
                    ></v-list-item-subtitle>
                    <!-- <v-list-item-subtitle class="error--text">
                      -- تم تعطيل هذا الزر لحل بعض المشكلات --
                    </v-list-item-subtitle> -->
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-window-item>
            <v-window-item>
              <!-- Search by ID -->
              <v-card-text>
                <v-text-field
                  prepend-inner-icon="mdi-magnify"
                  filled
                  label="الرقم العسكري"
                  hint="من فضلك أدخل الرقم العسكري"
                  counter="13"
                  @keypress.enter="findById()"
                  v-model="search.ID"
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
                <template v-slot:item.ID="{ item }">
                  <v-chip
                    :to="`/soldiers_plus/${item.ID}`"
                    @click.right="copyText(item.ID)"
                    class="transparent"
                  >
                    {{ item.ID }}
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
                      item &&
                      item.dutyCurrentState &&
                      item.dutyCurrentState.text
                        ? item.dutyCurrentState.text
                        : "غير معروف"
                    }}
                  </v-chip>
                </template>
              </v-data-table>
            </v-window-item>
            <v-window-item>
              <!-- Advanced search options -->
              <v-list>
                <template v-for="(w, i) in windows[4].childs">
                  <v-list-item
                    class="wrap"
                    :key="i"
                    :to="
                      w.href ? w.href : `/soldiers_plus/advanced_search/${w.to}`
                    "
                  >
                    <v-list-item-avatar>
                      <v-icon size="30" v-text="w.icon"></v-icon>
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title v-text="w.title"></v-list-item-title>
                      <v-list-item-subtitle
                        v-text="w.desc"
                      ></v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </template>
              </v-list>
            </v-window-item>
            <v-window-item>
              <!-- Add new conscripte -->
            </v-window-item>
            <v-window-item>
              <!-- Request delete conscripte -->
              <v-card-text>
                <v-text-field
                  v-model="deleteCon.ID"
                  filled
                  label="الرقم العسكري"
                  hint="من فضلك أدخل الرقم العسكري المراد حذفه"
                  persistent-hint
                  clearable
                  class="mb-4"
                ></v-text-field>
                <v-textarea
                  v-model="deleteCon.notes"
                  filled
                  label="ملاحظات"
                  hint="من فضلك أدخل سبب طلب الحذف"
                  persistent-hint
                  clearable
                  auto-grow
                ></v-textarea>
              </v-card-text>
            </v-window-item>
            <v-window-item>
              <!-- Request update ID of a conscripte -->
              <v-card-text>
                <v-text-field
                  v-model="editCon.ID"
                  filled
                  label="الرقم العسكري الحالي"
                  hint="من فضلك أدخل الرقم العسكري المراد تعديله"
                  persistent-hint
                  clearable
                  class="mb-4"
                ></v-text-field>
                <v-text-field
                  v-model="editCon.newID"
                  filled
                  label="الرقم العسكري الجديد"
                  hint="من فضلك أدخل الرقم العسكري الجديد"
                  persistent-hint
                  clearable
                  class="mb-4"
                ></v-text-field>
                <v-textarea
                  v-model="editCon.notes"
                  filled
                  label="ملاحظات"
                  hint="من فضلك أدخل سبب طلب التعديل"
                  persistent-hint
                  clearable
                  auto-grow
                ></v-textarea>
              </v-card-text>
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
              (window == 1 && !search.ID) ||
                (window == 2 && !search.fullName)
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
            to: 4
          },
          // {
          //   title: "إضافة جديد",
          //   desc: "إضافة مجند أو راتب عالي غير موجود",
          //   goThere: "/add_conscripte",
          //   to: 16,
          //   icon: ""
          // },
          // {
          //   title: "طلب حذف فرد",
          //   desc: "إرسال طلب حذف مجند أو راتب عالي الى مدير النظام",
          //   to: 6,
          //   icon: ""
          // },
          // {
          //   title: "طلب تعديل رقم عسكري",
          //   desc:
          //     "إرسال طلب تعديل رقم عسكري لمجند أو راتب عالي الى مدير النظام",
          //   to: 7,
          //   icon: ""
          // }
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
        title: "بحث متقدم",
        backTo: 0,
        childs: [
          {
            title: "المجندين /  ",
            // desc: "بحث متقدم عن المجندين و ",
            to: "conscriptes",
            icon: ""
          },
          // {
          //   title: "الحالات الإصابية / المرضية",
          //   desc: "",
          //   to: "injuries",
          //   icon: ""
          // },
          // {
          //   title: "التحقيقات / المحاكم",
          //   desc: "",
          //   to: "courts",
          //   icon: ""
          // },
          // {
          //   title: "العقوبات",
          //   desc: "",
          //   to: "penalties",
          //   href: "/penalties",
          //   icon: ""
          // },
          // {
          //   title: "محو الأمية",
          //   desc: "",
          //   to: "ignorants",
          //   href: "/ignorants",
          //   icon: ""
          // }
        ]
      },
      {
        title: "إضافة جديد",
        backTo: 0
      },
      // {
      //   title: "حذف مجند أو راتب عالي",
      //   btnText: "إرسال الطلب",
      //   hasFooter: true,
      //   fun: "requestDeleteCon",
      //   backTo: 0
      // },
      // {
      //   title: "تعديل رقم عسكري",
      //   btnText: "إرسال الطلب",
      //   hasFooter: true,
      //   fun: "requestEditCon",
      //   backTo: 0
      // }
    ],
    msg: "Light"
  }),
  methods: {
    async requestDeleteCon() {
      this.$set(this.results, "loading", true);
      let that = this,
        emptyFields = function() {
          that.$set(that.deleteCon, "ID", "");
          that.$set(that.deleteCon, "notes", "");
        },
        { ID, notes } = this.deleteCon,
        exists = await this.api("global/get_one", {
          table: "conscriptes",
          where: {
            ID
          },
          attrs: ["ID"]
        });
      if (exists && exists.ok && exists.data && exists.data.ID) {
        let date = await this.api("server/get-time"),
          request = await this.api("global/create_one", {
            table: "adminRequests",
            where: {
              type: "حذف",
              ID,
              userNotes: notes,
              date: date.data
            }
          });
        if (request && request.ok && request.data) {
          this.showSuccess("تم ارسال طلبك.");
          emptyFields();
          this.tabTo();
        } else {
          this.showError("حدث خطأ أثناء ارسال طلبك");
        }
        this.$set(this.results, "loading", false);
      } else {
        this.showError("الرقم العسكري المراد حذفه غير موجود.");
        this.$set(this.results, "loading", false);
      }
    },
    async requestEditCon() {
      this.$set(this.results, "loading", true);
      let that = this,
        emptyFields = function() {
          that.$set(that.editCon, "ID", "");
          that.$set(that.editCon, "newID", "");
          that.$set(that.editCon, "notes", "");
        },
        { ID, newID, notes } = this.editCon,
        exists = await this.api("global/get_one", {
          table: "conscriptes",
          where: {
            ID
          },
          attrs: ["ID"]
        });
      if (exists && exists.ok && exists.data && exists.data.ID) {
        let date = await this.api("server/get-time"),
          request = await this.api("global/create_one", {
            table: "adminRequests",
            where: {
              type: "تعديل",
              ID,
              newID,
              userNotes: notes,
              date: date.data
            }
          });
        if (request && request.ok && request.data) {
          this.showSuccess("تم ارسال طلبك.");
          emptyFields();
          this.tabTo();
        } else {
          this.showError("حدث خطأ أثناء ارسال طلبك");
        }
        this.$set(this.results, "loading", false);
      } else {
        this.showError("الرقم العسكري المراد حذفه غير موجود.");
        this.$set(this.results, "loading", false);
      }
    },
    runFun(fun) {
      return this[fun]();
    },
    tabTo() {
      return (this.window = this.windows[this.window].backTo
        ? this.windows[this.window].backTo
        : 0);
    },
    findByFullName() {
      let fullName = this.fixName(this.search.fullName);
      this.$set(this.results, "loading", true);
      this.api("global/get_all", {
        table: "conscriptes",
        where: {
          fullName: {
            $like: `${fullName}%`
          }
        },
        attrs: ["ID", "stateIdCurrent", "fullName"],
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
            attrs: ["text"]
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
      let ID = this.search.ID;
      this.$set(this.results, "loading", true);
      this.api("global/get_one", {
        table: "Soldier",
        where: {
          ID
        },
        attrs: ["ID"]
      })
        .then(x => {
          console.log(x);
          if (x.data) {
            // this.goThere(`/social_profile/${x.data.ID}`);
            this.goThere(`/soldiers_plus/${x.data.ID}`);
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
        .finally(() => {
          this.$set(this.results, "loading", false);
        });
    }
  }
};
</script>
