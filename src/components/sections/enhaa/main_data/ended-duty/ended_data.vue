<template>
  <div>
    <v-card
      :loading="loading || local_loading"
      :disabled="loading || local_loading"
      v-if="computed_sections.length > 0"
    >
      <v-card-title class="white--text primary">
        بيانات المنتهي خدمته
        <v-spacer></v-spacer>
        <v-btn
          v-text="'حفظ'"
          color="white"
          light
          large
          :disabled="!saveEnabled"
          @click="saveData"
          class="px-6"
        ></v-btn>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-row>
          <template v-for="n in n_cols">
            <v-col
              :key="n"
              :xl="12 / n_cols"
              :lg="12 / n_cols"
              :md="12 / n_cols"
              :sm="12 / n_cols"
            >
              <template v-for="(s, i) in computed_sections">
                <v-card
                  :disabled="
                    ended_duty_data.conscripteStateId &&
                      disabled_sections[ended_duty_data.conscripteStateId] &&
                      disabled_sections[
                        ended_duty_data.conscripteStateId
                      ].includes(s.id)
                  "
                  :key="i"
                  v-if="i + 1 == n + Math.floor(i / n_cols) * n_cols"
                  class="mb-5"
                >
                  <v-card-title class="break-word">
                    {{ s.title }}
                  </v-card-title>
                  <v-divider></v-divider>
                  <v-card-text>
                    <v-row>
                      <template v-for="(m, ii) in s.childs">
                        <!-- :xl="m.halfSize ? '3' : '3'" -->
                        <v-col
                          v-if="
                            !m.typeId ||
                              m.typeId == ended_duty_data.conscripteTypeId
                          "
                          :key="ii"
                          cols="12"
                          :md="m.md ? m.md : '12'"
                          :lg="m.lg ? m.lg : '12'"
                          :xl="m.xl ? m.xl : '12'"
                        >
                          <v-text-field
                            :background-color="
                              !ended_duty_data[m.model]
                                ? $vuetify.theme.dark
                                  ? 'orange darken-4'
                                  : 'warning'
                                : ''
                            "
                            :color="
                              !ended_duty_data[m.model]
                                ? $vuetify.theme.dark
                                  ? 'white'
                                  : 'black'
                                : ''
                            "
                            v-if="m.type == 'text'"
                            v-model="ended_duty_data[m.model]"
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
                            v-model="ended_duty_data[m.model]"
                            filled
                            :hint="m.hint"
                            :persistent-hint="m.hint ? true : false"
                            :hide-details="m.hint ? false : true"
                            :label="m.label"
                            :prepend-inner-icon="m.icon"
                            :clearable="!m.readonly && !m.disabled"
                            :readonly="m.readonly"
                            :error-messages="m.error"
                            :rows="m.rows"
                          ></v-textarea>
                          <v-autocomplete
                            v-else-if="m.type == 'select'"
                            v-model="ended_duty_data[m.model]"
                            filled
                            :hint="m.hint"
                            :persistent-hint="m.hint ? true : false"
                            :hide-details="m.hint ? false : true"
                            :label="m.label"
                            :background-color="
                              !ended_duty_data[m.model]
                                ? $vuetify.theme.dark
                                  ? 'orange darken-4'
                                  : 'warning'
                                : ''
                            "
                            :color="
                              !ended_duty_data[m.model]
                                ? $vuetify.theme.dark
                                  ? 'white'
                                  : 'black'
                                : ''
                            "
                            :prepend-inner-icon="m.icon"
                            :readonly="m.readonly"
                            :items="selects[m.selects].data"
                            :error-messages="selects[m.selects].error"
                            :loading="selects[m.selects].loading"
                            :clearable="!m.readonly && !m.disabled"
                            :disabled="selects[m.selects].loading"
                            :item-text="m.item_text"
                            :item-value="m.item_value"
                            :multiple="m.multiple"
                          ></v-autocomplete>
                          <!-- ref="m.model" -->
                          <v-text-field
                            v-model="ended_duty_data[m.model]"
                            :prepend-inner-icon="m.icon"
                            :hint="m.hint"
                            type="date"
                            :background-color="
                              !ended_duty_data[m.model]
                                ? $vuetify.theme.dark
                                  ? 'orange darken-4'
                                  : 'warning'
                                : ''
                            "
                            :color="
                              !ended_duty_data[m.model]
                                ? $vuetify.theme.dark
                                  ? 'white'
                                  : 'black'
                                : ''
                            "
                            v-else-if="
                              m.type == 'date' &&
                                !$store.state.appInfo.dateDialog
                            "
                            :persistent-hint="m.hint ? true : false"
                            :hide-details="m.hint ? false : true"
                            :label="m.label"
                            :clearable="!m.readonly && !m.disabled"
                            :error-messages="m.error"
                            filled
                          >
                          </v-text-field>
                          <v-dialog
                            v-else-if="
                              m.type == 'date' &&
                                $store.state.appInfo.dateDialog
                            "
                            :ref="`${m.model}_${ended_duty_data.militaryId}`"
                            v-model="
                              date_dialogs[
                                `${m.model}_${ended_duty_data.militaryId}`
                              ]
                            "
                            :return-value.sync="ended_duty_data[m.model]"
                            width="300px"
                            :disabled="m.readonly"
                            persistent
                          >
                            <template v-slot:activator="{ on }">
                              <v-text-field
                                v-model="ended_duty_data[m.model]"
                                :prepend-inner-icon="m.icon"
                                :hint="m.hint"
                                :persistent-hint="m.hint ? true : false"
                                :hide-details="m.hint ? false : true"
                                :label="m.label"
                                :background-color="
                                  !ended_duty_data[m.model]
                                    ? $vuetify.theme.dark
                                      ? 'orange darken-4'
                                      : 'warning'
                                    : ''
                                "
                                :color="
                                  !ended_duty_data[m.model]
                                    ? $vuetify.theme.dark
                                      ? 'white'
                                      : 'black'
                                    : ''
                                "
                                :clearable="!m.readonly && !m.disabled"
                                readonly
                                :error-messages="m.error"
                                filled
                                v-on="on"
                              >
                              </v-text-field>
                            </template>
                            <v-date-picker
                              :ref="
                                `${m.model}_${ended_duty_data.militaryId}_picker`
                              "
                              v-model="ended_duty_data[m.model]"
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
                                    `${m.model}_${ended_duty_data.militaryId}`
                                  ] = false
                                "
                                >إلغاء</v-btn
                              >
                              <v-btn
                                color="primary"
                                class="px-6 text-capitalize"
                                @click="
                                  $refs[
                                    `${m.model}_${ended_duty_data.militaryId}`
                                  ][0].save(ended_duty_data[m.model])
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
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "enhaa-ended-duty-ended-data",
  props: {
    ended_duty_data: {
      type: [Object, Array],
      default: () => ({})
    },
    main_data: {
      type: [Object, Array],
      default: () => ({})
    },
    loading: {
      type: Boolean,
      default: false
    },
    saveEnabled: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    this.init();
  },
  computed: {
    n_cols() {
      return this.$vuetify.breakpoint.xl
        ? 4
        : this.$vuetify.breakpoint.lg
        ? 3
        : this.$vuetify.breakpoint.md
        ? 2
        : this.$vuetify.breakpoint.sm
        ? 2
        : 1;
    },
    disabled_sections() {
      let obj = {
        // عدم لياقة طبية
        150: ["9", "3", "6", "10", "13", "16"],
        // عدم لياقة استثنائية
        151: [
          "1",
          "8",
          "9",
          "14",
          "3",
          "6",
          "10",
          "15",
          "13",
          "4",
          "7",
          "11",
          "12",
          "16"
        ],
        // عدم لياقة قبل الخدمة
        152: ["9", "3", "6", "10", "15", "13", "7", "11", "12", "16"],
        // سوء السلوك
        153: ["8", "9", "3", "6", "15", "13", "4", "7", "11", "12", "16"],
        154: ["8", "9", "3", "6", "15", "13", "4", "7", "11", "12", "16"],
        155: ["8", "9", "3", "6", "15", "13", "4", "7", "11", "12", "16"],
        156: ["8", "9", "3", "6", "15", "13", "4", "7", "11", "12", "16"],
        // الإعفاء المؤقت والنهائي
        157: ["8", "9", "6", "10", "15", "13", "4", "7", "11", "12", "16"],
        158: ["8", "9", "6", "10", "15", "13", "4", "7", "11", "12", "16"],
        // تعديل صفة
        159: ["8", "9", "3", "6", "10", "15", "13", "4", "12", "16"],
        // الكلية الحربية
        160: ["8", "2", "9", "3", "10", "15", "13", "4", "7", "11", "12", "16"],
        // دواعي الصالح العام
        161: ["8", "9", "3", "6", "10", "15", "13", "4", "7", "11", "12", "16"],
        // الإستشهاد
        // الترقي الإستثنائي
        162: ["2", "3", "6", "10", "15", "4", "11", "12", "16"],
        // الوفاة
        163: ["2", "3", "6", "10", "15", "13", "4", "11", "12", "16"],
        // عدم الصلاحية الفنية
        164: [
          "1",
          "8",
          "2",
          "9",
          "14",
          "3",
          "6",
          "10",
          "15",
          "13",
          "4",
          "7",
          "11",
          "12",
          "16"
        ],
        // مادة 109
        165: ["8", "9", "14", "3", "6", "10", "15", "13", "4", "11", "16"],
        // عدم - التصديق | الرغبة - في التجديد + الإستقالة
        166: ["8", "2", "9", "3", "6", "10", "13", "4", "11", "16"],
        167: ["8", "2", "9", "3", "6", "10", "13", "4", "11", "16"],
        168: ["8", "2", "9", "3", "6", "10", "13", "4", "11", "16"],
        // الوفاة أثناء الغياب
        171: [
          "8",
          "2",
          "14",
          "3",
          "6",
          "10",
          "15",
          "13",
          "4",
          "11",
          "12",
          "16"
        ],
        // بلوع السن القانوني
        172: ["8", "9", "3", "6", "10", "13", "4", "11", "16"],
        // بلوغ السن أثناء الغياب
        173: ["8", "14", "3", "6", "10", "15", "13", "4", "11", "12", "16"],
        // الفقرة 107
        174: ["8", "14", "3", "6", "10", "13", "4", "11", "16"],
        // سبب الإنهاء الجديد اللي المقدم قاللي أضيفه
        175: ["3", "4", "5", "6", "10", "11", "12", "13", "14", "15"]
      };
      if (this.ended_duty_data.conscripteTypeId == 1) {
        obj["150"].push("15");
        obj["150"].push("12");
      }
      return obj;
    },
    disabledBetweenSections() {
      return [
        "8",
        "9",
        "14",
        "3",
        "6",
        "10",
        "15",
        "13",
        "4",
        "7",
        "11",
        "12",
        "16"
      ];
    },
    disabledOtherSections() {
      return [
        "1",
        "8",
        "2",
        "9",
        "14",
        "3",
        "6",
        "10",
        "15",
        "13",
        "4",
        "7",
        "11",
        "12",
        "16"
      ];
    },
    computed_sections() {
      let sections = this.sections;
      if (this.ended_duty_data.conscripteStateId) {
        let typeId = this.ended_duty_data.conscripteTypeId;
        if (this.disabled_sections[this.ended_duty_data.conscripteStateId]) {
          sections = sections.filter(
            f =>
              (!f.typeId || f.typeId == typeId) &&
              (!this.disabled_sections[
                this.ended_duty_data.conscripteStateId
              ] ||
                !this.disabled_sections[
                  this.ended_duty_data.conscripteStateId
                ].includes(f.id))
          );
        } else {
          sections = sections.filter(
            f =>
              (!f.typeId || f.typeId == typeId) &&
              ((this.ended_duty_data.conscripteStateId >= 150 &&
                this.ended_duty_data.conscripteStateId < 200 &&
                !this.disabledBetweenSections.includes(f.id)) ||
                ((this.ended_duty_data.conscripteStateId < 150 ||
                  this.ended_duty_data.conscripteStateId >= 200) &&
                  !this.disabledOtherSections.includes(f.id)))
          );
        }
      } else {
        sections = [];
      }
      return sections;
    }
  },
  watch: {
    // ended_duty_data: {
    //   handler(fugis) {
    //     fugis.forEach(fugi => {
    //       let { absenceDate } = fugi,
    //         today = new Date(),
    //         year = 1000 * 60 * 60 * 24 * 30 * 12;
    //       if (absenceDate) {
    //         absenceDate = new Date(absenceDate);
    //         fugi.returnAfter1Year_disabled = false;
    //         fugi.after1Year_disabled = today - absenceDate < year;
    //         fugi.after12Years_disabled = today - absenceDate < 12 * year;
    //         if (
    //           fugi.conscripte_birthdate &&
    //           fugi.conscripte_birthdate.length > 0
    //         ) {
    //           let birthdate = new Date(fugi.conscripte_birthdate);
    //           fugi.overage_disabled = today - birthdate < 36 * year;
    //         } else {
    //           fugi.overage_disabled = true;
    //         }
    //       } else {
    //         fugi.returnAfter1Year_disabled = true;
    //         fugi.after1Year_disabled = true;
    //         fugi.after12Years_disabled = true;
    //         fugi.overage_disabled = true;
    //       }
    //     });
    //   },
    //   deep: true
    // }
  },
  data: () => ({
    local_loading: false,
    date_dialogs: {},
    all_sections: {
      1: "النموذج 20 س", // w
      2: "النموذج 21 س / 26 س", // w
      3: "الإعفاء المؤقت",
      4: "اللجنة الطبية",
      5: "في حالة تأخير الإنهاء للترقية",
      6: "الكلية الحربية",
      7: "تسليم الموقف المالي", // تأمينات ومعاشات // w
      8: "قرار السببية", // w
      9: "شهادة الوفاة", // w
      10: "دراسة سوء السلوك",
      11: "لجنة التعويضات",
      12: "استكمال الإجراءات",
      13: "بيان الشهيد",
      14: "النموذج 170 س",
      15: "مستحقات مالية",
      16: "الترقي الإستثنائي", // w
      17: "الملاحظات"
    },
    // external: {
    //   lastCourt: {}
    // },
    sections: [
      {
        title: "في حالة تأخير الإنهاء للترقية",
        id: "5",
        typeId: 2,
        childs: [
          {
            type: "date",
            label: "تاريخ الترقية",
            model: "termDateByPromotion"
          }
        ]
      },
      {
        title: "النموذج 20 س",
        id: "1",
        childs: [
          {
            type: "date",
            label: "تاريخ الإصدار",
            model: "s20IssueDate"
          },
          {
            type: "date",
            label: "تاريخ إخطار الوحدة",
            model: "s20SendToUnitDate"
          },
          {
            type: "date",
            label: "تاريخ تسليم 20 س إخلاء طرف الى إدارة السجلات",
            model: "ekhlaToEdaraDate",
            typeId: 2
          },
          {
            type: "date",
            label: "تاريخ استلام إخلاء الطرف",
            model: "ekhlaFromEdaraDate",
            typeId: 2
          }
        ]
      },
      {
        title: "النموذج 21 س / 26 س",
        id: "2",
        childs: [
          {
            type: "date",
            label: "تاريخ الإستلام (أ. السجلات)",
            model: "termFormIssueDate"
          },
          {
            type: "date",
            label: "تاريخ التسليم الى الوحدة",
            model: "termFormSendDate"
          },
          {
            type: "date",
            label: "تاريخ تسليم 26 س للفرد",
            model: "s26SendDate"
          },
          {
            type: "text",
            label: "رقم الشهادة",
            model: "certificateNumber"
          },
          {
            type: "text",
            label: "المستلم",
            model: "termFormReciever"
          }
        ]
      },
      {
        title: "الإعفاء المؤقت",
        id: "3",
        childs: [
          {
            type: "date",
            label: "تاريخ ورود 5 جند",
            model: "gond5Exemption"
          }
        ]
      },
      {
        title: "اللجنة الطبية",
        id: "4",
        childs: [
          {
            type: "date",
            label: "تاريخ صدور اللجنة",
            model: "medicalCommitteeIssueDate"
          }
        ]
      },
      {
        title: "الكلية الحربية",
        id: "6",
        childs: [
          {
            type: "date",
            label: "تاريخ استلام التصديق",
            model: "facultyConfirmationDate"
          },
          {
            type: "date",
            label: "تاريخ ورود 5 جند",
            model: "gond5Faculty"
          }
        ]
      },
      {
        title: "تسليم الموقف المالي ( تأمينات ومعاشات )",
        id: "7",
        childs: [
          {
            type: "date",
            label: "تاريخ الإعتماد ( التأمين )",
            model: "insuranceConfirmationDate"
          },
          {
            type: "date",
            label: "تاريخ تسليم ( إ. التأمين )",
            model: "insuranceDepSendDate"
          },
          {
            type: "date",
            label: "تاريخ صندوق التأمين",
            model: "insurancePrivetBoxSendDate",
            typeId: 2
          },
          // للجنود اسمه صندوق الجلاء
          {
            type: "date",
            label: "تاريخ صندوق الجلاء",
            model: "insurancePrivetBoxSendDate",
            typeId: 1
          },
          {
            type: "date",
            label: "تاريخ الصندوق التكميلي",
            model: "insuranceSupplySendDate",
            typeId: 2
          }
        ]
      },
      {
        title: "قرار السببية",
        id: "8",
        childs: [
          {
            type: "date",
            label: "تاريخ التسليم",
            model: "decReasonabilitySendDate"
          },
          {
            type: "date",
            label: "تاريخ الإستلام",
            model: "decReasonabilityReceiveDate"
          }
        ]
      },
      {
        title: "شهادة الوفاة",
        id: "9",
        childs: [
          {
            type: "date",
            label: "تاريخ الوفاة",
            model: "deathDate"
          },
          {
            type: "date",
            label: "تاريخ إصدار شهادة الوفاة",
            model: "deathFormIssueDate"
          }
        ]
      },
      {
        title: "دراسة سوء السلوك",
        id: "10",
        childs: [
          {
            type: "text",
            label: "آخر حكم",
            model: "lastJudgment"
          },
          {
            type: "date",
            label: "تاريخ آخر تأشيرة نيابة",
            model: "lastProsecutionDate"
          },
          {
            type: "date",
            label: "تاريخ آخر إشارة فرع",
            model: "lastCourt.lastBranchReply"
          },
          {
            type: "date",
            label: "تاريخ إصدار ( 161 س )",
            model: "lastCourt.s161Date"
          }
        ]
      },
      {
        title: "لجنة التعويضات",
        id: "11",
        childs: [
          {
            type: "date",
            label: "تاريخ التسليم الى هـ. تن",
            model: "compensationSendDate"
          },
          {
            type: "date",
            label: "تاريخ الإستلام من هـ. تن",
            model: "compensationReceiveDate"
          }
        ]
      },
      {
        title: "استكمال الإجراءات",
        id: "12",
        childs: [
          // {
          //   type: "select",
          //   label: "البطاقة العلاجية",
          //   model: "medicalCard",
          //   selects: "cards_select",
          //   item_text: "text",
          //   item_value: "value"
          // },
          {
            type: "select",
            label: "تحقيق الشخصية",
            model: "militaryCard",
            selects: "cards_select",
            item_text: "text",
            item_value: "value"
          },
          {
            type: "select",
            label: "رخصة القيادة",
            model: "drivingLicence",
            selects: "cards_select",
            item_text: "text",
            item_value: "value"
          }
        ]
      },
      {
        title: "بيان الشهيد",
        id: "13",
        childs: [
          {
            type: "date",
            label: "تاريخ الإستلام من الوحدة",
            model: "martyrFormReceiveDate"
          },
          {
            type: "date",
            label: "تاريخ التسليم الى ( أ. السجلات )",
            model: "martyrFormSendDate"
          },
          {
            type: "date",
            label: "تاريخ الإستلام من الإدارة",
            model: "martyrFormReceiveDate2"
          }
        ]
      },
      {
        title: "النموذج 170 س",
        id: "14",
        childs: [
          {
            type: "date",
            label: "تاريخ الإستلام من الوحدة",
            model: "s170ReceiveDate"
          },
          {
            type: "date",
            label: "تاريخ التسليم الى ( أ. السجلات )",
            model: "s170SendDate"
          }
        ]
      },
      {
        title: "مستحقات مالية",
        id: "15",
        typeId: 2,
        childs: [
          {
            type: "date",
            label: "خطاب 6 أشهر",
            model: "message6Monthes"
          },
          {
            type: "date",
            label: "خطاب 4 أشهر",
            model: "message4Monthes"
          }
        ]
      },
      {
        title: "الترقي الإستثنائي",
        id: "16",
        childs: [
          {
            type: "date",
            label: "تاريخ التصديق من الهيئة",
            model: "promotionConfirmationDate"
          },
          {
            type: "date",
            label: "تاريخ إخطار ( ش. ضباط )",
            model: "promotionRecieveDate"
          },
          {
            type: "date",
            label: "تاريخ إخطار ( أ. السجلات )",
            model: "promotionInformDate"
          }
        ]
      },
      {
        title: "الملاحظات",
        id: "17",
        childs: [
          {
            type: "textarea",
            label: "",
            model: "notesEnhaa"
          }
        ]
      }
    ],
    selects: {
      cards_select: {
        data: [
          {
            text: "لم يتم الإستلام",
            value: 1
          },
          {
            text: "تم الإستلام",
            value: 2
          },
          {
            text: "فقد",
            value: 3
          },
          {
            text: "لا يستحق",
            value: 4
          },
          {
            text: "لم يدرج",
            value: 5
          }
        ]
      }
    }
  }),
  methods: {
    saveData() {
      this.$set(this, "local_loading", true);
      let date_keys = Object.keys(this.ended_duty_data)
          .map(k =>
            k.includes("Date") || k.includes("date") ? k : "NOT_A_DATE"
          )
          .filter(k => k !== "NOT_A_DATE"),
        other_date_keys = [
          "gond5Exemption",
          "gond5Faculty",
          "message4Monthes",
          "message6Monthes",
          "lastCourt.lastBranchReply",
          "lastCourt.s161Date",
          "lastCourt.courtDate"
        ],
        ended_duty_data = { ...this.ended_duty_data },
        fix = this.originalDates(
          [ended_duty_data],
          [...date_keys, ...other_date_keys],
          true
        )[0];
      console.log(fix);
      this.api("global/update_one", {
        table: "dutyTerminations",
        where: {
          militaryId: fix.militaryId
        },
        update: fix
      })
        .then(async x => {
          console.log(x);
          this.addModification(fix.militaryId, 2, 1);
          if (
            this.ended_duty_data.lastCourt &&
            this.ended_duty_data.lastCourt.courtId
          ) {
            let updateCourt = await this.api("global/update_one", {
              table: "courts",
              where: {
                courtId: this.ended_duty_data.lastCourt.courtId
              },
              update: {
                lastBranchReply: this.ended_duty_data[
                  "lastCourt.lastBranchReply"
                ],
                s161Date: this.ended_duty_data["lastCourt.s161Date"]
              }
            });
            this.addModification(fix.militaryId, 2, 23);
          }
          let endingDutyDate = new Date(this.ended_duty_data.termDate);
          // ## 1
          let s20IssueDate = this.ended_duty_data.s20IssueDate
              ? new Date(this.ended_duty_data.s20IssueDate)
              : null,
            mcid = this.ended_duty_data.medicalCommitteeIssueDate
              ? new Date(this.ended_duty_data.medicalCommitteeIssueDate)
              : null,
            gond5Date = this.ended_duty_data.gond5Exemption
              ? new Date(this.ended_duty_data.gond5Exemption)
              : null;
          if (mcid && [150, 152].includes(this.main_data.stateId)) {
            /**
             * ---------------------------------
             * في حالة الإنهاء لعدم اللياقة الطبية
             * ---------------------------------
             */
            if (this.ended_duty_data.conscripteTypeId == 1) {
              // لو جندي
              if (mcid >= new Date("2015-05-02")) {
                /**
                 * زمان كان تاريخ إنهاء الخدمة بيتحط يدوي
                 * بعدها فيه تعليمات صدرت يوم 2015-05-02
                 * إن تاريخ إنهاء الخدمة هيكون بعد 9 أيام من تاريخ صدور اللجنة الطبية
                 * بعدها تعليمات تاني صدرت بتاريخ 2021-02-16
                 * إن تاريخ إنهاء الخدمة هيكون بعد يوم واحد من تاريخ صدور اللجنة الطبية
                 *
                 * ---
                 * فيه 3 جنود بالتحديد هيتم حسابهم مع قرار 16-02-2021
                 */
                let daysToAdd =
                  s20IssueDate >= new Date("2021-02-16") ||
                  ["2020306622025", "2020915201632", "2020606616041"].includes(
                    fix.militaryId
                  )
                    ? 1
                    : 9;
                console.log("days to add: ", daysToAdd);
                endingDutyDate = new Date(mcid).setDate(
                  new Date(mcid).getDate() + daysToAdd
                );
              }
            } else if (this.ended_duty_data.conscripteTypeId == 2) {
              // لو راتب عالي (صف ظابط)
              if (this.ended_duty_data.termDateByPromotion) {
                /**
                 * فيه تعليمات صدرت إن لو الصف ظابط دا هيترقى قريب
                 * يبقا نستنى لحد تاريخ الترقية بتاعتها وبعدها ننهي خدمته
                 * وبالتالي فـ تاريخ إنهاء الخدمة هيكون بعد يوم واحد من تاريخ الترقية
                 */
                let tdbp = this.ended_duty_data.termDateByPromotion;
                endingDutyDate = new Date(tdbp).setDate(
                  new Date(tdbp).getDate() + 1
                );
              } else {
                /**
                 * فيه تعليمات صدرت إن تاريخ إنهاء خدمة الصف ظابط لعم اللياقة الطبية
                 * هيكون يوم واحد في الشهر اللي بعد الشهر اللي صدرت فيه اللجنة الطبية
                 * (مثال)
                 * لو واحد صدرت اللجنة الطبية بتاعته يوم 13-02-2021
                 * هيكون تاريخ إنهاء خدمته 01-04-2021
                 * (مثال تاني)
                 * واحد صدرت اللجنة الطبية بتاعته يوم 27-02-2021
                 * هيكون تاريخ إنهاء خدمته برضو 01-04-2021
                 * (مثال أخير)
                 * اللجنة الطبية بتاريخ 01-03-2021
                 * هيكون تاريخ إنهاء الخدمة 01-05-2021
                 */
                endingDutyDate = new Date(mcid).setDate(1);
                endingDutyDate = new Date(endingDutyDate).setMonth(
                  new Date(endingDutyDate).getMonth() + 2
                );
              }
            }
          } else if (
            /**
             * ---------------------------------
             * في حالة الإعفاء المؤقت والنهائي
             * ---------------------------------
             * يتم حساب تاريخ إنهاء الخدمة بعد يوم واحد من تاريخ صدور الـ 5 جند
             */
            gond5Date &&
            [157, 158].includes(this.main_data.stateId) &&
            this.ended_duty_data.conscripteTypeId == 1
          ) {
            if (s20IssueDate >= new Date("2021-02-16")) {
              endingDutyDate = new Date(gond5Date).setDate(
                new Date(gond5Date).getDate() + 1
              );
            }
          }
          let updateConscripte = await this.api("global/update_one", {
            table: "conscriptes",
            where: {
              militaryId: fix.militaryId
            },
            update: {
              endingDutyDate
            }
          });
          this.addModification(fix.militaryId, 2, 9);
          this.showSuccess("تم تحديث بيانات المنتهي خدمته.");
          this.$emit("findEnded");
        })
        .catch(error => {
          console.log(error);
          this.showError("حدث خطأ أثناء تحديث بيانات المنتهي خدمته");
        })
        .finally(() => {
          this.$set(this, "local_loading", false);
        });
    },
    init() {
      // Get selects
      Object.keys(this.selects).forEach(key => {
        let { table, attrs } = this.selects[key];
        if (table && attrs) {
          this.$set(this.selects[key], "loading", true);
          this.api("global/get_all", {
            table,
            attrs
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
