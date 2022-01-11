<template>
  <div>
    <v-card>
      <v-card-title>
        الروابط المحظورة على الشبكة العسكرية
        <v-spacer></v-spacer>
        <v-btn icon @click="getBlacklist()">
          <v-icon>mdi-reload</v-icon>
        </v-btn>
        <v-btn icon @click="editSomething(false, 'create', 'blacklistItem')">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-card-title>
      <v-divider></v-divider>
      <v-data-table
        :headers="result.blacklist.headers"
        :items="result.blacklist.items"
        v-model="result.blacklist.selected"
        fixed-header
        :loading="result.blacklist.loading"
        :search.sync="result.blacklist.search"
        hide-default-header
        multi-sort
      >
        <template v-slot:header="table">
          <table-header-filters
            :items="result.blacklist.items"
            :table="table"
            :filters.sync="tableFilters.blacklist"
          ></table-header-filters>
        </template>
        <template v-slot:footer="table">
          <table-footer-filters
            :filters.sync="tableFilters.blacklist"
            :table="table"
          ></table-footer-filters>
        </template>
        <template v-slot:item.isExcludedForOurUsername="{ item }">
          <div>
            <v-chip small :color="item.isExcludedForOurUsername ? 'error' : ''">
              {{ item.isExcludedForOurUsername ? "مستثنى" : "لا" }}
            </v-chip>
          </div>
        </template>
        <template v-slot:item.isDisabled="{ item }">
          <div>
            <v-chip small :color="item.isDisabled ? 'error' : ''">
              {{ item.isDisabled ? "معطل" : "فعال" }}
            </v-chip>
          </div>
        </template>
        <template v-slot:item.edit_me="{ item }">
          <div>
            <v-chip color="transparent">
              <v-btn
                icon
                color="primary"
                @click="editSomething(false, 'update', 'blacklistItem', item)"
              >
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn
                icon
                color="error"
                v-if="isAdmin()"
                @click="
                  (del.type = 'blacklistItem'),
                    (del.id = item.id),
                    (del.model = true)
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
          حذف رابط
          <v-spacer></v-spacer>
          <v-btn icon dark @click="del.model = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pt-6">
          <div>
            هل تريد بالتأكيد حذف الرابط؟
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
      max-width="500"
      v-model="edit.model"
    >
      <v-card :loading="edit.loading" :disabled="edit.loading">
        <v-card-title class="white--text primary">
          {{ edit.actionType == "create" ? "إضافة" : "تعديل" }}
          رابط
          <v-spacer></v-spacer>
          <v-btn dark icon @click="edit.model = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pt-6">
          <v-row v-if="inputs && inputs[edit.type]">
            <template v-for="(item, i) in inputs[edit.type]">
              <v-col :key="i" cols="12">
                <v-text-field
                  v-if="!item.type || item.type == 'text'"
                  :label="item.label"
                  persistent-hint
                  :hint="item.hint"
                  @keypress.enter="editSomething(true)"
                  filled
                  v-model="edit[edit.type][item.model]"
                ></v-text-field>
                <v-autocomplete
                  v-else-if="item.type == 'select'"
                  :label="item.label"
                  persistent-hint
                  :hint="item.hint"
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
  name: "websiteBlacklists",
  mounted() {
    this.getBlacklist();
  },
  data: () => ({
    componentName: "websiteBlacklists",
    tableFilters: {
      blacklist: {}
    },
    inputs: {
      blacklistItem: [
        {
          label: "الرابط",
          hint: "قم بنسخ الرابط الذي تريد حظره من المتصفح وألصقه هنا",
          model: "url",
          type: "text"
        },
        {
          label: "وصف الرابط",
          hint: "وصف يسمح لك بتذكر الصفحة التي يقوم الرابط بالدخول إليها",
          model: "title",
          type: "text"
        },
        // {
        //   label: "رسالة الخطأ",
        //   hint:
        //     "الرسالة التي ستظهر للمستخدم إذا حاول الدخول لهذا الرابط, في حال ترك هذا الحقل فارغاً سيظهر للمستخدم الرسالة الإفتراضية",
        //   model: "msg",
        //   type: "text"
        // },
        {
          label: "استثناء المستخدم الخاص بسلاح حرس الحدود",
          hint:
            "في حال أردت السماح للمستخدم الخاص بسلاح حرس الحدود الدخول على هذا الرابط",
          model: "isExcludedForOurUsername",
          type: "checkbox"
        },
        {
          label: "تعطيل",
          hint:
            "في حالة تعطيل العنصر, سيبقى داخل القائمة المحظورة لكن المنظومة ستسمح للمستخدم بفتحه",
          model: "isDisabled",
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
      blacklistItem: {
        id: null,
        url: null,
        title: null,
        // msg: null,
        isExcludedForOurUsername: false,
        isDisabled: false
      }
    },
    result: {
      blacklist: {
        loading: false,
        search: "",
        items: [],
        selected: [],
        headers: [
          {
            text: "وصف الرابط",
            value: "title"
          },
          {
            text: "الرابط",
            value: "url"
          },
          // {
          //   text: "رسالة الخطأ",
          //   value: "msg"
          // },
          {
            text: "استثناء المستخدم الخاص بسلاح حرس الحدود",
            value: "isExcludedForOurUsername"
          },
          {
            text: "الحالة",
            value: "isDisabled"
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
        let { type, actionType, blacklistItem } = this.edit,
          where = blacklistItem,
          primaryId = blacklistItem.id;
        delete where.id;
        if (!where.isExcludedForOurUsername) {
          where.isExcludedForOurUsername = false;
        }
        if (!where.isDisabled) {
          where.isDisabled = false;
        }
        let edited = await this.api(`global/${actionType}_one`, {
          table: `websiteBlacklists`,
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
          Object.keys(this.edit.blacklistItem).forEach(key => {
            this.edit.blacklistItem[key] = null;
          });
          this.showSuccess("تم حفظ البيانات.");
          this.getBlacklist();
        } else {
          this.showError("حدث خطأ أثناء تعديل البيانات.");
        }
      } else {
        if (type && type.length > 0 && actionType && actionType.length > 0) {
          this.$set(this.edit, "type", type);
          this.$set(this.edit, "actionType", actionType);
          Object.keys(this.edit.blacklistItem).forEach(key => {
            this.edit.blacklistItem[key] = null;
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
          table: `websiteBlacklists`,
          where: {
            id
          }
        });
      if (delItem && delItem.ok && delItem.data) {
        this.showSuccess("تم حذف المطلوب");
        this.$set(this.del, "model", false);
        this.$set(this.del, "id", "");
        this.$set(this.del, "type", "");
        this.getBlacklist();
      } else {
        this.showError("تعذر حذف المطلوب.");
      }
      this.$set(this.del, "loading", false);
    },
    async getBlacklist() {
      this.$set(this.result.blacklist, "loading", true);
      let items = await this.api("global/get_all", {
        table: "websiteBlacklists"
      });
      if (items && items.ok && items.data) {
        let blacklist = items.data;
        this.$set(this.result.blacklist, "items", blacklist);
      } else {
        this.showError("حدث خطأ أثناء استدعاء الروابط من قاعدة البيانات.");
      }
      this.$set(this.result.blacklist, "loading", false);
    }
  }
};
</script>
