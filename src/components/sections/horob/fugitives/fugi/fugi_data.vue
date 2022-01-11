<template>
  <div>
    <v-card
      :loading="loading || local_loading || add_new_loading"
      :disabled="loading || local_loading || add_new_loading"
    >
      <v-card-title>
        سجل الهروب
        <v-spacer></v-spacer>
        <v-card-actions
          v-if="$store.state.currentUser.section == '4' || isAdmin()"
        >
          <v-btn
            color="primary"
            outlined
            large
            @click="addNewFugi()"
            class="px-6"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
          <v-btn
            color="primary"
            large
            v-text="'حفظ'"
            @click="saveData"
            class="px-6"
          ></v-btn>
        </v-card-actions>
      </v-card-title>
      <v-divider></v-divider>
      <v-tabs v-model="fugis_model">
        <template v-for="(f, i) in fugi_data">
          <v-tab :key="i">
            {{ f.absenceDate ? f.absenceDate : `00-00-0000` }}
          </v-tab>
          <v-btn
            v-if="isAdmin()"
            :key="'del-' + i"
            icon
            @click="showDeleteDialog(f)"
          >
            <v-icon>mdi-trash-can</v-icon>
          </v-btn>
        </template>
      </v-tabs>
      <v-divider></v-divider>
      <v-card-text>
        <v-tabs-items v-model="fugis_model">
          <template v-for="(f, i) in fugi_data">
            <v-tab-item :key="i">
              <v-row>
                <template v-for="n in n_cols">
                  <v-col
                    :key="n"
                    :xl="12 / n_cols"
                    :lg="12 / n_cols"
                    :md="12 / n_cols"
                    :sm="12 / n_cols"
                  >
                    <template v-for="(s, ii) in sections">
                      <v-card
                        v-if="ii + 1 == n + Math.floor(ii / n_cols) * n_cols"
                        :key="ii"
                        :disabled="f[s.disabled]"
                        class="mb-5"
                      >
                        <v-card-title>
                          {{ s.title }}
                        </v-card-title>
                        <v-divider></v-divider>
                        <v-card-text>
                          <v-row>
                            <template v-for="(m, iii) in s.childs">
                              <!-- :xl="m.halfSize ? '3' : '3'" -->
                              <v-col
                                :key="iii"
                                cols="12"
                                :md="m.md ? m.md : '12'"
                                :lg="m.lg ? m.lg : '12'"
                                :xl="m.xl ? m.xl : '12'"
                              >
                                <v-text-field
                                  v-if="m.type == 'text'"
                                  v-model="f[m.model]"
                                  filled
                                  :hint="m.hint"
                                  :persistent-hint="m.hint ? true : false"
                                  :hide-details="m.hint ? false : true"
                                  :label="m.label"
                                  :prepend-inner-icon="m.icon"
                                  :clearable="!m.readonly && !m.disabled"
                                  :readonly="m.readonly"
                                  :error-messages="m.error"
                                ></v-text-field>
                                <v-textarea
                                  v-else-if="m.type == 'textarea'"
                                  v-model="f[m.model]"
                                  filled
                                  :hint="m.hint"
                                  :persistent-hint="m.hint ? true : false"
                                  :hide-details="m.hint ? false : true"
                                  :label="m.label"
                                  :prepend-inner-icon="m.icon"
                                  :clearable="!m.readonly && !m.disabled"
                                  :readonly="m.readonly"
                                  :error-messages="m.error"
                                  auto-grow
                                  rows="1"
                                ></v-textarea>
                                <v-autocomplete
                                  v-else-if="m.type == 'select'"
                                  v-model="f[m.model]"
                                  filled
                                  :hint="m.hint"
                                  :persistent-hint="m.hint ? true : false"
                                  :hide-details="m.hint ? false : true"
                                  :label="m.label"
                                  :prepend-inner-icon="m.icon"
                                  :readonly="m.readonly"
                                  :items="
                                    selects[m.model] && selects[m.model].data
                                      ? selects[m.model].data
                                      : []
                                  "
                                  :error-messages="selects[m.model].error"
                                  :loading="selects[m.model].loading"
                                  :clearable="!m.readonly && !m.disabled"
                                  :disabled="selects[m.model].loading"
                                  :item-text="m.item_text"
                                  :item-value="m.item_value"
                                  :multiple="m.multiple"
                                ></v-autocomplete>
                                <!-- ref="m.model" -->
                                <v-text-field
                                  v-model="f[m.model]"
                                  :prepend-inner-icon="m.icon"
                                  :hint="m.hint"
                                  :persistent-hint="m.hint ? true : false"
                                  :hide-details="m.hint ? false : true"
                                  :label="m.label"
                                  :clearable="!m.readonly && !m.disabled"
                                  :readonly="m.readonly"
                                  :error-messages="m.error"
                                  filled
                                  type="date"
                                  v-else-if="
                                    m.type == 'date' &&
                                      !$store.state.appInfo.dateDialog
                                  "
                                >
                                </v-text-field>
                                <v-dialog
                                  v-else-if="
                                    m.type == 'date' &&
                                      $store.state.appInfo.dateDialog
                                  "
                                  :ref="`${m.model}_${f.id}`"
                                  v-model="date_dialogs[`${m.model}_${f.id}`]"
                                  :return-value.sync="f[m.model]"
                                  width="300px"
                                  persistent
                                >
                                  <template v-slot:activator="{ on }">
                                    <v-text-field
                                      v-model="f[m.model]"
                                      :prepend-inner-icon="m.icon"
                                      :hint="m.hint"
                                      :persistent-hint="m.hint ? true : false"
                                      :hide-details="m.hint ? false : true"
                                      :label="m.label"
                                      :clearable="!m.readonly && !m.disabled"
                                      :readonly="m.readonly"
                                      :error-messages="m.error"
                                      filled
                                      v-on="on"
                                    >
                                    </v-text-field>
                                  </template>
                                  <v-date-picker
                                    :ref="`${m.model}_${f.id}_picker`"
                                    v-model="f[m.model]"
                                    scrollable
                                    color="primary"
                                  >
                                    <v-spacer></v-spacer>
                                    <v-btn
                                      color="primary"
                                      outlined
                                      class="px-6 text-capitalize"
                                      @click="
                                        date_dialogs[
                                          `${m.model}_${f.id}`
                                        ] = false
                                      "
                                      >إلغاء</v-btn
                                    >
                                    <v-btn
                                      color="primary"
                                      class="px-6 text-capitalize"
                                      @click="
                                        $refs[`${m.model}_${f.id}`][0].save(
                                          f[m.model]
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
                      </v-card>
                    </template>
                  </v-col>
                </template>
              </v-row>
            </v-tab-item>
          </template>
        </v-tabs-items>
      </v-card-text>
    </v-card>
    <v-dialog v-model="deleteDialog.model" max-width="450">
      <v-card :loading="deleteDialog.loading" :disabled="deleteDialog.loading">
        <v-card-title class="error white--text">
          حذف هروب
        </v-card-title>
        <v-card-text class="pt-4">
          هل أنت متأكد من حذف الهروب؟
        </v-card-text>
        <v-card-actions class="px-4">
          <v-spacer></v-spacer>
          <v-btn
            outlined
            large
            class="px-6"
            v-text="'رجوع'"
            @click="deleteDialog.model = false"
            color="error"
          ></v-btn>
          <v-btn
            large
            class="px-6"
            v-text="'حذف الهروب'"
            @click="deleteFugi()"
            color="error"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "fugitives-fugi-fugi-data",
  props: {
    fugi_data: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    },
    add_new_loading: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    if (!this.mounted) {
      this.init();
      this.$set(this, "mounted", true);
    }
  },
  watch: {
    fugi_data: {
      handler(fugis) {
        fugis.forEach(fugi => {
          let { absenceDate } = fugi,
            today = new Date(),
            year = 1000 * 60 * 60 * 24 * 30 * 12;
          if (absenceDate) {
            absenceDate = new Date(absenceDate);
            fugi.returnAfter1Year_disabled = false;
            fugi.after1Year_disabled =
              new Date(new Date(today).setDate(today.getDate() + 4)) -
                absenceDate <
              year;
            fugi.after12Years_disabled = today - absenceDate < 12 * year;
            if (
              fugi.conscripte_birthdate &&
              fugi.conscripte_birthdate.length > 0
            ) {
              let birthdate = new Date(fugi.conscripte_birthdate);
              fugi.overage_disabled = today - birthdate < 36 * year;
            } else {
              fugi.overage_disabled = true;
            }
          } else {
            fugi.returnAfter1Year_disabled = true;
            fugi.after1Year_disabled = true;
            fugi.after12Years_disabled = true;
            fugi.overage_disabled = true;
          }
        });
      },
      deep: true
    }
  },
  data: () => ({
    local_loading: false,
    fugis_model: 0,
    mounted: false,
    date_dialogs: {},
    sections: [
      {
        title: "بيانات الغياب والشطب",
        childs: [
          {
            type: "date",
            label: "تاريخ الغياب",
            model: "absenceDate",
            xl: "8",
            lg: "8",
            md: "8"
          },
          {
            type: "text",
            label: "بند أوامر",
            model: "absenceOrder",
            xl: "4",
            lg: "4",
            md: "4"
          },
          {
            type: "date",
            label: "تاريخ الشطب",
            model: "strikeoffDate",
            xl: "8",
            lg: "8",
            md: "8"
          },
          {
            type: "text",
            label: "بند أوامر",
            model: "strikeOffOrder",
            xl: "4",
            lg: "4",
            md: "4"
          },
          {
            type: "select",
            label: "إجراءات بيانات الشطب",
            model: "s1AttachmentsAfter21Days",
            item_text: "text",
            item_value: "value",
            multiple: true
          }
        ]
      },
      {
        title: "بيانات العودة",
        childs: [
          {
            type: "date",
            label: "تاريخ العودة",
            model: "returnDate",
            xl: "8",
            lg: "8",
            md: "8"
          },
          {
            type: "text",
            label: "بند أوامر",
            model: "returnOrder",
            xl: "4",
            lg: "4",
            md: "4"
          },
          {
            type: "select",
            label: "إجراءات بيانات العودة",
            model: "s1AttachmentsBefore1Year",
            item_text: "text",
            item_value: "value",
            multiple: true
          }
        ]
      },
      {
        title: "بعد مرور عام",
        disabled: "after1Year_disabled",
        childs: [
          {
            type: "date",
            label: "تاريخ اخطار الوحدة بدفع النموذج",
            model: "unitNoticeDate"
          },
          {
            type: "date",
            label: "تاريخ استلام النموذج",
            model: "s1ReceptionDate"
          },

          {
            type: "select",
            label: "مراجعة واستلام الإجراءات",
            model: "s1Attachments",
            item_text: "text",
            item_value: "value",
            multiple: true
          }
        ]
      },
      {
        title: "العودة بعد سنة",
        childs: [
          {
            type: "date",
            label: "تاريخ تسليم النموذج للوحدة",
            model: "s1SendToUnitDate"
          },
          {
            type: "text",
            label: "اسم المستلم",
            model: "nameMostalem"
          },
          {
            type: "select",
            label: "الدرجة",
            model: "degreeMostalemId",
            item_text: "degreeType",
            item_value: "degreeId"
          }
        ]
      },
      {
        title: "بعد مرور 12 عام",
        disabled: "after12Years_disabled",
        childs: [
          {
            type: "date",
            label: "تاريخ لجنة الإعدام",
            model: "s1ExecutionCommiteeDate"
          },
          {
            type: "text",
            label: "رقم الفيلم",
            model: "filmNumberFugitive",
            xl: "6",
            lg: "6",
            md: "6"
          },
          {
            type: "text",
            label: "مسلسل",
            model: "sequenceNumberFugitive",
            xl: "6",
            lg: "6",
            md: "6"
          },
          {
            type: "text",
            label: "دفتر الحفظ",
            model: "journalNumber"
          }
        ]
      },
      {
        title: "تسوية كبار السن",
        disabled: "overage_disabled",
        childs: [
          {
            type: "date",
            label: "تاريخ حضور الفرد",
            model: "personAttendanceDate"
          },
          {
            type: "select",
            label: "استكمال الإجراءات",
            model: "overAgeAttachments",
            item_text: "text",
            item_value: "value",
            multiple: true
          },
          {
            type: "date",
            label: "تاريخ التسليم للإدارة",
            model: "managementReceptionDate"
          },
          {
            type: "date",
            label: "تاريخ استلام 116 س",
            model: "s116ReceptionDate"
          }
        ]
      },
      {
        title: "ملاحظات",
        childs: [
          {
            type: "textarea",
            label: "",
            model: "notes",
            rows: 9
          }
        ]
      }
    ],
    data_fields: [
      {
        type: "text",
        label: "الرقم العسكري",
        model: "militaryId",
        readonly: true
      },
      {
        type: "select",
        label: "الدرجة",
        model: "degreeId",
        item_text: "degreeType",
        item_value: "degreeId",
        readonly: true
      },
      {
        type: "date",
        label: "تاريخ التجنيد",
        model: "conscriptionDate",
        model_dialog: false
      }
    ],
    selects: {
      s1AttachmentsAfter21Days: {
        data: [
          {
            text: "النموذج 61 س",
            value: "1"
          },
          {
            text: "النموذج 63 س",
            value: "2"
          },
          {
            text: "صورة البروفايل",
            value: "3"
          }
        ]
      },
      s1AttachmentsBefore1Year: {
        data: [
          {
            text: "النموذج 62 س",
            value: "1"
          }
        ]
      },
      s1Attachments: {
        data: [
          {
            text: "النموذج 1 س الأصل",
            value: "1"
          },
          {
            text: "خطاب الأدلة الجنائية معتمد",
            value: "2"
          },
          {
            text: "فيش ثلاثي",
            value: "3"
          },
          {
            text: "اجراءات 15 ر",
            value: "4"
          }
        ]
      },
      overAgeAttachments: {
        data: [
          {
            text: "فيش بصمات",
            value: "1"
          },
          {
            text: "صورة قسيمة الزواج",
            value: "2"
          },
          {
            text: "أصل + صورة شهادة الميلاد",
            value: "3"
          },
          {
            text: "توريد 15 ج صندوق الجلاء",
            value: "4"
          },
          {
            text: "اجراءات 170 س",
            value: "5"
          },
          {
            text: "صورة البطاقة الشخصية",
            value: "6"
          }
        ]
      },
      degreeMostalemId: {
        table: "degrees",
        attrs: ["degreeId", "degreeType"],
        data: []
      }
    },
    deleteDialog: {
      model: false,
      loading: false,
      item: {}
    }
  }),
  computed: {
    n_cols() {
      return this.$vuetify.breakpoint.xl
        ? 3
        : this.$vuetify.breakpoint.lg
        ? 3
        : this.$vuetify.breakpoint.md
        ? 2
        : this.$vuetify.breakpoint.sm
        ? 1
        : 1;
    }
  },
  // 2016306613289
  methods: {
    addNewFugi() {
      this.$emit("add-new-fugi");
    },
    showDeleteDialog(item) {
      this.$set(this.deleteDialog, "item", item);
      this.$set(this.deleteDialog, "model", true);
    },
    async deleteFugi() {
      this.$set(this.deleteDialog, "loading", true);
      let { id } = this.deleteDialog.item;
      this.api("global/delete_all", {
        table: "fugitives",
        where: {
          id
        }
      })
        .then(x => {
          this.$emit("fugi-deleted");
          this.showSuccess("تم حذف الهروب");
          this.$set(this.deleteDialog, "model", false);
        })
        .catch(error => {
          this.showError("تعذر حذف الهروب من قاعدة البيانات");
        })
        .finally(() => {
          this.$set(this.deleteDialog, "loading", false);
        });
    },
    saveData() {
      this.$set(this, "local_loading", true);
      let fugi_data = [...this.fugi_data],
        fixed = this.arrayToSelect(
          this.originalDates(fugi_data, [
            "conscriptionDate",
            "birthDate",
            "demobilizationDate"
          ]),
          [
            "s1AttachmentsAfter21Days",
            "s1AttachmentsBefore1Year",
            "s1Attachments",
            "overAgeAttachments"
          ]
        ),
        length = fixed.length,
        counter = 0,
        counter_f = 0;
      fixed.forEach(fix => {
        this.api("global/update_one", {
          table: "fugitives",
          where: {
            id: fix.id
          },
          update: fix
        })
          .then(x => {
            this.addModification(fix.militaryId, 2, 28);
            console.log(x);
            counter++;
            if (counter == length) {
              this.showSuccess("تم تحديد بيانات الهروب.");
            }
          })
          .catch(error => {
            console.log(error);
            this.showError("حدث خطأ أثناء تحديث بيانات الهروب");
          })
          .finally(() => {
            counter_f++;
            if (counter_f == length) {
              this.$set(this, "local_loading", false);
            }
          });
      });
    },
    init() {
      // Get selects
      if (this.mounted) {
        return;
      } else {
        this.$set(this, "mounted", true);
      }
      Object.keys(this.selects).forEach(key => {
        let { table, attrs } = this.selects[key];
        if (table && attrs) {
          this.$set(this.selects[key], "loading", true);
          this.api("global/get_all", {
            table,
            attrs
          })
            .then(x => {
              // console.log("Found Selects : " + table);
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
