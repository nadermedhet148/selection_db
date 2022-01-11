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
        <v-col cols="auto" class="my-0 py-0">
          <div class="pe-4 pt-1">
            <v-btn @click="actionAdd()" color="primary" outlined>
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
        item-key="courtId"
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
        <!-- Non empty -->
        <template v-slot:item.contDuty="{ item }">
          <v-chip
            v-if="item.contDuty !== null"
            small
            class="font-weight-bold"
            :color="colors[item.contDuty]"
          >
            {{ contDuties[item.contDuty] }}
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
            :color="item.isUnCompleted ? 'error' : 'success'"
            class="font-weight-bold"
          >
            {{ item.isUnCompleted ? "نعم" : "لا" }}
          </v-chip>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-chip class="transparent">
            <v-btn color="primary" icon @click="actionEdit(item)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn
              v-if="isAdmin()"
              color="error"
              icon
              @click="actionDelete(item)"
            >
              <v-icon>mdi-trash-can</v-icon>
            </v-btn>
          </v-chip>
        </template>
      </v-data-table>
    </v-card>
    <v-dialog
      persistent
      v-if="true"
      scrollable
      v-model="addNew.model"
      max-width="1500"
      :fullscreen="addNew.fullscreen"
    >
      <v-card :loading="addNew.loading" :disabled="addNew.loading">
        <v-card-title>
          محكمة
          <v-spacer></v-spacer>
          <v-btn
            @click="addOrUpdateCourt()"
            large
            color="primary"
            v-text="'حفظ المحكمة'"
            class="px-6"
          ></v-btn>
          <v-spacer></v-spacer>
          <v-btn icon @click="addNew.fullscreen = !addNew.fullscreen">
            <v-icon>
              mdi-window-{{ addNew.fullscreen ? "restore" : "maximize" }}
            </v-icon>
          </v-btn>
          <v-btn icon @click="addNew.model = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-row>
            <v-col cols="12" class="pb-0 text-center">
              <v-row>
                <template v-for="(p, k, i) in periods">
                  <v-col class="pb-0" :key="i">
                    <div>
                      <div class="p-b">
                        {{ p.title }}
                      </div>
                      <div>
                        <v-layout>
                          <v-flex>
                            <div class="p-b">
                              يوم
                            </div>
                            <div class="p-b">
                              {{
                                addNew.item && addNew.item[p.day]
                                  ? addNew.item[p.day]
                                  : "--"
                              }}
                            </div>
                          </v-flex>
                          <v-flex>
                            <div class="p-b">
                              شهر
                            </div>
                            <div class="p-b">
                              {{
                                addNew.item && addNew.item[p.month]
                                  ? addNew.item[p.month]
                                  : "--"
                              }}
                            </div>
                          </v-flex>
                          <v-flex>
                            <div class="p-b">
                              سنة
                            </div>
                            <div class="p-b">
                              {{
                                addNew.item && addNew.item[p.year]
                                  ? addNew.item[p.year]
                                  : "--"
                              }}
                            </div>
                          </v-flex>
                        </v-layout>
                      </div>
                    </div>
                  </v-col>
                </template>
              </v-row>
            </v-col>
            <v-col cols="12">
              <v-row>
                <template v-for="(field, n) in fields">
                  <v-col class="px-0" :key="n">
                    <div v-if="isAdmin()" class="mb-1">
                      <v-expansion-panels>
                        <v-expansion-panel>
                          <v-expansion-panel-header>
                            تعديل اللون
                          </v-expansion-panel-header>
                          <v-expansion-panel-content>
                            <div>
                              <div>
                                <v-color-picker
                                  v-model="
                                    $store.state.appProps[
                                      fColors[`c${n + 1}`] +
                                        `_${
                                          $vuetify.theme.dark ? 'dark' : 'light'
                                        }`
                                    ].value
                                  "
                                ></v-color-picker>
                              </div>
                              <div class="mb-4 px-3">
                                <v-btn
                                  large
                                  block
                                  @click="
                                    updateAppProp(
                                      fColors[`c${n + 1}`] +
                                        `_${
                                          $vuetify.theme.dark ? 'dark' : 'light'
                                        }`
                                    )
                                  "
                                  v-text="'حفظ اللون'"
                                  outlined
                                ></v-btn>
                              </div>
                            </div>
                          </v-expansion-panel-content>
                        </v-expansion-panel>
                      </v-expansion-panels>
                    </div>
                    <template v-for="(f, i) in field">
                      <v-card
                        tile
                        flat
                        :class="`py-4 ma-0 px-3`"
                        :color="
                          $store.state.appProps[
                            fColors['c' + (n + 1)] +
                              ($vuetify.theme.dark ? '_dark' : '_light')
                          ]
                            ? $store.state.appProps[
                                fColors['c' + (n + 1)] +
                                  ($vuetify.theme.dark ? '_dark' : '_light')
                              ].value
                            : ''
                        "
                        :disabled="
                          f.sections &&
                            f.sections.length > 0 &&
                            !f.sections.includes(
                              $store.state.currentUser.section
                            )
                        "
                        :key="i"
                      >
                        <v-card-text class="pa-0 ma-0">
                          <div
                            :class="
                              `mb-2 ${
                                $vuetify.theme.dark
                                  ? 'white--text'
                                  : 'black--text'
                              }`
                            "
                            style="font-size: 18px"
                          >
                            {{ f.label }}
                          </div>
                          <div>
                            <v-text-field
                              v-if="
                                !f.type || f.type == 'text' || f.type == 'date'
                              "
                              :type="f.type == 'date' ? 'date' : 'text'"
                              outlined
                              @change="
                                f.type == 'date' &&
                                affectsPeriod.includes(f.model)
                                  ? calculatePrisonPeriod()
                                  : () => {}
                              "
                              v-model="addNew.item[f.model]"
                              :persistent-hint="f.hint ? true : false"
                              :hide-details="f.hint ? false : true"
                              :hint="f.hint"
                              :error-messages="
                                errors[f.model] ? errors[f.model] : ''
                              "
                              :disabled="
                                (f.requireCourtId && !addNew.item.courtId) ||
                                  (f.sections &&
                                    f.sections.length > 0 &&
                                    !f.sections.includes(
                                      $store.state.currentUser.section
                                    ))
                              "
                            ></v-text-field>
                            <div v-else-if="f.type == 'divider'">
                              {{ f.label }}
                            </div>
                            <v-btn
                              :disabled="
                                (f.requireCourtId && !addNew.item.courtId) ||
                                  (f.sections &&
                                    f.sections.length > 0 &&
                                    !f.sections.includes(
                                      $store.state.currentUser.section
                                    ))
                              "
                              v-else-if="f.type == 'btn'"
                              @click="f.action ? runFun(f.action) : () => {}"
                              block
                              v-text="f.label"
                              x-large
                              depressed
                              height="56"
                              outlined
                            ></v-btn>
                            <div v-else-if="f.type == 'tripartite'">
                              <v-row class="mb-0 pb-0">
                                <template v-for="(ff, fi) in f.fields">
                                  <v-col :key="fi" class="mb-0 pb-0">
                                    <v-text-field
                                      v-model="addNew.item[ff.model]"
                                      :persistent-hint="ff.hint ? true : false"
                                      :hide-details="ff.hint ? false : true"
                                      :hint="ff.hint"
                                      outlined
                                      :label="ff.label"
                                      @change="
                                        affectsPeriod.includes(ff.model)
                                          ? calculatePrisonPeriod()
                                          : () => {}
                                      "
                                    ></v-text-field>
                                  </v-col>
                                </template>
                              </v-row>
                            </div>
                            <v-btn
                              class="btn-checkbox"
                              height="56"
                              v-else-if="f.type == 'checkbox'"
                              @click="invertCheckbox(f.model)"
                              block
                              :disabled="
                                (f.requireCourtId && !addNew.item.courtId) ||
                                  (f.sections &&
                                    f.sections.length > 0 &&
                                    !f.sections.includes(
                                      $store.state.currentUser.section
                                    ))
                              "
                              depressed
                              :color="
                                addNew.item[f.model] ? 'primary' : 'secondary'
                              "
                              x-large
                              :outlined="addNew.item[f.model] ? false : true"
                            >
                              {{ f.label }}
                              <v-icon
                                >mdi-checkbox-{{
                                  addNew.item[f.model] ? "marked" : "blank"
                                }}-outline
                              </v-icon>
                            </v-btn>
                            <v-textarea
                              v-else-if="f.type == 'textarea'"
                              auto-grow
                              :background-color="
                                f.highlight
                                  ? $vuetify.theme.dark
                                    ? 'blue darken-3'
                                    : 'blue lighten-4'
                                  : ''
                              "
                              rows="1"
                              outlined
                              v-model="addNew.item[f.model]"
                              :hint="f.hint"
                              :disabled="
                                (f.requireCourtId && !addNew.item.courtId) ||
                                  (f.sections &&
                                    f.sections.length > 0 &&
                                    !f.sections.includes(
                                      $store.state.currentUser.section
                                    ))
                              "
                              :error-messages="
                                errors[f.model] ? errors[f.model] : ''
                              "
                              :persistent-hint="f.hint ? true : false"
                              :hide-details="f.hint ? false : true"
                            ></v-textarea>
                            <v-autocomplete
                              v-else-if="f.type == 'select'"
                              outlined
                              :items="
                                selects &&
                                selects[f.model] &&
                                selects[f.model].data
                                  ? selects[f.model].data
                                  : []
                              "
                              :item-text="
                                selects &&
                                selects[f.model] &&
                                selects[f.model].text
                                  ? selects[f.model].text
                                  : 'text'
                              "
                              :disabled="
                                (f.requireCourtId && !addNew.item.courtId) ||
                                  (f.sections &&
                                    f.sections.length > 0 &&
                                    !f.sections.includes(
                                      $store.state.currentUser.section
                                    ))
                              "
                              clearable
                              :item-value="
                                selects &&
                                selects[f.model] &&
                                selects[f.model].value
                                  ? selects[f.model].value
                                  : 'value'
                              "
                              :error-messages="
                                selects &&
                                selects[f.model] &&
                                selects[f.model].error
                                  ? selects[f.model].error
                                  : errors[f.model]
                                  ? errors[f.model]
                                  : ''
                              "
                              :loading="
                                selects &&
                                selects[f.model] &&
                                selects[f.model].loading
                                  ? selects[f.model].loading
                                  : false
                              "
                              v-model="addNew.item[f.model]"
                              :hint="f.hint"
                              :persistent-hint="f.hint ? true : false"
                              :hide-details="f.hint ? false : true"
                            ></v-autocomplete>
                          </div>
                        </v-card-text>
                      </v-card>
                    </template>
                  </v-col>
                </template>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog scrollable v-model="deleteDialog.model" max-width="450">
      <v-card :loading="deleteDialog.loading" :disabled="deleteDialog.loading">
        <v-card-title class="white--text error">
          حذف محكمة
          <v-spacer></v-spacer>
          <v-btn dark @click="deleteDialog.model = false" icon>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pt-4">
          هل تريد بالتأكيد حذف المحكمة؟
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
            v-text="'حذف المحكمة'"
            class="px-6"
            @click="deleteMe(deleteDialog.item)"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog></v-dialog>
  </div>
