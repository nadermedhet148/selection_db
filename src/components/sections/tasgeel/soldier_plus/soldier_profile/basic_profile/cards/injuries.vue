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
        <!-- Non empty -->
        <!-- marker -> changes here maybee cuase err inn the future  f9c8a2e7377676757888c97c6065fa931a803018  -->
        <template v-slot:item.medicalCommittee.committee="{ item }">
          <v-chip
            v-if="
              item && item.medicalCommittee && item.medicalCommittee.committeeId
            "
            small
            class="font-weight-bold"
            :color="colors[item ? item.medicalCommittee.committee.id : null]"
          >
            {{ item ? item.displayedText : null }}
          </v-chip>

          <v-chip v-else small class="font-weight-bold">
            ليس له لجنة
          </v-chip>
        </template>

        <template v-slot:item.isFollowed="{ item }">
          <v-chip
            small
            :color="item.isFollowed ? 'error' : 'success'"
            class="font-weight-bold"
          >
            {{ item.isFollowed ? "نعم" : "لا" }}
          </v-chip>
        </template>
        <template v-slot:item.isUnCompleted="{ item }">
          <v-chip
            small
            :color="item.isUnCompleted ? 'success' : 'success'"
            class="font-weight-bold"
          >
            {{ item.isUnCompleted ? "لا" : "نعم" }}
          </v-chip>
        </template>
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
          {{ addNew.addNewId ? "تعديل حالة" : "إضافة جديد" }}
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
                ></v-text-field>
                <v-textarea
                  v-else-if="option.type == 'textarea'"
                  :label="option.label"
                  :hint="option.hint"
                  v-model="addNew.search[option.model]"
                  filled
                  rows="1"
                  auto-grow
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
                  :multiple="option.multiple"
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
            :disabled="!addNew.search.caseType || !addNew.search.casePlace"
            v-text="addNew.addNewId ? 'تعديل الحالة' : 'إضافة الحالة'"
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
          حذف إصابة
          <v-spacer></v-spacer>
          <v-btn dark @click="deleteDialog.model = false" icon>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pt-4">
          هل تريد بالتأكيد حذف الإصابة؟ سيتم حذف المجلس الطبي المرتبط بهذه
          الأصابه.
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
            v-text="'حذف الإصابة'"
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
  name: "basic-profile-injuries",
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
        injuryDate: null,
        summary: null,
        caseType: null,
        casePlace: null,
        diagnosis: null,
        notifyBranchDate: null,
        lastUnitReply: null,
        lastShabaka: null,
        healingReportId: null,
        notes: null,
        injuryAttachments: [],
        medicalCommittee: null
      },
      options: [
        {
          label: "تاريخ الحالة",
          model: "injuryDate",
          type: "date"
        },
        {
          label: "نوع الحالة",
          model: "caseType",
          type: "select"
        },
        {
          label: "مكان الحالة",
          model: "casePlace",
          type: "select"
        },
        // {
        //   label: "متابعة السلطة القضائية",
        //   model: "sequestrator",
        //   type: "text",
        //   disabled: true
        // },
        {
          label: "تشخيص الإصابة",
          model: "diagnosis",
          type: "text",
          lg: "8"
        },
        {
          label: "تاريخ اخطار الفرع",
          model: "notifyBranchDate",
          type: "date"
        },
        {
          label: "آخر رد للوحدة",
          model: "lastUnitReply",
          type: "date"
        },
        {
          label: "آخر تسجيل على الشبكة",
          model: "lastShabaka",
          type: "date"
        },
        {
          label: "تقرير الشفاء النهائي",
          model: "healingReportId",
          type: "select"
        },
        {
          label: "الإجراءات المستلمة",
          model: "injuryAttachments",
          type: "select",
          lg: "12",
          multiple: true
        },
        {
          label: "تفاصيل الحالة",
          model: "summary",
          type: "textarea",
          lg: "6"
        },
        {
          label: "ملاحظات",
          model: "notes",
          type: "textarea",
          lg: "6"
        }
      ]
    },
    selects: {
      injuryAttachments: {
        data: [
          {
            text: "مذكرة",
            value: "1"
          },
          {
            text: "تشخيص مبدئي",
            value: "2"
          },
          {
            text: "تشخيص نهائي",
            value: "3"
          },
          {
            text: "محضر شرطة",
            value: "4"
          },
          {
            text: "تصرف نهائي",
            value: "5"
          }
        ],
        text: "text",
        value: "value"
      },
      caseType: {
        data: [
          {
            text: "إصابية",
            value: 1
          },
          {
            text: "مرضية",
            value: 2
          }
        ],
        text: "text",
        value: "value"
      },
      casePlace: {
        data: [
          {
            text: "داخل الوحدة",
            value: 1
          },
          {
            text: "خارج الوحدة",
            value: 2
          },
          {
            text: "أثناء العودة",
            value: 3
          }
        ],
        text: "text",
        value: "value"
      },
      healingReportId: {
        table: "healingReports",
        text: "displayedText",
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
        text: "تاريخ الحالة",
        sortable: true,
        value: "injuryDate"
      },
      {
        text: "التشخيص",
        sortable: true,
        value: "diagnosis"
      },
      {
        text: "تقرير الشفاء",
        sortable: true,
        value: "healingReport.displayedText"
      },
      {
        text: "قرار اللجنة الطبية",
        sortable: true,
        value: "medicalCommittee.committee.displayedText"
      },
      {
        text: "متابع",
        sortable: true,
        value: "isFollowed"
      },
      {
        text: "",
        sortable: false,
        value: "actions"
      }
      // {
      //   text: "اكتمل تسجيله",
      //   sortable: true,
      //   value: "isUnCompleted"
      // }
    ],
    search: ""
  }),
  methods: {
    closeMe() {
      this.$set(this.addNew, "addNewId", "");
      Object.keys(this.addNew.search).forEach(key => {
        this.$set(
          this.addNew.search,
          key,
          key == "injuryAttachments" ? [] : null
        );
      });
      this.$set(this.addNew, "model", false);
    },
    openMe(item) {
      let newItem = this.fixDates(
        [item],
        ["injuryDate", "notifyBranchDate", "lastUnitReply", "lastShabaka"]
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
        table: "injuries",
        where: {
          injuryId: item.injuryId
        }
      })
        .then(x => {
          this.$emit("addOrRemoveMedicalCommittee", {
            type: "remove",
            id: item.injuryId
          });

          this.addModification(this.conscripte.militaryId, 3, 5);
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
      let data = this.arrayToSelect(
          this.fixDates(
            [{ ...this.addNew.search }],
            ["injuryDate", "notifyBranchDate", "lastUnitReply", "lastShabaka"]
          ),
          ["injuryAttachments"]
        )[0],
        addNewId = this.addNew.addNewId;
      console.log("addNewId");
      console.log(addNewId);
      // console.log(...data);
      let injury = { ...data, militaryId: this.conscripte.militaryId };
      // IsFollowed lookup
      injury.isFollowed = false;
      let requiredFields = [
        "injuryDate",
        "caseType",
        "casePlace",
        "diagnosis",
        "notifyBranchDate",
        "healingReportId",
        "summary"
      ];
      requiredFields.forEach(rf => {
        if (!injury[rf]) {
          console.log("Missed " + rf);
          injury.isFollowed = true;
        }
      });
      if (
        injury.healingReportId == "2" &&
        !(injury.medicalCommittee && injury.medicalCommittee.committee)
      ) {
        injury.isFollowed = true;
      }
      this.$set(this.addNew, "loading", true);
      this.api(`global/${addNewId ? "update_one" : "create_one"}`, {
        table: "injuries",
        where: addNewId
          ? {
              injuryId: addNewId
            }
          : injury,
        update: injury,
        returner: "injuryId"
      })
        .then(async x => {
          console.log("x", x);
          this.addModification(this.conscripte.militaryId, addNewId ? 2 : 1, 5);
          let index = addNewId
              ? this.externals.findIndex(f => f.injuryId == addNewId)
              : this.externals.length,
            newExternalId = addNewId ? addNewId : x.data,
            newExternal = await this.api("global/get_one", {
              table: "injuries",
              where: {
                injuryId: newExternalId
              },
              include: [
                {
                  model: "healingReports"
                },
                {
                  model: "medicalCommittees",
                  include: [
                    {
                      model: "committees"
                    }
                  ]
                }
              ]
            });

          let medCommitteInjuryId = newExternal.data.medicalCommittee
            ? newExternal.data.medicalCommittee.injuryId
            : null;

          let caseType =
            newExternal.data.caseType == 2 ? 4 : newExternal.data.caseType;

          this.$emit("addOrRemoveMedicalCommittee", {
            caseType: caseType,
            medCommitteInjuryId: medCommitteInjuryId,
            id: newExternalId,
            reqMedicalCommitte:
              newExternal.data.healingReportId == 2 ? true : false,

            type:
              !addNewId &&
              newExternal &&
              newExternal.data &&
              newExternal.data.healingReportId
                ? "add"
                : "edite"
          });

          this.$set(
            this.externals,
            index,
            this.selectToArray(
              this.fixDates(
                [newExternal.data],
                [
                  "injuryDate",
                  "notifyBranchDate",
                  "lastUnitReply",
                  "lastShabaka"
                ]
              ),
              ["injuryAttachments"]
            )[0]
          );

          // if (this.externals[index].healingReport?.id != 2) {
          //   this.$set(
          //     this.externals[index].medicalCommittee,
          //     "committee",
          //     "ليس له لجنه"
          //   );
          // }

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

      for (const i in this.externals) {
        if (this.externals[i].healingReport?.id != 2) {
          console.log("here ", this.externals[i].healingReport?.id != 2);
          console.log(this.externals[i]);
          let medicalCommittee = {
            committee: "ليس له لجنه"
          };
          this.$set(this.externals[i], "medicalCommittee", medicalCommittee);
        }
      }
      console.log("====================================");
      console.log("f ", this.externals);
      console.log("====================================");
    }
  }
};
</script>
