<template>
  <div>
    <v-card>
      <v-card-title>
        المستخدمين
        <v-spacer></v-spacer>
        <v-btn icon @click="getUsers()">
          <v-icon>mdi-reload</v-icon>
        </v-btn>
        <v-btn icon @click="editUser(false, 'create')">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
        <v-btn-toggle class="ms-4" v-model="result.showDeleted" mandatory>
          <template v-for="(t, i) in ['الفعال', 'المحذوف']">
            <v-btn
              :key="i"
              :active-class="`white--text ${i == 1 ? 'error' : 'primary'}`"
              v-text="t"
              :value="i == 1 ? true : false"
            ></v-btn>
          </template>
        </v-btn-toggle>
      </v-card-title>
      <v-divider></v-divider>
      <v-data-table
        :headers="result.headers"
        :items="result.items.filter(i => i.isVisible == !result.showDeleted)"
        v-model="result.selected"
        fixed-header
        :loading="result.loading"
        :search.sync="result.search"
        hide-default-header
        multi-sort
      >
        <template v-slot:header="table">
          <table-header-filters
            :items="
              result.items.filter(i => i.isVisible == !result.showDeleted)
            "
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

        <template v-slot:item.canAddFollowup="{ item }">
          <span
            v-text="
              selects.canAddFollowup.data.filter(
                r => r.value == item.canAddFollowup
              )[0] &&
              selects.canAddFollowup.data.filter(
                r => r.value == item.canAddFollowup
              )[0].text
                ? selects.canAddFollowup.data.filter(
                    r => r.value == item.canAddFollowup
                  )[0].text
                : ''
            "
          ></span>
        </template>
        <template v-slot:item.canUnfollow="{ item }">
          <span
            v-text="
              selects.canUnfollow.data.filter(
                r => r.value == item.canUnfollow
              )[0] &&
              selects.canUnfollow.data.filter(
                r => r.value == item.canUnfollow
              )[0].text
                ? selects.canUnfollow.data.filter(
                    r => r.value == item.canUnfollow
                  )[0].text
                : ''
            "
          ></span>
        </template>
        <template v-slot:item.section="{ item }">
          <span
            v-text="
              selects.section.data.filter(r => r.value == item.section)[0] &&
              selects.section.data.filter(r => r.value == item.section)[0].text
                ? selects.section.data.filter(r => r.value == item.section)[0]
                    .text
                : ''
            "
          ></span>
        </template>
        <template v-slot:item.password="{ item }">
          <div>
            <span v-text="item.isNotPassword ? item.password : '****'"></span>
            <v-btn
              icon
              @click="
                item.isNotPassword
                  ? (item.isNotPassword = false)
                  : (item.isNotPassword = true)
              "
            >
              <v-icon
                size="22"
                v-text="item.isNotPassword ? 'mdi-eye' : 'mdi-eye-off'"
              ></v-icon>
            </v-btn>
          </div>
        </template>
        <template v-slot:item.edit_me="{ item }">
          <div>
            <v-chip color="transparent">
              <v-btn
                icon
                color="primary"
                @click="editUser(false, 'update', item)"
              >
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn
                v-if="isAdmin()"
                icon
                :color="result.showDeleted ? 'success' : 'error'"
                @click="
                  (del.id = item.userId),
                    (del.model = true),
                    (del.type = result.showDeleted)
                "
              >
                <v-icon
                  v-text="
                    result.showDeleted
                      ? 'mdi-redo-variant'
                      : 'mdi-trash-can-outline'
                  "
                ></v-icon>
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
        <v-card-title :class="`white--text ${del.type ? 'success' : 'error'}`">
          {{ del.type ? "استعادة" : "حذف" }} مستخدم
          <v-spacer></v-spacer>
          <v-btn icon dark @click="del.model = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pt-6">
          <div>
            هل تريد بالتأكيد {{ del.type ? "استعادة" : "حذف" }} المستخدم؟
          </div>
          <div v-if="!del.type">
            <span class="error--text">
              لاحظ من فضلك :
            </span>
            <ul style="list-style-type: none">
              <li>
                - لن يتم حذف المستخدم بالكامل من قاعدة البيانات
              </li>
              <li>
                - سيتم اخفاء المستخدم ومنعه من تسجيل الدخول
              </li>
              <li>
                - لن يتم السماح باستعمال "اسم المستخدم" الخاص به لإنشاء مستخدم
                جديد
              </li>
            </ul>
          </div>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="px-4">
          <v-spacer></v-spacer>
          <v-btn
            :color="del.type ? 'success' : 'error'"
            outlined
            @click="del.model = false"
            v-text="'عودة'"
            large
            class="px-6"
          ></v-btn>
          <v-btn
            :color="del.type ? 'success' : 'error'"
            @click="deleteUser()"
            v-text="del.type ? 'استعادة' : 'حذف'"
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
          مستخدم
          <v-spacer></v-spacer>
          <v-btn dark icon @click="edit.model = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pt-6">
          <v-row v-if="inputs && inputs">
            <template v-for="(item, i) in inputs">
              <v-col :key="i" cols="6">
                <v-text-field
                  v-if="!item.type || item.type == 'text'"
                  :label="item.label"
                  :hide-details="
                    item.model == 'username' && edit.actionType == 'create'
                      ? result.items.find(u => u.username == edit.user.username)
                        ? false
                        : true
                      : true
                  "
                  @keypress.enter="editUser(true)"
                  filled
                  v-model="edit.user[item.model]"
                  :error-messages="
                    item.model == 'username' && edit.actionType == 'create'
                      ? result.items.find(u => u.username == edit.user.username)
                        ? 'اسم المستخدم هذا مستعمل بالفعل'
                        : ''
                      : ''
                  "
                  :disabled="
                    item.model == 'username' && edit.actionType == 'update'
                  "
                ></v-text-field>
                <v-text-field
                  v-else-if="item.type == 'password'"
                  :label="item.label"
                  hide-details
                  @keypress.enter="editUser(true)"
                  filled
                  v-model="edit.user[item.model]"
                  :type="item.isPassword ? 'password' : 'text'"
                  :append-icon="item.isPassword ? 'mdi-eye-off' : 'mdi-eye'"
                  @click:append="item.isPassword = !item.isPassword"
                ></v-text-field>
                <v-autocomplete
                  v-else-if="item.type == 'select'"
                  :label="item.label"
                  hide-details
                  filled
                  v-model="edit.user[item.model]"
                  :items="
                    selects && selects[item.model] && selects[item.model].data
                      ? selects[item.model].data
                      : []
                  "
                  :item-text="
                    selects && selects[item.model] && selects[item.model].text
                      ? selects[item.model].text
                      : 'text'
                  "
                  :item-value="
                    selects && selects[item.model] && selects[item.model].value
                      ? selects[item.model].value
                      : 'value'
                  "
                  clearable
                ></v-autocomplete>
                <v-btn-toggle
                  mandatory
                  v-else-if="item.type == 'checkbox'"
                  v-model="edit.user[item.model]"
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
              </v-col>
            </template>
          </v-row>
        </v-card-text>
        <v-card-actions class="px-6">
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
            @click="editUser(true)"
            v-text="
              edit.actionType == 'create' ? 'إضافة جديد' : 'حفظ التعديلات'
            "
            large
            :disabled="
              !edit.user.username ||
              (edit.actionType == 'create' &&
                result.items.find(u => u.username == edit.user.username))
                ? true
                : false
            "
            class="px-6"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
