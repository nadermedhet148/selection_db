<template>
  <div>
    <v-dialog
      v-if="isCurrentRoute(componentName)"
      v-model="model"
      scrollable
      persistent
      :max-width="$vuetify.breakpoint.smAndDown ? '500' : '800'"
    >
      <v-card :loading="loading" :disabled="loading">
        <v-card-title>
          كشف الأربعين
          <v-spacer></v-spacer>
          <v-btn icon @click="closeKashf()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-list class="pa ma-0">
            <v-list-item class="mx-0 px-0 wrap">
              <v-list-item-avatar>
                <div class="primary--text text-h4">1.</div>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title
                  style="font-size: 20px"
                  class="primary--text line-height-2"
                >
                  البيانات الأساسية لكشف الأربعين
                </v-list-item-title>
                <v-list-item-subtitle
                  style="font-size: 14px"
                  class="font-weight-bold line-height-2x"
                >
                  بيانات تكتب قبل تسجيل اللجنة الطبية لكشف الأربعين.
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <!-- <v-divider></v-divider> -->
          <v-row>
            <template v-for="(value, key, i) in conscripte">
              <v-col :key="i" v-if="fields[key]" cols="12" sm="6" md="4">
                <v-text-field
                  v-if="!$store.state.appInfo.dateDialog"
                  type="date"
                  class="mb-4"
                  v-model="conscripte[key]"
                  filled
                  :label="fields[key].label"
                  :hint="fields[key].hint"
                  :persistent-hint="fields[key].hint ? true : false"
                  :hide-details="fields[key].hint ? false : true"
                  :prepend-inner-icon="fields[key].icon"
                >
                </v-text-field>
                <v-dialog
                  v-else
                  :ref="`${key}_dialog`"
                  v-model="date_dialogs[key + '_' + conscripte.militaryId]"
                  :return-value.sync="conscripte[key]"
                  width="290px"
                  persistent
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      readonly
                      v-on="on"
                      class="mb-4"
                      v-model="conscripte[key]"
                      filled
                      :label="fields[key].label"
                      :hint="fields[key].hint"
                      :persistent-hint="fields[key].hint ? true : false"
                      :hide-details="fields[key].hint ? false : true"
                      :prepend-inner-icon="fields[key].icon"
                    >
                    </v-text-field>
                  </template>
                  <v-date-picker
                    ref="date_to_picker"
                    v-model="conscripte[key]"
                    scrollable
                    color="primary"
                  >
                    <v-spacer></v-spacer>
                    <v-btn
                      color="primary"
                      outlined
                      class="px-6 text-capitalize"
                      @click="
                        date_dialogs[key + '_' + conscripte.militaryId] = false
                      "
                      >إلغاء</v-btn
                    >
                    <v-btn
                      color="primary"
                      class="px-6 text-capitalize"
                      @click="$refs[`${key}_dialog`][0].save(conscripte[key])"
                      >حفظ</v-btn
                    >
                  </v-date-picker>
                </v-dialog>
              </v-col>
            </template>
          </v-row>
          <v-list class="pa ma-0">
            <v-list-item class="mx-0 px-0 wrap">
              <v-list-item-avatar>
                <div class="primary--text text-h4">2.</div>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title
                  style="font-size: 20px"
                  class="primary--text line-height-2"
                >
                  اللجان الطبية لكشف الأربعين
                </v-list-item-title>
                <v-list-item-subtitle
                  v-if="!loading"
                  style="font-size: 14px"
                  class="font-weight-bold line-height-2x"
                >
                  {{
                    medicalCommittees.length > 0
                      ? `يوجد ${medicalCommittees.length} لجان طبية لكشف الأربعين`
                      : `عفواً .. لا توجد لجان طبية مسجلة لكشف الأربعين. من فضلك قم
                  بإضافة واحدة على الأقل.`
                  }}
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn color="primary" fab x-small @click="saveChanges(true)">
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list>
          <div v-if="medicalCommittees.length > 0">
            <v-divider></v-divider>
            <v-tabs v-model="medicalCommitteesTabs">
              <template v-for="(mc, i) in medicalCommittees">
                <v-tab :key="i">
                  {{
                    mc.committeeDate ? mc.committeeDate : `لجنة رقم ${i + 1}`
                  }}
                </v-tab>
              </template>
            </v-tabs>
            <v-divider></v-divider>
            <v-tabs-items v-model="medicalCommitteesTabs">
              <template v-for="(mc, i) in medicalCommittees">
                <v-tab-item :key="i">
                  <v-row>
                    <template v-for="(value, key, i) in mc">
                      <v-col
                        :key="i"
                        v-if="fields[key]"
                        cols="12"
                        sm="6"
                        :md="fields[key].isBig ? 6 : 4"
                      >
                        <v-text-field
                          v-if="fields[key].type == 'text'"
                          v-model="mc[key]"
                          filled
                          :label="fields[key].label"
                          :hint="fields[key].hint"
                          :persistent-hint="fields[key].hint ? true : false"
                          :hide-details="fields[key].hint ? false : true"
                          :prepend-inner-icon="fields[key].icon"
                        >
                        </v-text-field>
                        <v-autocomplete
                          v-else-if="fields[key].type == 'select'"
                          v-model="mc[key]"
                          filled
                          :loading="selects[key].loading"
                          :error-messages="selects[key].error"
                          :label="fields[key].label"
                          :hint="fields[key].hint"
                          :persistent-hint="fields[key].hint ? true : false"
                          :hide-details="fields[key].hint ? false : true"
                          :prepend-inner-icon="fields[key].icon"
                          :items="selects[key].data"
                          :item-text="selects[key].text"
                          :item-value="selects[key].value"
                        >
                        </v-autocomplete>
                        <v-text-field
                          type="date"
                          v-else-if="
                            fields[key].type == 'date' &&
                              !$store.state.appInfo.dateDialog
                          "
                          class="mb-4"
                          v-model="mc[key]"
                          filled
                          :label="fields[key].label"
                          :hint="fields[key].hint"
                          :persistent-hint="fields[key].hint ? true : false"
                          :hide-details="fields[key].hint ? false : true"
                          :prepend-inner-icon="fields[key].icon"
                        >
                        </v-text-field>
                        <v-dialog
                          v-else-if="
                            fields[key].type == 'date' &&
                              $store.state.appInfo.dateDialog
                          "
                          :ref="`${key}_dialog`"
                          v-model="date_dialogs[key + '_' + mc.committeeId]"
                          :return-value.sync="mc[key]"
                          width="290px"
                          persistent
                        >
                          <template v-slot:activator="{ on }">
                            <v-text-field
                              readonly
                              v-on="on"
                              class="mb-4"
                              v-model="mc[key]"
                              filled
                              :label="fields[key].label"
                              :hint="fields[key].hint"
                              :persistent-hint="fields[key].hint ? true : false"
                              :hide-details="fields[key].hint ? false : true"
                              :prepend-inner-icon="fields[key].icon"
                            >
                            </v-text-field>
                          </template>
                          <v-date-picker
                            ref="date_to_picker"
                            v-model="mc[key]"
                            scrollable
                            color="primary"
                          >
                            <v-spacer></v-spacer>
                            <v-btn
                              color="primary"
                              outlined
                              class="px-6 text-capitalize"
                              @click="
                                date_dialogs[key + '_' + mc.committeeId] = false
                              "
                              >إلغاء</v-btn
                            >
                            <v-btn
                              color="primary"
                              class="px-6 text-capitalize"
                              @click="$refs[`${key}_dialog`][0].save(mc[key])"
                              >حفظ</v-btn
                            >
                          </v-date-picker>
                        </v-dialog>
                      </v-col>
                    </template>
                  </v-row>
                  <v-row v-if="isAdmin()">
                    <v-col>
                      <v-btn
                        @click="deleteCommittee(mc.committeeId)"
                        color="error"
                        outlined
                      >
                        <v-icon class="me-2">mdi-trash-can-outline</v-icon>
                        حدف اللجنة
                        {{
                          mc.committeeNumber ? "رقم " + mc.committeeNumber : ""
                        }}
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-tab-item>
              </template>
            </v-tabs-items>
          </div>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="px-4">
          <v-spacer></v-spacer>
          <v-btn
            @click="closeKashf()"
            v-text="'رجوع'"
            color="primary"
            outlined
            class="px-6"
            large
          ></v-btn>
          <v-btn
            @click="saveChanges()"
            v-text="'حفظ'"
            color="primary"
            class="px-6"
            large
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "medicalCommittee-kashf40",
  mounted() {
    this.init();
  },
  data: () => ({
    componentName: "kashf_40",
    militaryId: "",
    model: false,
    loading: false,
    date_dialogs: {},
    conscripte: {},
    medicalCommittees: [],
    medicalCommitteesTabs: 0,
    fields: {
      letterSendingDate40: {
        label: "تاريخ مخاطبة الوحدة"
      },
      confirmationDate40: {
        label: "تاريخ التصديق"
      },
      reviewDate40: {
        label: "تاريخ العرض"
      },
      committeeDate: {
        type: "date",
        label: "تاريخ استلام اللجنة"
      },
      sendCommitteeDate: {
        type: "date",
        label: "تاريخ تسليم اللجنة للشئون القانونية"
      },
      getKaraSababeyaDate: {
        type: "date",
        label: "تاريخ استلام قرار السببية"
      },
      sendLagnetTaawedatDate: {
        type: "date",
        label: "تاريخ تسليم لجنة التعويضات الي الهيئة"
      },
      getLagnetTaawedatDate: {
        type: "date",
        label: "تاريخ استلام لجنةالتعويضات من الهيئة"
      },
      sendTaameenMaashatDate: {
        type: "date",
        label: "تاريخ تسليم الاجراءات لإدارة التأمين و المعاشات",
        isBig: true
      },
      committeeNumber: {
        type: "text",
        label: "رقم اللجنة"
      },
      // medicalCommitteeTypeId: {
      //   type: "select",
      //   label: "نوع التصديق"
      // },
      comitDecisionId: {
        type: "select",
        label: "قرار اللجنة",
        isBig: true
      },
      notes: {
        type: "textarea",
        label: "ملاحظات"
      }
    },
    selects: {
      medicalCommitteeTypeId: {
        data: [],
        text: "displayedText",
        value: "id",
        table: "medicalCommitteeTypes"
      },
      comitDecisionId: {
        data: [],
        text: "displayedText",
        value: "id",
        table: "committees"
      }
    }
  }),
  methods: {
    saveChanges(addNewMedicalCommittee) {
      this.$set(this, "loading", true);
      this.api("global/update_one", {
        table: "conscriptes",
        where: {
          militaryId: this.militaryId
        },
        update: this.conscripte
      })
        .then(x => {
          this.addModification(this.militaryId, 2, 9);
          if (this.medicalCommittees.length > 0) {
            let counter = 0;
            this.medicalCommittees.forEach(async mc => {
              let updateMC = await this.api("global/update_one", {
                table: "medicalCommittees",
                where: {
                  committeeId: mc.committeeId
                },
                update: mc
              });
              counter++;
              this.addModification(this.militaryId, 2, 26);
              if (counter == this.medicalCommittees.length) {
                if (addNewMedicalCommittee) {
                  this.addMedicalCommittee();
                }
              }
            });
          } else {
            if (addNewMedicalCommittee) {
              this.addMedicalCommittee();
            }
          }
        })
        .catch(err => {
          console.log(err);
          this.showError("حدث خطأ أثناء تحديث بيانات كشف الأربعين الأساسية.");
        })
        .finally(() => {
          if (!addNewMedicalCommittee) {
            this.closeKashf(true);
          }
        });
    },
    deleteCommittee(id) {
      this.$set(this, "loading", true);
      this.api("global/delete_all", {
        table: "medicalCommittees",
        where: {
          committeeId: id
        }
      })
        .then(x => {
          this.addModification(this.militaryId, 3, 26);
          console.log(x);
          this.openKashf(this.militaryId);
        })
        .catch(error => {
          consoel.log(error);
          this.showError("حدث خطأ أثناء حذف لجنة طبية لكشف الأربعين.");
        });
    },
    addMedicalCommittee() {
      this.$set(this, "loading", true);
      this.api("global/create_one", {
        table: "medicalCommittees",
        where: {
          militaryId: this.militaryId,
          medicalCommitteeTypeId: "3",
          isFollowed: true
        }
      })
        .then(x => {
          this.addModification(this.militaryId, 1, 26);
          console.log(x);
          this.openKashf(this.militaryId);
        })
        .catch(error => {
          consoel.log(error);
          this.showError("حدث خطأ أثناء إضافة لجنة طبية جديدة لكشف الأربعين.");
        });
    },
    init() {
      // Get selects
      Object.keys(this.selects).forEach(key => {
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
    },
    closeKashf(withReload = false) {
      this.$set(this, "conscripte", {});
      this.$set(this, "militaryId", "");
      this.$set(this, "model", false);
      this.$set(this, "loading", false);
      if (withReload) {
        this.$emit("runFetch40");
      }
    },
    openKashf(id = "") {
      this.$set(this, "model", true);
      this.$set(this, "loading", true);
      this.$set(this, "militaryId", id);
      this.api("global/get_one", {
        table: "conscriptes",
        where: {
          militaryId: id
        },
        attrs: [
          "militaryId",
          "confirmationDate40",
          "letterSendingDate40",
          "reviewDate40"
        ]
      })
        .then(x => {
          // console.log(x);
          if (x.data) {
            let date_keys = Object.keys(x.data).filter(d => d.includes("Date"));
            this.$set(
              this,
              "conscripte",
              this.fixDates([x.data], date_keys)[0]
            );
            this.api("global/get_all", {
              table: "medicalCommittees",
              where: {
                militaryId: id,
                medicalCommitteeTypeId: "3"
              }
            })
              .then(xx => {
                console.log(xx.data);
                this.$set(
                  this,
                  "medicalCommittees",
                  this.fixDates(xx.data, [
                    "committeeDate",
                    "sendCommitteeDate",
                    "getKaraSababeyaDate",
                    "sendLagnetTaawedatDate",
                    "getLagnetTaawedatDate",
                    "sendTaameenMaashatDate"
                  ])
                );
              })
              .catch(err => {
                console.log(err);
                this.showError(
                  "حدث خطأ أثناء تحميل اللجان الطبية لكشف الأربعين."
                );
              })
              .finally(() => {
                this.$set(this, "loading", false);
              });
          }
        })
        .catch(error => {
          console.log(error);
          this.$set(this, "loading", false);
        });
    }
  }
};
</script>
