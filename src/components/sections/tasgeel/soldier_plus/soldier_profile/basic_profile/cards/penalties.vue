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
        item-key="injuryId"
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
        <template v-slot:item.militaryId="{ item }">
          <v-chip
            color="transparent"
            :to="`/soldiers_plus/${item.militaryId}`"
            @click.right="copyText(item.militaryId)"
          >
            {{ item.militaryId }}
          </v-chip>
        </template>
        <template v-slot:item.fullName="{ item }">
          <v-chip
            color="transparent"
            :to="`/soldiers_plus/${item.militaryId}`"
            @click.right="copyText(item.fullName)"
          >
            {{ item.fullName }}
          </v-chip>
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
        <!-- Non empty - Nothing -->
      </v-data-table>
    </v-card>
    <v-dialog
      v-if="isCurrentRoute(componentName)"
      max-width="850"
      scrollable
      persistent
      v-model="addNew.model"
    >
      <v-card :loading="addNew.loading" :disabled="addNew.loading">
        <v-card-title class="primary white--text">
          {{ addNew.addNewId ? "تعديل عقوبة" : "إضافة جديد" }}
          <v-spacer></v-spacer>
          <v-btn dark @click="closeMe()" icon>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pt-4">
          <v-row>
            <template v-for="(option, i) in addNew.options">
              <v-col
                :key="i"
                cols="12"
                :md="option.md || '6'"
                :lg="option.lg || '4'"
              >
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
                  :readonly="option.readonly"
                ></v-text-field>
                <v-textarea
                  v-else-if="option.type == 'textarea'"
                  :label="option.label"
                  :hint="option.hint"
                  v-model="addNew.search[option.model]"
                  filled
                  auto-grow
                  rows="1"
                  :readonly="option.readonly"
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
                  :readonly="option.readonly"
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
                  :readonly="option.readonly"
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
                  :readonly="option.readonly"
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
              !addNew.search.crimeStartDate ||
                !addNew.search.crimeEndDate ||
                !addNew.search.penaltyStartDate ||
                !addNew.search.penaltyEndDate ||
                !addNew.search.penaltyText ||
                !addNew.search.penaltyTypeId
            "
            v-text="addNew.addNewId ? 'تعديل العقوبة' : 'إضافة العقوبة'"
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
          حذف عقوبة
          <v-spacer></v-spacer>
          <v-btn dark @click="deleteDialog.model = false" icon>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pt-4">
          هل تريد بالتأكيد حذف العقوبة؟
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
            v-text="'حذف العقوبة'"
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
  name: "basic-profile-penalties",
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
  watch: {
    "addNew.search.penaltyStartDate"(v) {
      this.calcPenaltyTime();
    },
    "addNew.search.penaltyEndDate"(v) {
      this.calcPenaltyTime();
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
        crimeStartDate: null,
        crimeEndDate: null,
        penaltyTypeId: null,
        penaltyText: null,
        penaltyStartDate: null,
        penaltyEndDate: null,
        penaltyTotalTime: null
      },
      options: [
        {
          label: "الجريمة",
          model: "penaltyText",
          type: "textarea",
          md: 12,
          lg: 12
        },
        {
          label: "بداية الجريمة",
          model: "crimeStartDate",
          type: "date"
        },
        {
          label: "نهاية الجريمة",
          model: "crimeEndDate",
          type: "date"
        },
        {
          label: "نوع العقوبة",
          model: "penaltyTypeId",
          type: "select"
        },
        {
          label: "بداية العقوبة",
          model: "penaltyStartDate",
          type: "date"
        },
        {
          label: "نهاية العقوبة",
          model: "penaltyEndDate",
          type: "date"
        },
        {
          label: "مدة العقوبة",
          model: "penaltyTotalTime",
          type: "text",
          readonly: true
        }
      ]
    },
    selects: {
      penaltyTypeId: {
        table: "penaltyTypes",
        text: "displayText",
        value: "id",
        data: []
      }
    },
    loading: false,
    colors: {
      1: "success",
      2: "error",
      5: "orange"
    },
    selected: [],
    headers: [
      {
        text: "الجريمة",
        sortable: true,
        value: "penaltyText"
      },
      {
        text: "بداية الجريمة",
        sortable: true,
        value: "crimeStartDate"
      },
      {
        text: "نهاية الجريمة",
        sortable: true,
        value: "crimeEndDate"
      },
      {
        text: "بداية العقوبة",
        sortable: true,
        value: "penaltyStartDate"
      },
      {
        text: "نهاية العقوبة",
        sortable: true,
        value: "penaltyEndDate"
      },
      {
        text: "نوع العقوبة",
        sortable: true,
        value: "penaltyType.displayText"
      },
      {
        text: "مدة العقوبة",
        sortable: true,
        value: "penaltyTotalTime"
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
    calcPenaltyTime() {
      let { penaltyStartDate: from, penaltyEndDate: to } = this.addNew.search;
      if (from && to) {
        let diff = new Date(to) - new Date(from),
          days = diff / 1000 / 60 / 60 / 24;
        this.$set(this.addNew.search, "penaltyTotalTime", days);
      }
    },
    closeMe() {
      this.$set(this.addNew, "addNewId", "");
      Object.keys(this.addNew.search).forEach(key => {
        this.$set(this.addNew.search, key, null);
      });
      this.$set(this.addNew, "model", false);
    },
    openMe(item) {
      let newItem = this.fixDates(
        [item],
        ["crimeStartDate", "crimeEndDate", "penaltyStartDate", "penaltyEndDate"]
      )[0];
      this.$set(this.addNew, "addNewId", newItem.injuryId);
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
        table: "penalties",
        where: {
          injuryId: item.injuryId
        }
      })
        .then(x => {
          this.addModification(this.conscripte.militaryId, 3, 3);
          this.fixDemobilizationDate(this.conscripte.militaryId);
          this.showSuccess("تم الحذف بنجاح");
          let index = this.externals.findIndex(
            f => f.injuryId == item.injuryId
          );
          this.externals.splice(index, 1);
          // this.$emit("updateCounter", {
          //   id: "injuries",
          //   counter: this.externals.length
          // });
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
      let data = this.fixDates(
          [this.addNew.search],
          [
            "crimeStartDate",
            "crimeEndDate",
            "penaltyStartDate",
            "penaltyEndDate"
          ]
        )[0],
        addNewId = this.addNew.addNewId;
      // console.log(...data);
      let where = {},
        update = { ...data, militaryId: this.conscripte.militaryId };
      if (addNewId) {
        // Update
        where = {
          injuryId: addNewId
        };
      } else {
        // Create new
        where = {
          ...data,
          militaryId: this.conscripte.militaryId
        };
      }
      this.$set(this.addNew, "loading", true);
      this.api(`global/${addNewId ? "update_one" : "create_one"}`, {
        table: "penalties",
        where,
        update,
        returner: "injuryId"
      })
        .then(async x => {
          console.log(x);
          this.addModification(this.conscripte.militaryId, addNewId ? 2 : 1, 3);
          this.fixDemobilizationDate(this.conscripte.militaryId);
          let index = addNewId
              ? this.externals.findIndex(f => f.injuryId == addNewId)
              : this.externals.length,
            newExternalId = addNewId ? addNewId : x.data,
            newExternal = await this.api("global/get_one", {
              table: "penalties",
              where: {
                injuryId: newExternalId
              },
              include: [
                {
                  model: "penaltyTypes"
                }
              ]
            });
          this.$set(
            this.externals,
            index,
            this.fixDates(
              [newExternal.data],
              [
                "crimeStartDate",
                "crimeEndDate",
                "penaltyStartDate",
                "penaltyEndDate"
              ]
            )[0]
          );
          this.showSuccess("تمت العملية بنجاح");
          this.closeMe();
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