const constants = require("../../Constant").default;

export default {
  name: "edit-users",
  mounted() {
    this.getUsers();
  },
  data: () => ({
    componentName: "edit_users",
    tableFilters: {},
    inputs: [
      {
        label: "الإسم",
        model: "realName"
      },
      {
        label: "اسم المستخدم",
        model: "username"
      },
      {
        label: "كلمة المرور",
        model: "password",
        type: "password",
        isPassword: true
      },
      {
        label: "الدرجة",
        model: "degree"
      },
      // {
      //   label: "الصلاحية",
      //   model: "role",
      //   type: "select"
      // },
      {
        label: "القسم المختص",
        model: "section",
        type: "select"
      },
      {
        label: "صلاحية إضافة متابعة",
        model: "canAddFollowup",
        type: "select"
      },
      {
        label: "صلاحية رفع المتابع",
        model: "canUnfollow",
        type: "select"
      }
    ],
    selects: {
      canAddFollowup: {
        data: [
          {
            text: "نعم",
            value: true
          },
          {
            text: "لا",
            value: false
          }
        ],
        text: "text",
        value: "value"
      },
      canUnfollow: {
        data: [
          {
            text: "نعم",
            value: true
          },
          {
            text: "لا",
            value: false
          }
        ],
        text: "text",
        value: "value"
      },
      section: {
        data: constants.sections,
        text: "text",
        value: "value"
      }
    },
    del: {
      loading: false,
      model: false,
      id: null,
      type: false
    },
    edit: {
      loading: false,
      model: false,
      actionType: "",
      // User Model
      user: {
        username: null,
        password: null,
        role: null,
        userId: null,
        realName: null,
        degree: null,
        section: "",
        dateAdded: null,
        isVisible: null,
        canAddFollowup: false,
        canUnfollow: false
      }
    },
    result: {
      showDeleted: false,
      loading: false,
      search: "",
      items: [],
      selected: [],
      headers: [
        {
          text: "الدرجة",
          value: "degree",
          sortable: true
        },
        {
          text: "الإسم",
          value: "realName",
          sortable: true
        },
        {
          text: "اسم المستخدم",
          value: "username",
          sortable: true
        },
        {
          text: "كلمة السر",
          value: "password",
          sortable: true
        },
        {
          text: "الصلاحية",
          value: "role",
          sortable: true
        },
        {
          text: "القسم",
          value: "section",
          sortable: true
        },
        {
          text: "إضافة متابعات؟",
          value: "canAddFollowup",
          sortable: true
        },
        {
          text: "رفع المتابع؟",
          value: "canUnfollow",
          sortable: true
        },
        {
          text: "تاريخ الإضافة",
          value: "dateAdded",
          sortable: true
        },
        // {
        //   text: "",
        //   value: "isVisible",
        //   sortable: true
        // },
        {
          text: "",
          value: "edit_me",
          sortable: false
        }
      ]
    }
  }),
  methods: {
    async editUser(runDB = false, actionType = "", item = {}) {
      if (runDB) {
        this.$set(this.edit, "loading", true);
        let { actionType, user } = this.edit,
          where = user,
          primaryId = user.userId;
        where.canUnfollow = where.canUnfollow ? true : false;
        where.canAddFollowup = where.canAddFollowup ? true : false;
        where.role = where.role ? where.role : 2; //مراجع
        delete where.userId;
        if (!user.username) {
          this.showError("لا يمكن الحفظ بدون ادخال اسم المستخدم");
          this.$set(this.edit, "loading", false);
          return;
        }
        console.log(where);
        let edited = await this.api(`global/${actionType}_one`, {
          table: "users",
          where:
            actionType == "update"
              ? {
                  userId: primaryId
                }
              : {
                  ...where,
                  dateAdded: new Date(),
                  isVisible: 1
                },
          update: where
        });
        if (edited && edited.ok && edited.data) {
          this.$set(this.edit, "model", false);
          Object.keys(this.edit.user).forEach(key => {
            this.edit.user[key] = null;
          });
          this.showSuccess("تم حفظ البيانات.");
          this.getUsers();
        } else {
          this.showError("حدث خطأ أثناء حفظ البيانات.");
        }
        this.$set(this.edit, "loading", false);
      } else {
        if (actionType && actionType.length > 0) {
          this.$set(this.edit, "actionType", actionType);
          Object.keys(this.edit.user).forEach(key => {
            this.edit.user[key] = null;
          });
          Object.keys(item).forEach(key => {
            let val = item[key];
            this.$set(this.edit.user, key, val);
          });
          this.$set(this.edit, "model", true);
        }
      }
    },
    async deleteUser() {
      this.$set(this.del, "loading", true);
      let { id, type } = this.del,
        delItem = await this.api("global/update_one", {
          table: "users",
          where: {
            userId: id
          },
          update: {
            isVisible: type
          }
        });
      if (delItem && delItem.ok && delItem.data) {
        this.showSuccess(`تم ${type ? "استعادة" : "حذف"} المطلوب`);
        this.$set(this.del, "model", false);
        this.$set(this.del, "id", "");
        this.$set(this.del, "type", false);
        this.getUsers();
      } else {
        this.showError(`تعذر ${isVisible ? "استعادة" : "حذف"} المطلوب.`);
      }
      this.$set(this.del, "loading", false);
    },
    async getUsers() {
      this.$set(this.result, "loading", true);
      let items = await this.api("global/get_all", {
        table: "users"
      });
      if (items && items.ok && items.data) {
        let users = items.data.sort((a, b) => a.section - b.section);
        for (let i = 0; i < users.length; i++) {
          users[i].isNotPassword = false;
        }
        this.$set(this.result, "items", this.fixDates(users, ["dateAdded"]));
      } else {
        this.showError("حدث خطأ أثناء استدعاء المستخدمين من قاعدة البيانات.");
      }
      this.$set(this.result, "loading", false);
    }
  }
};
</script>