</template>

<style scoped lang="scss">
.p-b {
  border: 1px solid var(--v-secondary-lighten4);
  border-radius: 1px;
  padding: 10px 0px;
}
</style>

<script>
export default {
  name: "basic-profile-courts",
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
  mounted() {
    this.init();
    // console.log(this.externals);
  },
  methods: {
    calculatePrisonPeriod() {
      let {
          // الحبس الإحتياطي
          prosecutionFrom,
          prosecutionTo,
          // الحبس
          imprisonFrom,
          imprisonTo,
          // الإفراج
          releaseDate,
          // الحبس
          pYear,
          pMonth,
          pDay,
          // التخفيض
          reductionYear,
          reductionMonth,
          reductionDay,
          // العفو
          forgiveYear,
          forgiveMonth,
          forgiveDay
        } = this.addNew.item,
        startDate = prosecutionFrom
          ? prosecutionFrom
          : imprisonFrom
          ? imprisonFrom
          : null,
        endDate = imprisonTo
          ? imprisonTo
          : prosecutionTo
          ? prosecutionTo
          : null,
        reductionPeriod = 0;
      reductionPeriod += Number(reductionDay) > 0 ? Number(reductionDay) : 0;
      reductionPeriod +=
        Number(reductionMonth) > 0 ? Number(reductionMonth) * 30 : 0;
      reductionPeriod +=
        Number(reductionYear) > 0 ? Number(reductionYear) * (30 * 12) : 0;
      reductionPeriod = Number(reductionPeriod) * (24 * 60 * 60 * 1000);
      console.log("ReductionPeriod " + reductionPeriod);
      let diff =
        startDate && endDate ? new Date(endDate) - new Date(startDate) : 0;
      if (diff > 0) {
        diff -= reductionPeriod;
      }
      let diffWithReleaseDate =
          startDate && releaseDate
            ? new Date(releaseDate) - new Date(startDate)
            : 0,
        { year: fyear, month: fmonth, day: fday } = this.periodToDate(
          diffWithReleaseDate == 0 || diffWithReleaseDate > diff
            ? 0
            : diff - diffWithReleaseDate,
          false
        ),
        { year, month, day } = this.periodToDate(
          diffWithReleaseDate ? diffWithReleaseDate : diff
        );
      this.$set(this.addNew.item, "pYear", year);
      this.$set(this.addNew.item, "pMonth", month);
      this.$set(this.addNew.item, "pDay", day);
      this.$set(this.addNew.item, "forgiveYear", fyear);
      this.$set(this.addNew.item, "forgiveMonth", fmonth);
      this.$set(this.addNew.item, "forgiveDay", fday);
      this.$set(this.addNew.item, "reductionYear", reductionYear);
      this.$set(this.addNew.item, "reductionMonth", reductionMonth);
      this.$set(this.addNew.item, "reductionDay", reductionDay);
    },
    invertCheckbox(model) {
      let value = this.addNew.item[model],
        newValue =
          this.addNew.item[model] && this.addNew.item[model] == true
            ? false
            : true;
      this.$set(this.addNew.item, model, newValue);
    },
    actionEdit(item) {
      this.$set(this.addNew, "item", { ...item });
      this.$set(this.addNew, "model", true);
    },
    actionDelete(item) {
      this.$set(this.deleteDialog, "item", item);
      this.$set(this.deleteDialog, "model", true);
    },
    async deleteMe(item) {
      this.$set(this.deleteDialog, "loading", true);
      this.$set(this, "loading", true);
      let deleteProcs = await this.api("global/delete_all", {
        table: "procedures",
        where: {
          courtId: item.courtId
        }
      });
      this.api("global/delete_all", {
        table: "courts",
        where: {
          courtId: item.courtId
        }
      })
        .then(x => {
          this.addModification(this.conscripte.militaryId, 3, 23);
          this.fixDemobilizationDate(this.conscripte.militaryId);
          this.showSuccess("تم الحذف بنجاح");
          let index = this.externals.findIndex(f => f.courtId == item.courtId);
          this.externals.splice(index, 1);
        })
        .catch(error => {
          console.log(error);
          this.showError("حدث خطأ أثناء حذف المحكمة من قاعدة البيانات.");
        })
        .finally(() => {
          this.$set(this.deleteDialog, "loading", false);
          this.$set(this, "loading", false);
          this.$set(this.deleteDialog, "model", false);
        });
    },
    actionAdd() {
      this.$set(this.addNew, "item", {
        isFollowed: true,
        contDuty: null,
        notFollowingEhtyat: false,
        isUnCompleted: true,
        militaryId: this.conscripte.militaryId
      });
      this.$set(this.addNew, "model", true);
    },
    async addOrUpdateCourt() {
      this.$set(this, "errors", {});
      this.$set(this.addNew, "loading", true);
      let originalCourt = { ...this.addNew.item },
        date_keys = Object.keys(originalCourt)
          .map(k => (k.toLowerCase().includes("date") ? k : "NOT_A_DATE"))
          .filter(k => k !== "NOT_A_DATE"),
        otherDateKeys = [
          "imprisonFrom",
          "imprisonTo",
          "prosecutionFrom",
          "prosecutionTo",
          "lastUnitReply",
          "lastBranchReply",
          "lastShbka"
        ],
        testCourt = this.originalDates(
          [originalCourt],
          [...date_keys, ...otherDateKeys]
        )[0],
        id = testCourt.courtId,
        isNew = id ? false : true,
        court = {};
      Object.keys(testCourt).forEach(k => {
        court[k] =
          testCourt[k] || typeof testCourt[k] == "boolean"
            ? testCourt[k]
            : null;
      });

      // IsFollowed lookup
      court.isFollowed = false;
      let requiredFields = [
        "imprisonFrom",
        "imprisonTo",
        "releaseDate",
        "courtAppear",
        "courtDate",
        "crimeSummary",
        "prosecutionAppear",
        "judgment",
        "courtConfermation",
        "executionWritDate",
        "crimeStartDate",
        "crimeEndDate",
        "judgmentDate",
        "judgmentExtractDate",
        "notifyBranchDate"
      ];
      requiredFields.forEach(rf => {
        if (!court[rf]) {
          console.log("Missed " + rf);
          court.isFollowed = true;
        }
      });
      let addCourt = await this.api(
        `global/${isNew ? "create" : "update"}_one`,
        {
          table: "courts",
          where: isNew
            ? court
            : {
                courtId: id
              },
          update: court,
          returner: "courtId"
        }
      );
      if (addCourt && addCourt.ok && addCourt.data) {
        this.addModification(this.conscripte.militaryId, isNew ? 1 : 2, 23);
        this.fixDemobilizationDate(this.conscripte.militaryId);
        let courtId = isNew ? addCourt.data : id,
          index = isNew
            ? this.externals.length
            : this.externals.findIndex(f => f.courtId == courtId),
          newOrUpdatedCourt = await this.api("global/get_one", {
            table: "courts",
            where: {
              courtId
            }
          }),
          theCourt = newOrUpdatedCourt.data;
        if (newOrUpdatedCourt && newOrUpdatedCourt.ok && theCourt) {
          let fixedCourt = this.fixDates(
            [theCourt],
            [...date_keys, ...otherDateKeys]
          )[0];
          this.$set(this.externals, index, fixedCourt);
          this.$set(this.addNew, "item", fixedCourt);
          this.$set(this.addNew, "loading", false);
          this.showSuccess("تم حفظ المحكمة");
        } else {
          this.$set(this.addNew, "loading", false);
          this.showError(
            "حدث خطأ أثناء استدعاء المحكمة بعد حفظها في قاعدة البيانات."
          );
        }
      } else {
        this.$set(this.addNew, "loading", false);
        this.showError("حدث خطأ أثناء حفظ المحكمة");
      }
    },
    runFun(fun) {
      if (this[fun]) {
        this[fun]();
      }
    },
    showUnitProcedures() {
      let courtId = this.addNew.item.courtId;
      this.$set(this.$store.state.dbprocs, "procedureType", 1);
      this.$set(this.$store.state.dbprocs, "situationType", 3);
      this.$set(this.$store.state.dbprocs, "situationId", courtId);
      this.$set(this.$store.state.dbprocs, "model", true);
    },
    showShabakaProcedures() {
      let courtId = this.addNew.item.courtId;
      this.$set(this.$store.state.dbprocs, "procedureType", 5);
      this.$set(this.$store.state.dbprocs, "situationType", 3);
      this.$set(this.$store.state.dbprocs, "situationId", courtId);
      this.$set(this.$store.state.dbprocs, "model", true);
    },
    init(specificTable = "") {
      // Get selects
      Object.keys(this.selects).forEach(key => {
        let { table, localTable, text, value } = this.selects[key];
        if (table) {
          let obj = {
            table
          };
          obj.attrs = [text, value];
          this.$set(this.selects[key], "loading", true);
          this.api("global/get_all", obj)
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
    }
  },
  data: () => ({
    errors: {},
    affectsPeriod: [
      // الحبس الإحتياطي
      "prosecutionFrom",
      "prosecutionTo",
      // الحبس
      "imprisonFrom",
      "imprisonTo",
      // الإفراج
      "releaseDate",
      // التخفيض
      "reductionYear",
      "reductionMonth",
      "reductionDay"
    ],
    n_cols: 4,
    deleteDialog: {
      model: false,
      loading: false,
      item: {}
    },
    selects: {
      endingDutyStudy: {
        localTable: "endingDutyStudies",
        value: "id",
        text: "displayedText"
      },
      contDuty: {
        localTable: "contDuties",
        value: "id",
        text: "displayedText"
      },
      demobilizationStudy: {
        localTable: "demobilizationStudies",
        value: "id",
        text: "displayedText"
      },
      medicalSituation: {
        table: "sequestrators",
        value: "id",
        text: "displayedText"
      },
      courtConfermation: {
        localTable: "courtConfermations",
        value: "id",
        text: "displayedText"
      }
    },
    periods: {
      afw: {
        title: "إجمالي مدة العفو",
        day: "forgiveDay",
        month: "forgiveMonth",
        year: "forgiveYear"
      },
      ta5feed: {
        title: "إجمالي مدة التخفيض",
        day: "reductionDay",
        month: "reductionMonth",
        year: "reductionYear"
      },
      habs: {
        title: "إجمالي مدة الحبس",
        day: "pDay",
        month: "pMonth",
        year: "pYear"
      }
    },
    fields: [
      [
        {
          label: "رقم القضية",
          model: "courtAppear",
          type: "text",
          color: "c1"
        },
        {
          label: "تاريخ المحكمة",
          model: "courtDate",
          type: "date",
          color: "c1"
        },
        {
          label: "ملخص الجريمة",
          model: "crimeSummary",
          type: "textarea",
          color: "c1"
        },
        {
          label: "قرار النيابة",
          model: "prosecutionAppear",
          type: "textarea",
          highlight: true,
          color: "c1"
          // labelClass: "primary--text"
        },
        {
          label: "بداية الحبس الإحتياطي",
          model: "prosecutionFrom",
          type: "date",
          color: "c1"
        },
        {
          label: "نهاية الحبس الإحتياطي",
          model: "prosecutionTo",
          type: "date",
          color: "c1"
        }
      ],
      [
        {
          label: "الحكم",
          model: "judgment",
          type: "textarea",
          color: "c2"
        },
        {
          label: "تاريخ النطق بالحكم",
          model: "imprisonFrom",
          type: "date",
          color: "c2"
        },
        {
          label: "نهاية الحكم",
          model: "imprisonTo",
          type: "date",
          color: "c2"
        },
        {
          label: "تصديق الحكم",
          model: "courtConfermation",
          type: "select",
          color: "c2"
        },
        {
          label: "أدخل مدة التخفيض",
          type: "tripartite",
          color: "c2",
          fields: [
            {
              label: "يوم",
              model: "reductionDay",
              type: "text"
            },
            {
              label: "شهر",
              model: "reductionMonth",
              type: "text"
            },
            {
              label: "سنة",
              model: "reductionYear",
              type: "text"
            }
          ]
        },
        {
          label: "تاريخ الإفراج",
          model: "releaseDate",
          type: "date",
          color: "c2"
        }
      ],
      [
        {
          label: "تاريخ بداية الجريمة",
          model: "crimeStartDate",
          type: "date",
          color: "c3"
        },
        {
          label: "تاريخ نهاية الجريمة",
          model: "crimeEndDate",
          type: "date",
          color: "c3"
        },
        {
          label: "تاريخ أمر التنفيذ",
          model: "executionWritDate",
          type: "date",
          color: "c3"
        },
        {
          label: "تاريخ إعلان الحكم",
          model: "judgmentDate",
          type: "date",
          color: "c3"
        },
        {
          label: "تاريخ مستخرج الحكم",
          model: "judgmentExtractDate",
          type: "date",
          color: "c3"
        },
        {
          label: "تاريخ 161 س",
          model: "s161Date",
          type: "date",
          color: "c3"
        }
      ],
      [
        {
          label: "تاريخ اخطار الفرع",
          model: "notifyBranchDate",
          type: "date",
          color: "c4"
        },
        {
          label: "آخر رد للوحدة",
          model: "lastUnitReply",
          type: "date",
          color: "c4"
        },
        {
          label: "آخر تسجيل على الشبكة العسكرية",
          model: "lastShbka",
          type: "date",
          color: "c4"
        },
        {
          label: "عرض إجراءات الوحدة",
          type: "btn",
          action: "showUnitProcedures",
          requireCourtId: true,
          color: "c4"
        },
        {
          label: "عرض التسجيل على الشبكة",
          type: "btn",
          action: "showShabakaProcedures",
          requireCourtId: true,
          color: "c4"
        },
        {
          label: "ملاحظات",
          model: "notes",
          type: "textarea",
          color: "c4"
        }
      ],
      [
        {
          label: "الموقف الطبي",
          model: "medicalSituation",
          type: "select",
          color: "c5"
        },
        // {
        //   label: "دراسة إنهاء الخدمة",
        //   model: "endingDutyStudy",
        //   type: "select",
        //   color: "c5",
        //   sections: [0, 3]
        // },
        {
          label: "جريمة مخله بالشرف",
          model: "isDishonorable",
          type: "checkbox",
          color: "c5"
        },
        {
          label: "حريمة تمس أمن وسلامة ق م . ",
          model: "isForSecurity",
          type: "checkbox",
          color: "c5"
        },
        {
          label: "دراسة إنهاء الخدمة",
          model: "contDuty",
          //type: "checkbox",
          type: "select",
          color: "c5",
          sections: [0, 3]
        },
        {
          label: "دراسة موقف التسريح",
          model: "demobilizationStudy",
          type: "select",
          color: "c5",
          sections: [0, 2]
        },
        {
          label: "الموقف لا يخص الإحتياط",
          model: "notFollowingEhtyat",
          type: "checkbox",
          color: "c5",
          sections: [0, 2]
        }
      ]
      // {
      //   label: "رأي قسم الإحتياط",
      //   model: "ehtyatNotes",
      //   type: "textarea"
      // },
      // {
      //   label: "رأي قسم الإنهاء",
      //   model: "endDutyNotes",
      //   type: "textarea"
      // },
    ],
    fColors: {
      c1: "courts_colColor1", // courts_colColor1
      c2: "courts_colColor2",
      c3: "courts_colColor3",
      c4: "courts_colColor4",
      c5: "courts_colColor5"
    },
    addNew: {
      model: false,
      loading: false,
      fullscreen: false,
      item: {}
    },
    tableFilters: {},
    endingDutyStudies: ["لا ينطبق", "رفت جوازي", "رفت وجوبي", "مستمر"],
    contDuties: {
      null: "",
      false: "منتهى",
      true: "مستمر"
    },
    loading: false,
    colors: {
      null: "orange white--text",
      false: "error",
      true: "success"
    },
    // colors: {
    //   0: "default",
    //   1: "orange white--text",
    //   2: "error",
    //   3: "success"
    // },
    selected: [],
    headers: [
      {
        text: "تاريخ المحكمة",
        sortable: true,
        value: "courtDate"
      },
      {
        text: "الحكم",
        sortable: true,
        value: "judgment"
      },
      // {
      //   text: "د. إنهاء الخدمة",
      //   sortable: true,
      //   value: "endingDutyStudy"
      // },
      {
        text: "د. إنهاء الخدمة",
        sortable: true,
        value: "contDuty"
      },
      {
        text: "متابع",
        sortable: true,
        value: "isFollowed"
      },
      // {
      //   text: "لم يكتمل تسجيلة",
      //   sortable: true,
      //   value: "isUnCompleted"
      // },
      {
        text: "",
        sortable: false,
        value: "actions"
      }
    ],
    search: ""
  })
};
</script>
