<template>
  <div>
    <v-card>
      <v-card-title>
        باسوردات الوحدات
        <v-spacer></v-spacer>
        <v-btn icon @click="getUnits()">
          <v-icon>mdi-reload</v-icon>
        </v-btn>
        <v-btn icon @click="editSomething(false, 'create', 'unit')">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-card-title>
      <v-divider></v-divider>
      <!-- <v-text-field
        prepend-inner-icon="mdi-magnify"
        v-model.lazy="result.units.search"
        filled
        dense
      ></v-text-field> -->
      <v-data-table
        :headers="result.units.headers"
        :items="result.units.items"
        v-model="result.units.selected"
        fixed-header
        :loading="result.units.loading"
        :search.sync="result.units.search"
        hide-default-header
        multi-sort
      >
        <template v-slot:header="table">
          <table-header-filters
            :items="result.units.items"
            :table="table"
            :filters.sync="tableFilters.units"
          ></table-header-filters>
        </template>
        <template v-slot:footer="table">
          <table-footer-filters
            :filters.sync="tableFilters.units"
            :table="table"
          ></table-footer-filters>
        </template>
        <template v-slot:item.isOld="{ item }">
          <div>
            <v-chip :color="item.isOld ? 'error' : ''">
              {{ item.isOld ? "قديمة" : "حديثة" }}
            </v-chip>
          </div>
        </template>
        <template v-slot:item.edit_me="{ item }">
          <div>
            <v-chip color="transparent">
              <v-btn
                icon
                color="primary"
                @click="editSomething(false, 'update', 'unit', item)"
              >
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn
                icon
                color="error"
                v-if="isAdmin()"
                @click="
                  (del.type = 'unit'), (del.id = item.id), (del.model = true)
                "
              >
                <v-icon>mdi-trash-can-outline</v-icon>
              </v-btn>
            </v-chip>
          </div>
        </template>
      </v-data-table>
    </v-card>
    <!-- Confirm Delete Dialog -->
    <v-dialog
      v-if="isCurrentRoute(componentName)"
      scrollable
      persistent
      max-width="550"
      v-model="del.model"
    >
      <v-card :loading="del.loading" :disabled="del.loading">
        <v-card-title class="white--text error">
          حذف وحدة
          <v-spacer></v-spacer>
          <v-btn icon dark @click="del.model = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pt-6">
          <div>
            هل تريد بالتأكيد حذف الوحدة؟
          </div>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="px-4">
          <v-spacer></v-spacer>
          <v-btn
            color="error"
            outlined
            @click="del.model = false"
            v-text="'عودة'"
            large
            class="px-6"
          ></v-btn>
          <v-btn
            color="error"
            @click="deleteSomething()"
            v-text="'حذف'"
            large
            class="px-6"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-if="isCurrentRoute(componentName)"
      scrollable
      persistent
      max-width="750"
      v-model="edit.model"
    >
      <v-card :loading="edit.loading" :disabled="edit.loading">
        <v-card-title class="white--text primary">
          {{ edit.actionType == "create" ? "إضافة" : "تعديل" }}
          وحدة
          <v-spacer></v-spacer>
          <v-btn dark icon @click="edit.model = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pt-6">
          <v-row v-if="inputs && inputs[edit.type]">
            <template v-for="(item, i) in inputs[edit.type]">
              <v-col :key="i" cols="6">
                <v-text-field
                  v-if="!item.type || item.type == 'text'"
                  :label="item.label"
                  hide-details
                  @keypress.enter="editSomething(true)"
                  filled
                  v-model="edit[edit.type][item.model]"
                ></v-text-field>
                <v-autocomplete
                  v-else-if="item.type == 'select'"
                  :label="item.label"
                  hide-details
                  filled
                  v-model="edit[edit.type][item.model]"
                  :items="
                    selects && selects[item.model] && selects[item.model].data
                      ? selects[item.model].data
                      : []
                  "
                  :item-text="
                    selects && selects[item.model] && selects[item.model].text
                      ? selects[item.model].text
                      : []
                  "
                  :item-value="
                    selects && selects[item.model] && selects[item.model].value
                      ? selects[item.model].value
                      : []
                  "
                  clearable
                ></v-autocomplete>
                <v-btn-toggle
                  mandatory
                  v-else-if="item.type == 'radio'"
                  v-model="edit[edit.type][item.model]"
                  style="width: 100%"
                >
                  <template v-for="(v, i) in ['falsey', 'truely']">
                    <v-btn
                      height="58"
                      x-large
                      width="50%"
                      :active-class="
                        `${i == 1 ? 'error' : 'primary'} white--text`
                      "
                      :key="i"
                      v-text="item[v]"
                      :value="i == 1 ? true : false"
                    ></v-btn>
                  </template>
                </v-btn-toggle>
                <v-checkbox
                  v-else-if="item.type == 'checkbox'"
                  v-model="edit[edit.type][item.model]"
                  :label="item.label"
                  :hint="item.hint"
                  persistent-hint
                ></v-checkbox>
              </v-col>
            </template>
          </v-row>
        </v-card-text>
        <v-card-actions class="px-4">
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            outlined
            @click="edit.model = false"
            v-text="'عودة'"
            large
            class="px-6"
          ></v-btn>
          <v-btn
            color="primary"
            @click="editSomething(true)"
            v-text="
              edit.actionType == 'create' ? 'إضافة جديد' : 'حفظ التعديلات'
            "
            large
            class="px-6"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "edit-units-passwords",
  mounted() {
    this.getUnits();
  },
  data: () => ({
    componentName: "edit_units_passwords",
    tableFilters: {
      units: {}
    },
    inputs: {
      unit: [
        {
          label: "الوحدة",
          model: "unitText",
          type: "text"
        },
        {
          label: "اسم المستخدم",
          model: "username",
          type: "text"
        },
        {
          label: "كلمة المرور",
          model: "password",
          type: "text"
        },
        {
          label: "المستخدم الخاص بسلاحنا",
          hint:
            "هذا المستخدم سيكون بإمكانك استثناءه من المواقع المحظورة على الشبكة العسكرية",
          model: "isOurUsername",
          type: "checkbox"
        }
      ]
    },
    del: {
      loading: false,
      model: false,
      id: null,
      type: ""
    },
    edit: {
      loading: false,
      model: false,
      type: "",
      actionType: "",
      unit: {
        id: null,
        unitText: null,
        username: null,
        password: null,
        isOurUsername: false
      }
    },
    result: {
      units: {
        loading: false,
        search: "",
        items: [],
        selected: [],
        headers: [
          {
            text: "الوحدة",
            value: "unitText"
          },
          {
            text: "اسم المستخدم",
            value: "username"
          },
          {
            text: "كلمة المرور",
            value: "password"
          },
          {
            text: "",
            value: "edit_me",
            sortable: false
          }
        ]
      }
    }
  }),
  methods: {
    async editSomething(runDB = false, actionType = "", type = "", item = {}) {
      if (runDB) {
        this.$set(this.edit, "loading", true);
        let { type, actionType, unit } = this.edit,
          where = unit,
          primaryId = unit.id,
          lastId =
            actionType == "create"
              ? await this.api("global/get_one", {
                  table: "webUnitsPasswords"
                })
              : null;
        delete where.id;
        if (!where.isOurUsername) {
          where.isOurUsername = false;
        }
        let edited = await this.api(`global/${actionType}_one`, {
          table: `webUnitsPasswords`,
          where:
            actionType == "update"
              ? {
                  id: primaryId
                }
              : where,
          update: where
        });
        if (edited && edited.ok && edited.data) {
          this.$set(this.edit, "loading", false);
          this.$set(this.edit, "model", false);
          Object.keys(this.edit.unit).forEach(key => {
            this.edit.unit[key] = null;
          });
          this.showSuccess("تم حفظ البيانات.");
          this.getUnits();
        } else {
          this.showError("حدث خطأ أثناء تعديل البيانات.");
        }
      } else {
        if (type && type.length > 0 && actionType && actionType.length > 0) {
          this.$set(this.edit, "type", type);
          this.$set(this.edit, "actionType", actionType);
          Object.keys(this.edit.unit).forEach(key => {
            this.edit.unit[key] = null;
          });
          Object.keys(item).forEach(key => {
            let val = item[key];
            this.$set(this.edit[type], key, val);
          });
          this.$set(this.edit, "model", true);
        }
      }
    },
    async deleteSomething() {
      this.$set(this.del, "loading", true);
      let { id, type } = this.del,
        delItem = await this.api("global/delete_all", {
          table: `webUnitsPasswords`,
          where: {
            id
          }
        });
      if (delItem && delItem.ok && delItem.data) {
        this.showSuccess("تم حذف المطلوب");
        this.$set(this.del, "model", false);
        this.$set(this.del, "id", "");
        this.$set(this.del, "type", "");
        this.getUnits();
      } else {
        this.showError("تعذر حذف المطلوب.");
      }
      this.$set(this.del, "loading", false);
    },
    async getUnits() {
      this.$set(this.result.units, "loading", true);
      let items = await this.api("global/get_all", {
        table: "webUnitsPasswords"
      });
      if (items && items.ok && items.data) {
        let units = items.data;
        this.$set(this.result.units, "items", units);
      } else {
        this.showError("حدث خطأ أثناء استدعاء الوحدات من قاعدة البيانات.");
      }
      this.$set(this.result.units, "loading", false);
    }
  }
};
</script>
