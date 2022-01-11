<template>
  <div>
    <v-card :loading="loading" :disabled="loading">
      <v-row class="py-0 my-0">
        <v-col class="py-0 my-0">
          <v-text-field
            prepend-inner-icon="mdi-magnify"
            v-model.lazy="search"
            filled
            dense
          >
          </v-text-field>
        </v-col>
        <v-col v-if="isAllowed" cols="auto" class="my-0 py-0">
          <div class="pe-4 pt-1">
            <v-btn @click="addNew.model = true" color="primary" outlined>
              <v-icon class="me-2">mdi-plus</v-icon>
              إضافة جديد
            </v-btn>
          </div>
        </v-col>
      </v-row>
      <v-data-table
        class="empty-cells-table"
        :items="externals"
        :headers="headers"
        :search.sync="search"
        fixed-header
        v-model="selected"
        item-key="id"
        hide-default-header
        multi-sort
      >
        <template v-slot:header="table">
          <table-header-filters
            :items="externals"
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
        <!-- Open -->
        <template v-slot:item.actions="{ item }">
          <v-chip color="transparent">
            <v-btn v-if="isAllowed" icon color="primary" @click="openMe(item)">
              <v-icon>mdi-paperclip</v-icon>
            </v-btn>
            <v-btn
              v-if="isAdmin()"
              icon
              color="error"
              @click="openDeleteDialog(item)"
            >
              <v-icon>mdi-trash-can</v-icon>
            </v-btn>
          </v-chip>
        </template>
        <!-- Non empty -->
        <template v-slot:item.supporterId="{ item }">
          <v-chip
            v-if="item.supporterId"
            small
            class="font-weight-bold"
            :color="colors[item.supporterId]"
          >
            {{ supporterIds[item.supporterId] }}
          </v-chip>
        </template>
      </v-data-table>
    </v-card>
    <v-dialog
      v-if="isCurrentRoute(componentName)"
      max-width="600"
      scrollable
      persistent
      v-model="addNew.model"
    >
      <v-card :loading="addNew.loading" :disabled="addNew.loading">
        <v-card-title class="primary white--text">
          {{ addNew.addNewId ? "تعديل دورة" : "إضافة جديد" }}
          <v-spacer></v-spacer>
          <v-btn dark @click="closeMe()" icon>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pt-4">
          <v-row>
            <template v-for="(option, i) in addNew.options">
              <v-col :key="i" cols="12" :md="option.md || '6'">
                <v-text-field
                  v-if="option.type == 'text'"
                  :label="option.label"
                  :hint="option.hint"
                  v-model="addNew.search[option.model]"
                  filled
                  :hide-details="option.hint ? false : true"
                  :persistent-hint="option.hint ? true : false"
                  :loading="option.loading"
                  :disabled="option.disabled"
                  clearable
                ></v-text-field>
                <v-textarea
                  v-else-if="option.type == 'textarea'"
                  :label="option.label"
                  :hint="option.hint"
                  v-model="addNew.search[option.model]"
                  filled
                  :hide-details="option.hint ? false : true"
                  :persistent-hint="option.hint ? true : false"
                  :loading="option.loading"
                  clearable
                ></v-textarea>
                <v-autocomplete
                  v-if="option.type == 'select'"
                  :label="option.label"
                  :hint="option.hint"
                  v-model="addNew.search[option.model]"
                  :items="
                    selects[option.model] ? selects[option.model].data : []
                  "
                  :item-value="
                    selects[option.model]
                      ? selects[option.model].value
                      : 'value'
                  "
                  :item-text="
                    selects[option.model] ? selects[option.model].text : 'text'
                  "
                  filled
                  :error-messages="
                    selects[option.model] ? selects[option.model].error : ''
                  "
                  :hide-details="option.hint ? false : true"
                  :persistent-hint="option.hint ? true : false"
                  :loading="
                    (selects[option.model] && selects[option.model].loading) ||
                      option.loading
                  "
                  clearable
                ></v-autocomplete>
                <v-text-field
                  v-model="addNew.search[option.model]"
                  :prepend-inner-icon="option.icon"
                  :hint="option.hint"
                  :persistent-hint="option.hint ? true : false"
                  :hide-details="option.hint ? false : true"
                  :label="option.label"
                  :error-messages="option.error"
                  filled
                  :clearable="
                    option.range ? false : !option.readonly && !option.disabled
                  "
                  :append-icon="
                    option.range &&
                    addNew.search[option.model] &&
                    addNew.search[option.model].length > 0 &&
                    !option.readonly &&
                    !option.disabled
                      ? 'mdi-close'
                      : ''
                  "
                  @click:append="
                    option.range ? (addNew.search[option.model] = []) : () => {}
                  "
                  type="date"
                  v-else-if="
                    option.type == 'date' && !$store.state.appInfo.dateDialog
                  "
                >
                </v-text-field>
                <v-dialog
                  v-else-if="
                    option.type == 'date' && $store.state.appInfo.dateDialog
                  "
                  :ref="`${option.model}`"
                  v-model="dialogs[`${option.model}`]"
                  :return-value.sync="addNew.search[option.model]"
                  width="300px"
                  :disabled="option.readonly"
                  persistent
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="addNew.search[option.model]"
                      :prepend-inner-icon="option.icon"
                      :hint="option.hint"
                      :persistent-hint="option.hint ? true : false"
                      :hide-details="option.hint ? false : true"
                      :label="option.label"
                      readonly
                      :error-messages="option.error"
                      filled
                      v-on="on"
                      :clearable="
                        option.range
                          ? false
                          : !option.readonly && !option.disabled
                      "
                      :append-icon="
                        option.range &&
                        addNew.search[option.model] &&
                        addNew.search[option.model].length > 0 &&
                        !option.readonly &&
                        !option.disabled
                          ? 'mdi-close'
                          : ''
                      "
                      @click:append="
                        option.range
                          ? (addNew.search[option.model] = [])
                          : () => {}
                      "
                    >
                    </v-text-field>
                  </template>
                  <v-date-picker
                    :ref="`${option.model}_picker`"
                    v-model="addNew.search[option.model]"
                    scrollable
                    color="primary"
                    :range="option.range"
                  >
                    <v-spacer></v-spacer>
                    <v-btn
                      color="primary"
                      outlined
                      class="px-6 text-capitalize"
                      @click="dialogs[`${option.model}`] = false"
                      >إلغاء</v-btn
                    >
                    <v-btn
                      color="primary"
                      class="px-6 text-capitalize"
                      @click="
                        $refs[`${option.model}`][0].save(
                          addNew.search[option.model]
                        )
                      "
                      >حفظ</v-btn
                    >
                  </v-date-picker>
                </v-dialog>
              </v-col>
            </template>
          </v-row>
        </v-card-text>
        <v-card-actions class="px-4">
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            large
            outlined
            class="px-6"
            @click="closeMe()"
            v-text="'رجوع'"
          ></v-btn>
          <v-btn
            color="primary"
            large
            class="px-6"
            @click="addOrUpdateData()"
            :disabled="
              !addNew.search.from || !addNew.search.sort || !addNew.search.to
            "
            v-text="addNew.addNewId ? 'تعديل الدورة' : 'إضافة الدورة'"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- <div class="text-left" dir="ltr">
      <pre>
        {{ externals }}
      </pre>
    </div> -->
    <v-dialog scrollable v-model="deleteDialog.model" max-width="450">
      <v-card :loading="deleteDialog.loading" :disabled="deleteDialog.loading">
        <v-card-title class="white--text error">
          حذف دورة
          <v-spacer></v-spacer>
          <v-btn dark @click="deleteDialog.model = false" icon>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pt-4">
          هل تريد بالتأكيد حذف الدورة؟
        </v-card-text>
        <v-card-actions class="px-4">
          <v-spacer></v-spacer>
          <v-btn
            outlined
            large
            color="error"
            v-text="'رجوع'"
            class="px-6"
            @click="deleteDialog.model = false"
          ></v-btn>
          <v-btn
            large
            color="error"
            v-text="'حذف الدورة'"
            class="px-6"
            @click="deleteMe(deleteDialog.item)"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "basic-profile-ignorants",
  mounted() {
    this.init();
  },
  props: {
    externals: {
      type: Array,
      default: () => []
    },
    conscripte: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    isAllowed() {
      let allowZone = this.allowZone,
        section = this.$store.state.currentUser.section;
      if (allowZone.includes(section) || this.isAdmin()) {
        return true;
      }
      return false;
    }
  },
  data: () => ({
    componentName: "soldiers_plus",
    tableFilters: {},
    deleteDialog: {
      model: false,
      loading: false,
      item: {}
    },
    allowZone: [1, 2],
    dialogs: {},
    addNew: {
      addNewId: "",
      model: false,
      loading: false,
      search: {
        sort: null,
        from: null,
        to: null,
        supporterId: null
      },
      options: [
        {
          label: "رقم الدورة",
          model: "sort",
          type: "text"
        },
        {
          label: "النتيجة",
          model: "supporterId",
          type: "select"
        },
        {
          label: "من",
          model: "from",
          type: "date"
        },
        {
          label: "الى",
          model: "to",
          type: "date"
        }
      ]
    },
    selects: {
      supporterId: {
        text: "displayedText",
        value: "id",
        data: [
          {
            id: 1,
            displayedText: "ناجح"
          },
          {
            id: 7,
            displayedText: "راسب"
          }
        ]
      }
    },
    loading: false,
    supporterIds: {
      "1": "شهادة محو أمية",
      "2": "خطاب نجاح",
      "3": "بيان نجاح بالدرجات",
      "4": "شهادة ابتدائية",
      "5": "راسب إعدادية",
      "6": "شهادة إعدادية",
      "7": "راسب"
    },
    colors: {
      1: "success",
      2: "error",
      3: "orange",
      4: "default"
    },
    selected: [],
    headers: [
      {
        text: "رقم الدورة",
        sortable: true,
        value: "sort"
      },
      {
        text: "من",
        sortable: true,
        value: "from"
      },
      {
        text: "الى",
        sortable: true,
        value: "to"
      },
      {
        text: "المؤيد",
        sortable: true,
        value: "supporterId"
      },
      {
        text: "",
        sortable: false,
        value: "actions"
      }
    ],
    search: ""
  }),
  methods: {
    closeMe() {
      this.$set(this.addNew, "addNewId", "");
      Object.keys(this.addNew.search).forEach(key => {
        this.$set(this.addNew.search, key, null);
      });
      this.$set(this.addNew, "model", false);
    },
    openMe(item) {
      let newItem = this.fixDates([item], ["from", "to"])[0];
      this.$set(this.addNew, "addNewId", newItem.id);
      Object.keys(this.addNew.search).forEach(key => {
        if (newItem[key]) {
          this.$set(this.addNew.search, key, newItem[key]);
        }
      });
      this.$set(this.addNew, "model", true);
    },
    openDeleteDialog(item) {
      this.$set(this.deleteDialog, "item", item);
      this.$set(this.deleteDialog, "model", true);
    },
    deleteMe(item) {
      this.$set(this.deleteDialog, "loading", true);
      this.$set(this, "loading", true);
      this.api("global/delete_all", {
        table: "failureSessions",
        where: {
          id: item.id
        }
      })
        .then(async x => {
          this.addModification(this.conscripte.militaryId, 3, 6);
          this.showSuccess("تم الحذف بنجاح");
          let index = this.externals.findIndex(f => f.id == item.id);
          this.externals.splice(index, 1);
          // this.$emit("updateCounter", {
          //   id: "injuries",
          //   counter: this.externals.length
          // });
          await this.fixDemobilizationDate(this.conscripte.militaryId)
            .then(() => {})
            .catch(() => {});
        })
        .catch(error => {
          console.log(error);
        })
        .finally(() => {
          this.$set(this.deleteDialog, "loading", false);
          this.$set(this, "loading", false);
          this.$set(this.deleteDialog, "model", false);
        });
    },
    addOrUpdateData() {
      let data = this.fixDates([this.addNew.search], ["from", "to"])[0],
        addNewId = this.addNew.addNewId;
      // console.log(...data);
      let where = {},
        update = { ...data, milId: this.conscripte.militaryId };
      if (addNewId) {
        // Update
        where = {
          id: addNewId
        };
      } else {
        // Create new
        where = {
          ...data,
          milId: this.conscripte.militaryId
        };
      }
      this.$set(this.addNew, "loading", true);
      this.api(`global/${addNewId ? "update_one" : "create_one"}`, {
        table: "failureSessions",
        where,
        update,
        returner: "id"
      })
        .then(async x => {
          console.log(x);
          this.addModification(this.conscripte.militaryId, addNewId ? 2 : 1, 6);
          let index = addNewId
              ? this.externals.findIndex(f => f.id == addNewId)
              : this.externals.length,
            newExternalId = addNewId ? addNewId : x.data,
            newExternal = await this.api("global/get_one", {
              table: "failureSessions",
              where: {
                id: newExternalId
              }
            });
          this.$set(
            this.externals,
            index,
            this.fixDates([newExternal.data], ["from", "to"])[0]
          );
          this.showSuccess("تمت العملية بنجاح");
          this.closeMe();
          await this.fixDemobilizationDate(this.conscripte.militaryId)
            .then(() => {})
            .catch(() => {});
        })
        .catch(error => {
          console.log(error);
          this.showError("حدث خطأ أثناء الإتصال بقاعدة البيانات");
        })
        .finally(() => {
          this.$set(this.addNew, "loading", false);
        });
    },
    init(custom) {
      // Get selects
      let iterators =
        custom && custom.length > 0
          ? Object.keys(this.selects).filter(f => f.model == custom)
          : Object.keys(this.selects);
      iterators.forEach(key => {
        let { table } = this.selects[key];
        if (table) {
          this.$set(this.selects[key], "loading", true);
          this.api("global/get_all", {
            table
          })
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
        }
      });
    }
  }
};
</script>
