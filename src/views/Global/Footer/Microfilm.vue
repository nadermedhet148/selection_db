<template>
  <div>
    <advanced-search-microfilm
      v-if="params.advanced_search == 'advanced_search'"
    ></advanced-search-microfilm>
    <admin-stats
      v-else-if="params.advanced_search == 'admin_stats'"
    ></admin-stats>
    <v-dialog
      v-if="
        !['admin_stats', 'advanced_search'].includes(params.advanced_search) &&
          isCurrentRoute(componentName)
      "
      scrollable
      v-model="model"
      persistent
      :max-width="[0, 1].includes(window) ? '450' : '950'"
    >
      <v-card>
        <v-card-title :class="window !== 0 ? 'primary white--text' : ''">
          <v-btn
            icon
            @click="window--"
            v-if="![0, 2].includes(window)"
            class="me-4"
            :dark="window !== 0"
          >
            <v-icon>mdi-keyboard-backspace mdi-rotate-180</v-icon>
          </v-btn>
          <span>
            <span v-if="window == 0"></span>
            <span v-else v-text="windows.find(w => w.id == selected_type).text">
            </span>
          </span>
          <v-spacer></v-spacer>
          <v-btn
            icon
            @click="goThere('/'), deleteRouteByName(componentName)"
            :dark="window !== 0"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="ma-0 pa-0">
          <v-window v-model="window">
            <v-window-item>
              <!-- Select a window -->
              <v-list>
                <v-list-item-group v-model="window">
                  <template v-for="(w, i) in windows">
                    <v-list-item
                      @click="selected_type = w.id"
                      :key="i"
                      class="wrap"
                      :value="1"
                      :to="w.href"
                      :disabled="
                        w.onlySections &&
                          w.onlySections.length > 0 &&
                          !w.onlySections.includes(
                            $store.state.currentUser.section
                          )
                      "
                    >
                      <v-list-item-avatar>
                        <v-icon size="30" v-text="w.icon"></v-icon>
                      </v-list-item-avatar>
                      <v-list-item-content>
                        <v-list-item-title v-text="w.text"></v-list-item-title>
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
              <v-card-text>
                <!-- v-if="selected_type == 'create_new'" -->
                <v-text-field
                  v-model="film.number"
                  label="رقم الفيلم"
                  filled
                  hint="من فضلك أدخل رقم الفيلم لإنشاء جديد"
                  persistent-hint
                  class="mb-2"
                  :error-messages="film.error"
                  :success-messages="film.success"
                  :loading="film.check_loading"
                  @keypress.enter="checkFilmExists()"
                  :append-icon="
                    film.error
                      ? 'mdi-close'
                      : film.success
                      ? 'mdi-check-bold'
                      : ''
                  "
                >
                  <template v-slot:message="{ message, on }">
                    <div v-on="on">
                      <span v-html="message"></span>
                    </div>
                  </template>
                </v-text-field>
                <v-text-field
                  v-if="selected_type == 'create_new'"
                  v-model="film.title"
                  label="عنوان الفيلم"
                  filled
                  hint="من فضلك أدخل عنوان الفيلم"
                  persistent-hint
                  @keypress.enter="checkFilmExists()"
                ></v-text-field>
                <!-- <v-autocomplete
                  v-if="selected_type == 'create_currupted'"
                  v-model="film.status"
                  label="حالة التصوير"
                  filled
                  
                  hint="من فضلك قم باختيار حالة التصوير"
                  persistent-hint
                  :items="film.status_list"
                ></v-autocomplete> -->
              </v-card-text>
              <v-card-actions class="px-4">
                <v-spacer></v-spacer>
                <v-btn
                  color="primary"
                  large
                  outlined
                  class="px-6"
                  @click="window--"
                  v-text="'عودة'"
                >
                </v-btn>
                <v-btn
                  color="primary"
                  large
                  class="px-6"
                  @click="checkFilmExists()"
                  v-text="
                    selected_type == 'create_new' ? 'إصافة فيلم' : 'تعديل فيلم'
                  "
                  :disabled="
                    selected_type == 'create_new'
                      ? !film.number || !film.title || !film.success
                      : !film.number || !film.success
                  "
                >
                </v-btn>
              </v-card-actions>
            </v-window-item>
            <v-window-item>
              <!-- Create New Window -->
              <!-- <create-new-microfilm></create-new-microfilm> -->
              <!-- <v-text-field
                prepend-inner-icon="mdi-magnify"
                hide-details
                v-model="new_film.search"
                filled
                dense
              >
                <template v-slot:append>
                  <div style="transform: translate(0, -3px)">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-btn icon v-on="on">
                          <v-icon>mdi-printer</v-icon>
                        </v-btn>
                      </template>
                      <span>طباعة الكشف</span>
                    </v-tooltip>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-btn
                          :disabled="new_film.selected_items.length == 0"
                          icon
                          :color="
                            new_film.selected_items.length == 0 ? '' : 'error'
                          "
                          v-on="on"
                        >
                          <v-icon>mdi-trash-can</v-icon>
                        </v-btn>
                      </template>
                      <span>هل تريد حذف المحدد؟</span>
                    </v-tooltip>
                  </div>
                </template>
              </v-text-field> -->
              <v-data-table
                :items="new_film.items"
                :headers="new_film.headers"
                fixed-header
                :search.sync="new_film.search"
                item-key="militaryId"
                loading-text="جارِ تحميل البيانات"
                disable-sort
                v-model="new_film.selected_items"
                disable-filtering
                disable-pagination
              >
                <!-- <template v-slot:header="table">
                  <table-header-filters
                    :items="new_film.items"
                    :table="table"
                    :filters.sync="tableFilters"
                  ></table-header-filters>
                </template>
                <template v-slot:footer="table">
                  <table-footer-filters
                    :filters.sync="tableFilters"
                    :table="table"
                  ></table-footer-filters>
                </template> -->
                <template v-slot:item.militaryId="{ item }">
                  <v-chip color="transparent">
                    {{ item.militaryId }}
                  </v-chip>
                </template>
                <template v-slot:item.fullName="{ item }">
                  <v-chip color="transparent">
                    {{ item.fullName }}
                  </v-chip>
                </template>
                <template v-slot:item.remove="{ item }">
                  <div>
                    <v-chip color="transparent">
                      <v-btn icon color="error" @click="removeCon(item)">
                        <v-icon>mdi-trash-can-outline</v-icon>
                      </v-btn>
                    </v-chip>
                  </div>
                </template>
              </v-data-table>
            </v-window-item>
            <!-- <v-window-item> -->
            <!-- Create Currupted Window -->
            <!-- <create-currupted-microfilm></create-currupted-microfilm> -->
            <!-- </v-window-item> -->
          </v-window>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions v-if="window == 2" class="px-0 pt-0 pb-1 ma-0">
          <!-- prepend-inner-icon="mdi-plus" -->
          <v-text-field
            v-model="new_film.number"
            label="رقم جديد"
            hide-details
            filled
            @keypress.enter="addNewNumber"
            counter="13"
            :error-messages="new_film.error"
            :loading="new_film.loading"
            :success-messages="new_film.success"
            :prepend-inner-icon="
              new_film.error.length > 0
                ? new_film.error
                : new_film.success.length > 0
                ? new_film.success
                : 'mdi-plus'
            "
          ></v-text-field>
          <!-- <v-btn
            color="primary"
            text
            @click="window = 0"
            v-text="'رجوع'"
            large
            class="px-6"
          ></v-btn>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            outlined
            @click="printer.model = true"
            v-text="'طباعة'"
            large
            class="px-6"
          ></v-btn>
          <v-btn
            color="primary"
            @click="saveMicrofilm"
            v-text="'حفظ'"
            large
            class="px-6"
          ></v-btn> -->
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  components: {
    // CreateNewMicrofilm: () =>
    //   import("@/components/pages/microfilm/create_new.vue"),
    // CreateCurruptedMicrofilm: () =>
    //   import("@/components/pages/microfilm/create_currupted.vue"),
    AdvancedSearchMicrofilm: () =>
      import("@/components/pages/microfilm/advanced_search.vue"),
    AdminStats: () => import("@/components/pages/microfilm/admin_stats.vue")
  },
  name: "microfilm",
  computed: {
    params() {
      let index = this.$store.state.routes.findIndex(
          v => v.name == this.componentName
        ),
        params = {};
      if (index !== -1) {
        params = this.$store.state.routes[index].params;
      }
      return params;
    }
  },
  watch: {
    "film.number"(v) {
      this.$set(this.film, "check_loading", true);
      this.$nextTick(() => {
        let intVal = setInterval(() => {
          this.$nextTick(() => {
            this.checkFilmExists(v);
          });
          clearInterval(intVal);
        }, 750);
      });
    }
  },
  data: () => ({
    componentName: "all_microfilm",
    tableFilters: {},
    new_film: {
      // بيانات العسكري المضاف للفيلم
      search: "",
      number: "",
      title: "",
      items: [],
      loading: false,
      error: "",
      success: "",
      headers: [
        {
          text: "الرقم العسكري",
          sortable: true,
          value: "militaryId"
        },
        {
          text: "الإسم",
          sortable: true,
          value: "fullName"
        },
        {
          text: "الوحدة",
          sortable: true,
          value: "unit.unitText"
        },
        {
          text: "تاريخ التسريح",
          sortable: true,
          value: "demobilizationDate"
        },
        {
          text: "حذف",
          value: "remove",
          sortable: false
        }
      ],
      selected_items: []
    },
    film: {
      //بيانات الفيلم
      success: "",
      error: "",
      check_loading: false,
      number: "",
      title: "",
      status: "",
      status_list: [
        {
          text: "تم التصوير",
          value: "3"
        },
        {
          text: "جاري التصوير",
          value: "2"
        },
        {
          text: "لم يتم التصوير",
          value: "1"
        }
      ]
    },
    window: 0,
    model: true,
    printer: {
      model: false
    },
    selected_type: "",
    windows: [
      {
        id: "create_new",
        icon: "mdi-plus",
        text: "إضافة جديد",
        desc: "إنشاء كشوف ميكروفيلم جديدة."
      },
      {
        id: "continue_create_new",
        icon: "mdi-restart",
        text: "استكمال",
        desc: ".استكمال او تعديل فيلم",
        onlySections: [0]
      },
      // {
      //   id: "create_currupted",
      //   icon: "mdi-plus",
      //   text: "إضافة فاقد أو تالف",
      //   desc: "إنشاء كشوف ميكروفيلم تالفة أو مفقودة - كشوف أو نماذج."
      // },
      {
        id: "advanced_search",
        icon: "mdi-magnify",
        text: "البحث المتقدم",
        desc: "إيجاد فيلم أو لقطة عن طريق البحث بجميع المتغيرات المتاحة.",
        href: "/all_microfilm/advanced_search"
      },
      {
        id: "admin_stats",
        icon: "mdi-folder-multiple-image",
        text: "مجلدات الميكروفيلم",
        desc: "عرض ما يحتويه السيرفر من صور الميكروفيم.",
        href: "/all_microfilm/admin_stats",
        onlySections: [0, 5] //مدير النظام و الحاسب
      }
    ]
  }),
  methods: {
    addNewNumber() {
      console.log("this.new_film ,, ", this.new_film);
      this.$set(this.new_film, "success", "");
      this.$set(this.new_film, "error", "");
      this.$set(this.new_film, "loading", true);
      let mid = this.new_film.number,
        isExists = this.new_film.items.find(i => i.militaryId == mid);
      if (isExists) {
        this.$set(this.new_film, "success", "");
        this.$set(this.new_film, "error", "mdi-arrow-up"); // Exists
        this.$set(this.new_film, "loading", false);
        return;
      }
      this.api("global/get_one", {
        table: "conscriptes",
        where: {
          militaryId: mid
        },
        attrs: ["fullName", "militaryId", "demobilizationDate"],
        include: [
          {
            model: "units",
            attrs: ["unitText"]
          }
        ]
      })
        .then(x => {
          console.log("db returned military id", x);
          let isExists_again = this.new_film.items.find(
            i => i.militaryId == mid
          );
          if (isExists_again) {
            this.$set(this.new_film, "success", "");
            this.$set(this.new_film, "error", "mdi-arrow-up"); // Exists
          } else {
            this.$set(this.new_film, "error", "");
            this.$set(this.new_film, "success", "mdi-check-bold"); // Correct
            let i = this.new_film.items.length + 1,
              // if odd => (even+1)/2
              // if even => i/2
              // always => even/ 2
              sortIndex = i % 2 !== 0 ? (i + 1) / 2 : i / 2;
            console.log("before ", this.new_film.items);
            console.log(
              "this.fixDates([x.data], ['demobilizationDate'])[0] ",
              this.fixDates([x.data], ["demobilizationDate"])[0]
            );
            this.$set(
              this.new_film.items,
              i - 1,
              this.fixDates([x.data], ["demobilizationDate"])[0]
            );

            console.log("i = ", i);
            console.log("sortIndex = ", sortIndex);

            this.api("global/update_one", {
              table: "conscriptes",
              update: {
                microfilmId: this.film.number,
                microfilmSortIndex: sortIndex
              },
              where: {
                militaryId: mid
              }
            })
              .then(x => {
                // console.log(x);
                // Do Nothing
                this.$set(this.new_film, "number", "");
              })
              .catch(error => {
                this.showError("حدث خطأ أثناء إضافة الرقم العسكري : " + mid);
              });
          }
        })
        .catch(err => {
          if (err.data == null) {
            this.$set(this.new_film, "success", "");
            this.$set(this.new_film, "error", "mdi-close"); // incorrect
          } else {
            this.showError(
              "حدث خطأ أثناء استدعاء الرقم العسكري من قاعدة البيانات."
            );
          }
          // console.log(err);
        })
        .finally(() => {
          this.$set(this.new_film, "loading", false);
        });
    },
    saveMicrofilm() {},
    checkFilmExists(number = "") {
      let n = this.film.number,
        stepUp = !number || number.length == 0,
        //
        used_n = number ? number : n,
        title = this.film.title;
      this.$set(this.film, "check_loading", true);
      if (used_n.length < 1) {
        this.$set(this.film, "success", "");
        this.$set(this.film, "error", "");
        this.$set(this.film, "check_loading", false);
        return;
      }
      this.api("global/get_one", {
        table: "microfilms",
        where: {
          microfilmId: used_n
        },
        attrs: ["microfilmId", "filmTitle"],
        include: []
      })
        .then(x => {
          console.log("check x =", x);
          this.$set(this.film, "success", "");
          // function here ...
          if (this.selected_type == "continue_create_new") {
            if (x.data) {
              if (!number && this.film.number.length > 0) {
                console.log("in >>>> ");
                this.fillData(used_n);
              }
              this.$set(
                this.film,
                "success",
                `فيلم ${x.data.filmTitle} متاح للتعديل `
              );
              this.$set(this.film, "error", "");
            } else {
              this.$set(this.film, "success", "");
              this.$set(
                this.film,
                "error",
                "فيلم غير موجود بالرجاء الاضافه للتعديل."
              );
            }
          } else {
            this.$set(
              this.film,
              "error",
              "الفيلم موجود بعنوان: <b class='text--primary'>" +
                x.data.filmTitle +
                "</b>"
            );
          }
          this.$set(this.film, "check_loading", false);
        })
        .catch(err => {
          if (err.data == null) {
            if (this.selected_type == "continue_create_new") {
              this.$set(this.film, "error", "هذا الفيلم غير موجود.");
              this.$set(this.film, "success", "");
            } else {
              this.$set(this.film, "error", "");
              this.$set(this.film, "success", "رقم الفيلم متاح");
              if (!number && this.film.number.length > 0) {
                if (this.film.title.length > 0) {
                  // Create a new film
                  this.$set(this.film, "check_loading", true);
                  this.api("global/create_one", {
                    table: "microfilms",
                    where: {
                      microfilmId: used_n,
                      filmTitle: title,
                      state: 1
                    }
                  })
                    .then(x => {
                      if (x.data == "true") {
                        this.$set(this, "window", this.window + 1);
                        this.$set(this.film, "number", used_n);
                      } else {
                        this.showError("حدث خطأ أثناء إنشاء ميكروفيلم جديد.");
                      }
                    })
                    .catch(error => {
                      this.showError("حدث خطأ أثناء إنشاء ميكروفيلم جديد.");
                    })
                    .finally(() => {
                      this.$set(this.film, "check_loading", false);
                    });
                } else {
                  this.showError("من فضلك قم بإدخال عنوان الفيلم.");
                }
              }
            }
          } else {
            if (used_n.length > 10) {
              this.$set(this.film, "success", "");
              this.$set(this.film, "error", "تعذر التحقق من وجود الفيلم");
              this.showError(
                "ايه ياريس كل ده رقم فيلم؟ هيتصور في هوليوود ده ولا ايه؟"
              );
            }
          }

          this.$set(this.film, "check_loading", false);
        });
    },
    removeCon(cons) {
      this.api("global/update_one", {
        table: "conscriptes",
        update: {
          microfilmId: null
        },
        where: {
          militaryId: cons.militaryId
        }
      })
        .then(x => {
          // console.log(x);
          // Do Nothing
          let index = this.new_film.items.findIndex(item => {
            return item.militaryId == cons.militaryId;
          });
          this.new_film.items.splice(index, 1);
        })
        .catch(error => {
          // console.log("حدث خطأ أثناء إضافة الرقم العسكري : " + mid);
          this.showError("حدث خطأ أثناء إضافة الرقم العسكري : " + mid);
        });
    },
    fillData(microfilmId) {
      this.$set(this.film, "check_loading", true);
      this.api("global/get_all", {
        table: "conscriptes",
        where: {
          microfilmId: microfilmId
        },
        attrs: [
          "fullName",
          "militaryId",
          "demobilizationDate",
          "microfilmSortIndex"
        ],
        include: [
          {
            model: "units",
            attrs: ["unitText"]
          }
        ],
        order: [["microfilmSortIndex", "asc"]]
      })
        .then(x => {
          if (x.data) {
            this.$set(this, "window", this.window + 1);
            this.$set(this.film, "number", microfilmId);

            this.$set(
              this.new_film,
              "items",
              x.data.map(e => this.fixDates([e], ["demobilizationDate"])[0])
            );
          } else {
            this.showError("حدث خطأ أثناء إنشاء ميكروفيلم جديد.");
          }
        })
        .catch(error => {
          console.log(error);
          this.showError("حدث خطأ اثناء تحميل البيانات. : ");
        })
        .finally(() => {
          this.$set(this.film, "check_loading", false);
        });
    }
  }
};
</script>
