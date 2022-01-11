<template>
  <div>
    <div v-if="!params.section">
      <v-dialog
        v-if="isCurrentRoute(componentName)"
        persistent
        :max-width="window == 3 ? 700 : 450"
        scrollable
        v-model="model"
      >
        <v-card :loading="loading" :disabled="loading">
          <v-card-title class="white--text primary">
            <v-btn
              icon
              @click="window = windows[window]"
              v-if="window !== 0"
              dark
            >
              <v-icon>mdi-keyboard-backspace mdi-rotate-180</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            {{ window == 0 ? "طلبات المواطنين" : "إضافة طلب" }}
            <v-spacer></v-spacer>
            <v-btn
              icon
              @click="goThere('/'), deleteRouteByName(componentName)"
              dark
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="pa-0">
            <v-window v-model="window">
              <template v-for="(group, i) in groupItems">
                <v-window-item :key="i">
                  <v-list>
                    <v-list-item-group v-model="window">
                      <template v-for="(item, ii) in group">
                        <v-list-item
                          :disabled="
                            item.sections &&
                              item.sections.length > 0 &&
                              !item.sections.includes(
                                $store.state.currentUser.section
                              )
                          "
                          @click="
                            item.setType ? setTalabType(item.setType) : () => {}
                          "
                          :value="item.window ? item.window : 99"
                          :key="ii"
                          :to="item.to ? `/db_so/${item.to}` : ''"
                        >
                          <v-list-item-avatar>
                            <v-icon v-text="item.icon"></v-icon>
                          </v-list-item-avatar>
                          <v-list-item-content>
                            <v-list-item-title
                              v-text="item.title"
                            ></v-list-item-title>
                            <v-list-item-subtitle
                              v-text="item.desc"
                            ></v-list-item-subtitle>
                          </v-list-item-content>
                        </v-list-item>
                      </template>
                    </v-list-item-group>
                  </v-list>
                </v-window-item>
              </template>
              <v-window-item>
                <!-- عسكري -->
                <v-card-text>
                  <v-text-field
                    label="الرقم العسكري"
                    prepend-inner-icon=""
                    hint="في حالة عدم توفر الرقم العسكري داخل قاعدة البيانات, سيتم ابلاغ قسم التسجيل بذلك."
                    persistent-hint
                    filled
                    counter="13"
                    @keypress.enter="
                      addNew.values.militaryId &&
                      addNew.values.militaryId.length == 0
                        ? () => {}
                        : searchMilitaryId()
                    "
                    v-model="addNew.values.militaryId"
                  ></v-text-field>
                </v-card-text>
                <v-card-actions class="px-4">
                  <v-spacer></v-spacer>
                  <v-btn
                    :disabled="
                      addNew.values.militaryId &&
                        addNew.values.militaryId.length == 0
                    "
                    v-text="'بحث'"
                    @click="searchMilitaryId()"
                    class="px-6"
                    color="primary"
                    large
                  ></v-btn>
                </v-card-actions>
              </v-window-item>
              <v-window-item>
                <v-card-text>
                  <v-row>
                    <template v-for="(input, i) in addNew.inputs">
                      <v-col
                        :key="i"
                        cols="12"
                        lg="6"
                        v-if="
                          (!input.only3askary ||
                            (input.only3askary &&
                              addNew.values.type == 'عسكرى')) &&
                            !input.onlyTodo
                        "
                      >
                        <v-text-field
                          v-if="!input.type || input.type == 'text'"
                          filled
                          :label="input.label"
                          hide-details
                          :prepend-inner-icon="input.icon"
                          v-model="addNew.values[input.model]"
                          @keypress.enter="addRequest()"
                        ></v-text-field>
                        <v-autocomplete
                          v-else-if="input.type == 'select'"
                          filled
                          :label="input.label"
                          hide-details
                          :items="
                            selects[input.model] && selects[input.model].data
                              ? selects[input.model].data
                              : []
                          "
                          :item-text="selects[input.model].text"
                          :item-value="selects[input.model].value"
                          :prepend-inner-icon="input.icon"
                          clearable
                          v-model="addNew.values[input.model]"
                        ></v-autocomplete>
                        <v-combobox
                          v-else-if="input.type == 'select-user'"
                          filled
                          :label="input.label"
                          hide-details
                          clearable
                          :items="
                            selects[input.model] && selects[input.model].data
                              ? selects[input.model].data
                              : []
                          "
                          :item-text="selects[input.model].text"
                          :item-value="selects[input.model].value"
                          :prepend-inner-icon="input.icon"
                          v-model="addNew.values[input.model]"
                          :return-object="false"
                        ></v-combobox>
                      </v-col>
                    </template>
                  </v-row>
                </v-card-text>
              </v-window-item>
            </v-window>
          </v-card-text>
          <v-card-actions class="px-4" v-if="window == 3">
            <v-spacer></v-spacer>
            <v-btn
              v-text="'إضافة الطلب'"
              large
              color="primary"
              @click="addRequest()"
              class="px-6"
            ></v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
    <div v-else-if="params.section == 'search'">
      <advanced-search
        ref="searchRequestsComponent"
        @open-request="openRequest"
      ></advanced-search>
    </div>
    <div v-else-if="params.section == 'followup'">
      <admin-followup></admin-followup>
    </div>
    <v-dialog
      v-if="isCurrentRoute(componentName)"
      ref="editRequestDialog"
      v-model="addNew.model"
      max-width="700"
      scrollable
      persistent
    >
      <v-card :loading="addNew.loading" :disabled="addNew.loading">
        <v-card-title class="white--text primary">
          {{ addNew.modelTodo == "edit" ? "تعديل" : "الرد على" }}
          طلب
          <v-spacer></v-spacer>
          <v-btn dark icon @click="addNew.model = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-row>
            <template v-for="(input, i) in addNew.inputs">
              <v-col
                :key="i"
                cols="12"
                lg="6"
                v-if="
                  !input.only3askary ||
                    (input.only3askary && addNew.values.type == 'عسكرى')
                "
              >
                <v-text-field
                  v-if="!input.type || input.type == 'text'"
                  filled
                  :label="input.label"
                  hide-details
                  :prepend-inner-icon="input.icon"
                  v-model="addNew.values[input.modelTodo]"
                  @keypress.enter="addRequest(true)"
                ></v-text-field>
                <v-autocomplete
                  v-else-if="input.type == 'select'"
                  filled
                  :label="input.label"
                  hide-details
                  :items="
                    selects[input.modelTodo] && selects[input.modelTodo].data
                      ? selects[input.modelTodo].data
                      : []
                  "
                  :item-text="selects[input.modelTodo].text"
                  :item-value="selects[input.modelTodo].value"
                  :prepend-inner-icon="input.icon"
                  clearable
                  v-model="addNew.values[input.modelTodo]"
                ></v-autocomplete>
                <v-combobox
                  v-else-if="input.type == 'select-user'"
                  filled
                  :label="input.label"
                  hide-details
                  clearable
                  :items="
                    selects[input.modelTodo] && selects[input.modelTodo].data
                      ? selects[input.modelTodo].data
                      : []
                  "
                  :item-text="selects[input.modelTodo].text"
                  :item-value="selects[input.modelTodo].value"
                  :prepend-inner-icon="input.icon"
                  v-model="addNew.values[input.modelTodo]"
                  :return-object="false"
                ></v-combobox>
              </v-col>
            </template>
          </v-row>
        </v-card-text>
        <v-card-actions class="px-4">
          <v-btn
            @click="addNew.model = false"
            v-text="'رجوع'"
            color="primary"
            text
            class="px-6"
            large
          ></v-btn>
          <v-spacer></v-spacer>
          <!-- <v-btn
            @click="deleteRequest(addNew.values.id)"
            v-text="'حذف'"
            color="error"
            outlined
            class="px-6"
            large
          ></v-btn> -->
          <v-btn
            @click="addRequest(true)"
            class="px-6"
            v-text="'حفظ الطلب'"
            color="primary"
            large
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  name: "db_so_index",
  components: {
    AdvancedSearch: () => import("@/components/dbs/so/search.vue"),
    AdminFollowup: () => import("@/components/dbs/so/followup.vue")
  },
  mounted() {
    this.init();
  },
  watch: {
    "addNew.values.kesmId"(v) {
      if (v) {
        if (!this.selectsBackup.mo5TasId) {
          this.$set(this.selectsBackup, "mo5TasId", this.selects.mo5TasId.data);
        }
        this.$set(
          this.selects.mo5TasId,
          "data",
          this.selectsBackup.mo5TasId.filter(w => w.kesmId == v)
        );
      } else {
        this.$set(this.selects.mo5TasId, "data", this.selectsBackup.mo5TasId);
      }
    }
  },
  data: () => ({
    componentName: "db_so",
    loading: false,
    model: true,
    window: 0,
    windows: [0, 0, 1, 1],
    groupItems: [
      [
        {
          title: "إضافة طلب",
          desc: "إنشاء طلب جديد للمواطن",
          icon: "mdi-plus",
          window: 1,
          sections: [0, 6]
        },
        {
          title: "بحث متقدم",
          desc: "عرض خيارات عديدة للبحث داخل طلبات المواطنين",
          icon: "mdi-magnify",
          to: "search"
        }
        // {
        //   title: "متابعات رئيس الفرع",
        //   desc: "",
        //   icon: "mdi-eye-outline",
        //   to: "followup",
        //   sections: [0]
        // }
      ],
      [
        {
          title: "مدني",
          desc: "",
          icon: "",
          setType: "مدنى",
          window: 3
        },
        {
          title: "عسكري",
          desc: "",
          icon: "",
          setType: "عسكرى",
          window: 2
        }
      ]
    ],
    addNew: {
      model: false,
      loading: false,
      values: {
        motab3A: true,
        accept: false,
        montahy: false
        // type: "", // مدني - عسكري
        // militaryId: "",
        // isExists: false
      },
      inputs: [
        {
          type: "select",
          label: "الطالب",
          model: "type",
          modelTodo: "type",
          onlyTodo: true
        },
        {
          type: "text",
          label: "الرقم العسكري",
          model: "conscripte.militaryId",
          modelTodo: "rakmAskrt",
          only3askary: true,
          onlyTodo: true
        },
        {
          type: "text",
          label: "الإسم",
          model: "conscripte.fullName",
          modelTodo: "name"
        },
        {
          type: "text",
          label: "الرقم القومي",
          model: "conscripte.nationalId",
          modelTodo: "kawmy"
        },
        {
          type: "text",
          label: "العنوان",
          model: "conscripte.address",
          modelTodo: "address"
        },
        {
          type: "text",
          label: "رقم الهاتف",
          model: "conscripte.phone",
          modelTodo: "phone"
        },
        {
          type: "select",
          label: "الدرجة",
          model: "conscripte.degreeId",
          modelTodo: "degreeId",
          only3askary: true
        },
        {
          type: "select",
          label: "الوحدة",
          model: "conscripte.unitId",
          modelTodo: "wehdaId",
          only3askary: true
        },
        {
          type: "select-user",
          label: "الخدمة",
          model: "khedma",
          modelTodo: "khedma",
          addNew: true
        },
        {
          type: "select",
          label: "درجة الأهمية",
          model: "ahmeya",
          modelTodo: "ahmeya"
        },
        {
          type: "select",
          label: "القسم",
          model: "kesmId",
          modelTodo: "kesmId"
        },
        {
          type: "select",
          label: "المختص",
          model: "mo5TasId",
          modelTodo: "mo5TasId"
        }
      ]
    },
    selects: {
      type: {
        text: "t",
        value: "v",
        data: [
          {
            t: "مدنى",
            v: "مدنى"
          },
          {
            t: "عسكرى",
            v: "عسكرى"
          }
        ]
      },
      "conscripte.degreeId": {
        table: "degrees",
        db: "mr",
        text: "degreeType",
        value: "degreeId",
        attrs: ["degreeType", "degreeId"]
      },
      "conscripte.unitId": {
        table: "units",
        db: "mr",
        text: "unitText",
        value: "unitId",
        attrs: ["unitText", "unitId"]
      },
      degreeId: {
        table: "degrees",
        db: "so",
        text: "degreeText",
        value: "degreeId",
        attrs: ["degreeId", "degreeText"]
      },
      wehdaId: {
        table: "units",
        db: "so",
        text: "unitText",
        value: "unitId",
        attrs: ["unitText", "unitId"]
      },
      khedma: {
        table: "tasks",
        db: "so",
        text: "khedma",
        value: "khedma",
        attrs: ["khedma"]
      },
      kesmId: {
        table: "aksams",
        db: "so",
        text: "name",
        value: "id",
        attrs: ["name", "id"]
      },
      mo5TasId: {
        table: "mo5Tasen",
        db: "so",
        text: "name",
        value: "id",
        attrs: ["name", "id", "kesmId"]
      },
      ahmeya: {
        localTable: "priorities",
        text: "displayedText",
        value: "displayedText", // TODO:: A7A - Fix this
        attrs: ["displayedText", "id"]
      }
    },
    selectsBackup: {}
  }),
  methods: {
    async deleteRequest(id) {
      this.$set(this.addNew, "loading", true);
      await this.api(
        "global/delete_all",
        {
          table: "tasks",
          where: {
            id
          }
        },
        "so"
      );
      this.$set(this.addNew, "loading", false);
      this.$set(this.addNew, "model", false);
      this.showSuccess("تم حذف الطلب.");
      if (this.params.section == "search") {
        this.$refs.searchRequestsComponent.searchRequestsToday(
          this.$refs.searchRequestsComponent.showToday
        );
      }
    },
    async openRequest(id) {
      this.$set(this.addNew, "model", true);
      this.$set(this.addNew, "loading", true);
      let task = await this.api(
        "global/get_one",
        {
          table: "tasks",
          where: {
            id
          }
        },
        "so"
      );
      if (task && task.ok && task.data && task.data.id) {
        Object.keys(task.data).forEach(key => {
          let val = task.data[key];
          this.$set(this.addNew.values, key, val);
        });
        this.$set(this.addNew.values, "id", id);
      } else {
        this.showError("تعذر إيجاد الطلب المراد فتحه");
        this.$set(this.addNew, "model", false);
      }
      this.$set(this.addNew, "loading", false);
    },
    setTalabType(type) {
      this.$set(this.addNew.values, "type", type);
    },
    async searchMilitaryId() {
      this.$set(this, "loading", true);
      let militaryId = this.addNew.values.militaryId;
      let conscripte = await this.api("global/get_one", {
          table: "conscriptes",
          where: {
            militaryId
          },
          attrs: [
            "fullName",
            "nationalId",
            "address",
            "phone",
            "degreeId",
            "unitId"
          ]
        }),
        toAdd = [
          "fullName",
          "nationalId",
          "address",
          "phone",
          "degreeId",
          "unitId"
        ];
      if (
        conscripte &&
        conscripte.ok &&
        conscripte.data &&
        conscripte.data.militaryId
      ) {
        let c = conscripte.data;
        this.$set(this.addNew.values, "isExists", true);
        toAdd.forEach(el => {
          this.$set(this.addNew.values, `conscripte.${el}`, c[el]);
        });
      } else {
        this.$set(this.addNew.values, "isExists", false);
        this.showInfo("الرقم العسكري غير موجود, سيتم إعلام قسم التسجيل بذلك.");
        toAdd.forEach(el => {
          this.$set(this.addNew.values, `conscripte.${el}`, null);
        });
      }
      this.$set(this, "window", 3);
      this.$set(this, "loading", false);
    },
    init(specificTable = "") {
      // Get selects
      Object.keys(this.selects).forEach(key => {
        let { db, table, localTable, attrs } = this.selects[key];
        if (table) {
          let obj = {
            table
          };
          if (attrs && attrs.length > 0) {
            obj.attrs = attrs;
          }
          this.$set(this.selects[key], "loading", true);
          this.api("global/get_all", obj, db)
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
    },
    async addRequest(isEdit = false) {
      // Finally adding the request
      this.$set(this, "loading", true);
      this.$set(this.addNew, "loading", true);
      let vals = this.addNew.values,
        conscripte = {};
      if (vals.type == "عسكرى" && !isEdit) {
        Object.keys(vals).forEach(key => {
          if (key.includes("conscripte.") || key == "militaryId") {
            let val = vals[key];
            conscripte[key.replace("conscripte.", "")] = val;
          }
        });
        let where = vals.isExists
          ? {
              militaryId: vals.militaryId
            }
          : conscripte;
        // 1. Add or Update the conscripte
        await this.api(`global/${vals.isExists ? "update" : "create"}_one`, {
          table: "conscriptes",
          where,
          update: conscripte
        });
      }

      // 2. Add the request
      let dataToAdd = {
          type: "type",
          name: isEdit ? "name" : "conscripte.fullName",
          kawmy: isEdit ? "kawmy" : "conscripte.nationalId",
          phone: isEdit ? "phone" : "conscripte.phone",
          address: isEdit ? "address" : "conscripte.address",
          khedma: "khedma",
          rakmAskrt: isEdit ? "rakmAskrt" : "militaryId",
          ahmeya: "ahmeya",
          kesmId: "kesmId",
          mo5TasId: "mo5TasId",
          motab3A: "motab3A",
          accept: "accept",
          montahy: "montahy"
        },
        task = {};
      Object.keys(dataToAdd).forEach(key => {
        let val = dataToAdd[key];
        if (
          vals &&
          (vals[val] ||
            vals[val] === "" ||
            vals[val] === 0 ||
            vals[val] === false)
        ) {
          task[key] = vals[val];
        }
      });
      if (!isEdit) {
        task.timeEnter = new Date();
      }
      await this.api(
        `global/${isEdit ? "update" : "create"}_one`,
        {
          table: "tasks",
          where: isEdit
            ? {
                id: vals.id
              }
            : task,
          update: task
        },
        "so"
      );
      this.showSuccess("تم حفظ الطلب");
      this.emptyFields();
    },
    emptyFields() {
      this.$set(this, "loading", false);
      this.$set(this.addNew, "loading", false);
      this.$set(this.addNew, "model", false);
      this.$set(this, "window", 0);
      let exceptions = ["montahy", "motab3A", "accept"];
      Object.keys(this.addNew.values).forEach(key => {
        if (!exceptions.includes(key)) {
          delete this.addNew.values[key];
        }
      });
      if (this.params.section == "search") {
        this.$refs.searchRequestsComponent.searchRequestsToday(
          this.$refs.searchRequestsComponent.showToday
        );
      }
    }
  },
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
  }
};
</script>
