<template>
  <div>
    <v-tabs
      show-arrows
      height="60"
      slider-size="3"
      center-active
      v-model="window"
      :slider-color="windows[window].red ? 'black' : 'primary'"
    >
      <template
        v-for="(w, i) in windows.filter(
          w =>
            !conscripte.typeId ||
            !w.typeId ||
            w.typeId.includes(conscripte.typeId)
        )"
      >
        <v-tab
          :disabled="loading || local_loading"
          v-show="!w.removed"
          :active-class="`${w.red ? 'white--text' : 'primary--text'}`"
          :class="
            ` ls-0 text-body-1 ${w.red ? 'error white--text' : 'grey--text'}`
          "
          :key="i"
        >
          {{ w.title }}
          <v-chip
            color="grey lighten-5"
            class="ms-3 grey--text text--darken-4"
            v-if="
              (w.counter && w.counter > 0) ||
                (externals[w.id] &&
                  Array.isArray(externals[w.id]) &&
                  externals[w.id].length > 0)
            "
          >
            {{
              externals[w.id] && Array.isArray(externals[w.id])
                ? externals[w.id].length
                : w.counter
            }}
          </v-chip>
        </v-tab>
      </template>
    </v-tabs>
    <v-divider></v-divider>
    <v-card
      color="transparent"
      tile
      flat
      class="px-0 mx-0"
      :loading="loading || local_loading"
      :disabled="loading || local_loading"
    >
      <v-card-title class="primary--text">
        {{ windows[window].title }}
        <v-spacer></v-spacer>
        <v-card-actions class="pa-0">
          <v-btn
            class="px-4 me-3"
            @click="$emit('force_reload_cons')"
            color="primary"
            large
            exact
            outlined
          >
            <v-icon class="me-3">mdi-reload</v-icon>
            اعادة التحميل
          </v-btn>
          <v-btn
            class="px-4 me-3"
            to="/soldiers_plus"
            color="primary"
            large
            exact
            outlined
          >
            <v-icon class="me-3">mdi-backspace-outline</v-icon>
            عودة للقائمة
          </v-btn>

          <print-conscripte-profile
            class="me-3"
            :militaryId="conscripte.militaryId"
          ></print-conscripte-profile>
          <v-btn
            v-if="!$store.state.allowConscripteEdit"
            class="px-6"
            color="primary"
            large
            @click="Edit()"
          >
            تعديل الفرد
          </v-btn>
        </v-card-actions>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-tabs-items class="transparent" v-model="window">
          <v-tab-item>
            <new-profile :conscripteObJ="conscripte"></new-profile>
          </v-tab-item>
          <!-- Notes -->
          <!-- <v-tab-item>
            <v-row>
              <template v-for="(note, i) in notes.childs">
                <v-col cols="12" md="6" :key="i">
                  <v-card>
                    <v-card-title>
                      {{ note.label }}
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-card-text>
                      <v-textarea
                        prepend-inner-icon="mdi-comment-outline"
                        filled
                        rows="7"
                        auto-grow
                        v-model="conscripte[note.model]"
                      ></v-textarea>
                    </v-card-text>
                  </v-card>
                </v-col>
              </template>
            </v-row>
          </v-tab-item> -->
          <v-tab-item>
            <fugitives-card
              :conscripte.sync="conscripte"
              :externals.sync="externals.fugitives"
            ></fugitives-card>
          </v-tab-item>
          <v-tab-item>
            <injuries-card
              @addOrRemoveMedicalCommittee="addOrRemoveMedicalCommittee"
              :conscripte.sync="conscripte"
              :externals.sync="externals.injuries"
            ></injuries-card>
          </v-tab-item>
          <v-tab-item>
            <medical-committees-card
              :conscripte.sync="conscripte"
              :externals.sync="externals.medicalCommittees"
            ></medical-committees-card>
          </v-tab-item>
          <!--  -->
          <v-tab-item>
            <courts-card
              :conscripte.sync="conscripte"
              :externals.sync="externals.courts"
            ></courts-card>
          </v-tab-item>
          <v-tab-item>
            <penalties-card
              :conscripte.sync="conscripte"
              :externals.sync="externals.penalties"
            ></penalties-card>
          </v-tab-item>
          <v-tab-item v-if="!conscripte.typeId || conscripte.typeId == 1">
            <ignorant-card
              :conscripte.sync="conscripte"
              :externals.sync="externals.failureSessions"
            ></ignorant-card>
          </v-tab-item>
          <v-tab-item>
            <promotions-card
              :conscripte.sync="conscripte"
              :externals.sync="externals.promotions"
            ></promotions-card>
          </v-tab-item>
          <v-tab-item v-if="!conscripte.typeId || conscripte.typeId == 1">
            <exemption-card
              :conscripte.sync="conscripte"
              :externals.sync="externals.exemptions"
            ></exemption-card>
          </v-tab-item>
          <!-- serveUnits -->
          <v-tab-item v-if="!conscripte.typeId || conscripte.typeId == 2">
            <exemption-card
              :conscripte.sync="conscripte"
              :externals.sync="externals.serveUnits"
            ></exemption-card>
          </v-tab-item>
          <!-- efficiencyReports -->
          <v-tab-item v-if="!conscripte.typeId || conscripte.typeId == 2">
            <exemption-card
              :conscripte.sync="conscripte"
              :externals.sync="externals.efficiencyReports"
            ></exemption-card>
          </v-tab-item>
          <!-- medicalStates -->
          <v-tab-item v-if="!conscripte.typeId || conscripte.typeId == 2">
            <exemption-card
              :conscripte.sync="conscripte"
              :externals.sync="externals.medicalStates"
            ></exemption-card>
          </v-tab-item>
          <!-- travilingAbroads -->
          <v-tab-item v-if="!conscripte.typeId || conscripte.typeId == 2">
            <exemption-card
              :conscripte.sync="conscripte"
              :externals.sync="externals.travilingAbroads"
            ></exemption-card>
          </v-tab-item>
        </v-tabs-items>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
let loadView = function(name) {
  return function(resolve) {
    require([
      `@/components/sections/tasgeel/soldier_plus/soldier_profile/basic_profile/cards/${name}.vue`
    ], resolve);
  };
};
const constants = require("@/Constant").default;

export default {
  name: "basic-profile",
  components: {
    FugitivesCard: loadView("fugitives"),
    InjuriesCard: loadView("injuries"),
    MedicalCommitteesCard: loadView("medical-committees"),
    CourtsCard: loadView("courts"),
    IgnorantCard: loadView("ignorants"),
    ExemptionCard: loadView("exemption"),
    PenaltiesCard: loadView("penalties"),
    NewProfile: () => import("@/views/tasgeel/NewProfile"),
    PrintConscripteProfile: () =>
      import("@/components/items/military_printer/conscripte-profile.vue")
  },
  props: {
    demobilizationObj: {
      type: Object,
      default: () => ({})
    },
    soldier_id: {
      type: String,
      default: ""
    },
    conscripte: {
      type: Object,
      default: () => ({})
    },
    externals: {
      type: Object,
      default: () => ({})
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    this.init();
    this.$emit("loopOnRemoveOrRedTab_requests");
    this.updateBasedOnTypeId();
  },
  watch: {
    "conscripte.ID"(a, b) {
      // It's not required to have a before value
      // Because this function will run once.
      console.log("working ________");
      this.updateBasedOnTypeId();
      if (this.conLoaded()) {
        this.updateBasedOnMilitaryId();
        this.updateBasedOnMaritalStates();
        this.updateBasedOnQualificationId();
        this.updateBasedOnTypeId();
        this.updateBasedOnConscriptionDate();
        this.updateBasedOnNotes();
      }
    },
    "conscripte.qualificationId"(a, b) {
      // a = after (new value), b = before (old value)
      // If there is no ( b ), There was no conscripte. So don't run any update function.
      if (this.conLoaded()) {
        this.updateBasedOnQualificationId();
      }
    },
    "conscripte.martialStateId"(a, b) {
      if (this.conLoaded()) {
        this.updateBasedOnMaritalStates();
      }
    },
    "conscripte.typeId"(a, b) {
      if (this.conLoaded()) {
        this.updateBasedOnTypeId();
      }
    },
    "conscripte.conscriptionDate"(a, b) {
      if (this.conLoaded()) {
        this.updateBasedOnConscriptionDate();
      }
    },
    "conscripte.notes"(a, b) {
      if (this.conLoaded()) {
        this.updateBasedOnNotes(a);
      }
    },
    "conscripte.notesDemobilization"(a, b) {
      if (this.conLoaded()) {
        this.updateBasedOnNotes();
      }
    }
  },
  computed: {
    computed_selects() {
      let selects = this.selects;
      return selects;
    }
  },
  data: () => ({
    local_loading: false,
    print_options: [
      {
        title: "كارت مجند",
        printFunction: "print_card"
      },
      {
        title: "1 س من الشبكة العسكرية",
        printFunction: "print_1s"
      },
      {
        title: "1 س من المنظومة الداخلية",
        printFunction: "print_1s_local"
      }
    ],
    window: 0,
    windows: [
      {
        title: "الأساسية",
        id: "main"
      }
      // {
      //   title: "الملاحظات",
      //   id: "notes"
      // },
      // {
      //   title: "الهروب",
      //   id: "fugitives"
      // },
      // {
      //   title: "إصابات / أمراض",
      //   id: "injuries"
      // },
      // {
      //   title: "المجلس الطبي",
      //   id: "medicalCommittees"
      // },
      // {
      //   title: "تحقيقات / محاكم",
      //   id: "courts"
      // },
      // {
      //   title: "العقوبات",
      //   id: "penalties"
      // },
      // {
      //   title: "محو الأمية",
      //   id: "ignorants",
      //   typeId: [1]
      // }
      // {
      //   title: "توصيات الترقي",
      //   id: "promotions"
      // },
      // {
      //   title: "إعفاء مؤقت",
      //   id: "exemptions",
      //   typeId: [1]
      // },
      // {
      //   title: "جهات الخدمة",
      //   id: "serveUnits",
      //   typeId: [2]
      // },
      // {
      //   title: "تقرير الكفاءة",
      //   id: "efficiencyReports",
      //   typeId: [2]
      // },
      // {
      //   title: "المستوى الطبي",
      //   id: "medicalStates",
      //   typeId: [2]
      // },
      // {
      //   title: "السفر للخارج",
      //   id: "travilingAbroads",
      //   typeId: [2]
      // }
    ],
    date_dialogs: {},
    notes: {
      counter: 0,
      childs: [
        {
          type: "textarea",
          label: "ملاحظات عادية",
          model: "notes"
        },
        {
          type: "textarea",
          label: "ملاحظات تسريح",
          model: "notesDemobilization"
        }
      ]
    },
    sections: [
      {
        title: "بيانات مدنية",
        id: "1",
        childs: [
          {
            type: "text",
            label: "الإسم",
            model: "Name"
          },
          {
            type: "date",
            label: "تاريخ الميلاد",
            model: "birthDate"
          },
          {
            type: "text",
            label: "الرقم الثلاثي",
            model: "tripartiteNumber"
          },
          {
            type: "text",
            label: "الرقم القومي",
            model: "IdentityNo"
          },
          {
            type: "text",
            label: "رقم التليفون",
            model: "phone"
          },
          {
            type: "text",
            label: "العنوان",
            model: "address"
          },
          {
            type: "select",
            label: "المحافظة",
            model: "governorateId"
          },
          {
            type: "select",
            label: "الديانة",
            model: "religionId"
          },
          {
            type: "select",
            label: "فصيلة الدم",
            model: "bloodTypeId",
            halfSize: true
          },
          {
            type: "select",
            label: "الحالة الإجتماعية",
            model: "martialStateId",
            halfSize: true
          },
          {
            type: "select",
            label: "الأبوين",
            model: "parents",
            halfSize: true
          },
          {
            type: "number",
            label: "عدد الزوجات",
            model: "wifeCount",
            halfSize: true
          },
          {
            type: "number",
            label: "عدد الذكور",
            model: "sonsCount",
            halfSize: true
          },
          {
            type: "number",
            label: "عدد الإناث",
            model: "daughtersCount",
            halfSize: true
          }
        ]
      },
      {
        title: "بيانات من الرقم العسكري",
        id: "2",
        childs: [
          {
            type: "text",
            readonly: true,
            label: "الرقم العسكري",
            model: "militaryId"
          },
          {
            type: "select",
            label: "منطقة التجنيد",
            model: "areaId"
          },
          {
            type: "select",
            label: "المؤهل",
            model: "qualificationId",
            halfSize: true
          },
          {
            type: "select",
            label: "السلاح",
            model: "forceId",
            halfSize: true
          },
          {
            type: "select",
            label: "الفئة",
            model: "groupId",
            halfSize: true
          }
        ]
      },
      {
        title: "موقف الخدمة",
        id: "3",
        childs: [
          {
            type: "select",
            label: "حالة الفرد",
            model: "stateIdCurrent"
          },
          {
            type: "select",
            label: "سبب الإنهاء",
            model: "stateId"
          },
          {
            type: "select",
            label: "الجيش / المنطقة",
            model: "zoneId"
          },
          {
            type: "select",
            label: "الوحدة",
            model: "unitId"
          },
          {
            type: "date",
            label: "تاريخ إنهاء الخدمة",
            model: "endingDutyDate"
          }
        ]
      },
      {
        title: "بيانات المجندين",
        id: "4",
        childs: [
          {
            type: "date",
            label: "تاريخ التجنيد",
            model: "conscriptionDate"
          },
          {
            type: "date",
            label: "تاريخ التسريح المبدئي",
            model: "demobilizationDate_withoutEffects",
            readonly: true
          },
          {
            type: "date",
            label: "تاريخ التسريح المقرر",
            model: "demobilizationDate",
            readonly: true
          },
          {
            type: "select",
            label: "السنة الزيادة",
            model: "additionalYearStateId"
          },
          {
            type: "select",
            label: "جهة الإمداد",
            model: "sourceId"
          },
          {
            type: "select",
            label: "التخفيض",
            model: "reductionStateId"
          },
          {
            type: "select",
            label: "المرحلة التجنيدية",
            model: "periodId",
            readonly: true
          },
          {
            type: "select",
            label: "محو الأمية",
            model: "ignorantId"
          },
          {
            type: "select",
            label: "مؤيد محو الأمية",
            model: "ignorantSupporterId"
          },
          {
            type: "number",
            label: "رقم الفيلم",
            model: "microfilmId"
          },
          {
            type: "number",
            label: "المسلسل",
            model: "microfilmSortIndex"
          }
        ]
      },
      {
        title: "بيانات ضباط الصف",
        id: "5",
        childs: [
          {
            type: "date",
            label: "تاريخ التطوع",
            model: "conscriptionDate"
          },
          {
            type: "number",
            label: "رقم الأقدمية",
            model: "oldNumber"
          },
          {
            type: "select",
            label: "التخصص",
            model: "specialization"
          },
          {
            type: "select",
            label: "كشف الأربعين",
            model: "checkup40"
          },
          {
            type: "date",
            label: "تاريخ صرف  ",
            model: "highSalaryPayingOutDate"
          },
          {
            type: "date",
            label: "تاريخ الترقي للدجة الحالة",
            model: "currentPromotionDate"
          },
          {
            type: "date",
            label: "تاريخ الضم على الوحدة",
            model: "currentUnitJoiningDate"
          },
          {
            type: "select",
            label: "المستوى الطبي",
            model: "medicalLevel"
          }
        ]
      }
    ],
    selects: {
      SoldierLevel: {
        text: "text",
        value: "text",
        data: constants.SoldierLevel.data
      },
      KnowledgeLevel: {
        text: "text",
        value: "text",
        data: constants.KnowledgeLevel.data
      },
      Religion: {
        text: "text",
        value: "text",
        data: constants.Religion.data
      },
      RecuTreat: {
        text: "text",
        value: "text",
        data: constants.RecuTreat.data
      },
      SoldierCategory: {
        text: "text",
        value: "text",
        data: constants.SoldierCategory.data
      },
      BloodType: {
        text: "text",
        value: "text",
        data: constants.BloodType.data
      },
      RecuRegion: {
        text: "text",
        value: "text",
        data: constants.RecuRegion.data
      },
      RecuStage: {
        text: "text",
        value: "text",
        data: constants.RecuStage.data
      },
      SoldierStatus: {
        text: "text",
        value: "text",
        data: constants.SoldierStatus.data
      },
      College: {
        text: "text",
        value: "text",
        data: constants.College.data
      },
      Direction: {
        text: "text",
        value: "text",
        data: constants.Direction.data
      },
      CityID: {
        table: "City",
        text: "City",
        value: "CityID"
      },
      CentreID: {
        table: "Centre",
        text: "Centre",
        value: "CentreID"
      },
      DutyID: {
        table: "Duty",
        text: "Duty",
        value: "DutyID"
      },
      periodId: {
        table: "periods",
        text: "periodText",
        value: "id"
      },
      microfilmId: {
        table: "microfilms",
        text: "microfilmId",
        value: "microfilmId"
      },
      ignorantId: {
        table: "ignorants",
        text: "displayedText",
        value: "id"
      },
      ignorantSupporterId: {
        value: "id",
        text: "displayedText",
        table: "ignorantSupporters"
      },

      groupId: {
        table: "groups",
        text: "groupName",
        value: "groupId"
      },
      stateIdCurrent: {
        table: "dutyCurrentStates",
        text: "text",
        value: "stateId"
      },
      sourceId: {
        table: "suplySources",
        text: "sourceName",
        value: "sourceId"
      },
      martialStateId: {
        table: "martialStates",
        text: "state",
        value: "martialStateId"
      },
      WeaponID: {
        table: "Weapon",
        text: "Weapon",
        value: "WeaponID"
      },
      reductionStateId: {
        table: "reductionStates",
        text: "state",
        value: "reductionStateId"
      },
      zoneId: {
        table: "zones",
        text: "zoneText",
        value: "zoneId"
      },
      additionalYearStateId: {
        table: "additionalYears",
        text: "state",
        value: "additionalYearStateId"
      },

      UnitID: {
        table: "Unit",
        value: "UnitID",
        text: "Unit"
        // attrs: ["zoneId"]
      },
      licenseId: {
        table: "licenses",
        value: "licenseId",
        text: "licenseType"
      }
    }
  }),
  methods: {
    // Emitations
    async removeMedCommittees(injury_id) {
      try {
        await this.api("global/delete_all", {
          table: "medicalCommittees",
          where: {
            injuryId: injury_id
          }
        });
      } catch (error) {
        this.showSuccess(
          "حدث خطأ اثناء حذف المجلس الطبي المرتبط بهذه الاصابه."
        );
        console.log(error);
      }
    },
    Edit() {
      this.goThere(
        `/add_conscripte/${this.conscripte.ID}/${this.conscripte.Type}`
      );
    },
    // TODO :
    async createMedCommittees(injury_id, caseType) {
      await this.api("global/create_one", {
        table: "medicalCommittees",
        where: {
          isFollowed: true,
          MilitaryId: this.conscripte.militaryId,
          medicalCommitteeTypeId: caseType,
          injuryId: injury_id
        }
      });
    },
    async addOrRemoveMedicalCommittee(obj = {}) {
      console.log("addOrRemoveMedicalCommittee : func()");
      console.log("caseType : ", obj.caseType);
      console.log("obj.MedCommitteInjuryId : ", obj.medCommitteInjuryId);

      if (obj.type == "remove") {
        console.log("remove medicalCommittees.");
        this.removeMedCommittees(obj.id);
      }

      if (obj.type == "add" && obj.reqMedicalCommitte) {
        console.log("create medicalCommittees.");
        console.log("look for medicalCommitteeTypeId : ", obj);
        this.createMedCommittees(obj.id, obj.caseType);
      }

      if (obj.type == "edite") {
        if (obj.reqMedicalCommitte && obj.medCommitteInjuryId == null) {
          this.createMedCommittees(obj.id, obj.caseType);
        } else if (!obj.reqMedicalCommitte && obj.medCommitteInjuryId) {
          this.removeMedCommittees(obj.id);
        }
      }
      this.$emit("force_reload_cons");
    },
    printConscripteProfile() {},
    runFun(fun) {
      if (fun && this[fun]) {
        this[fun]();
        return;
      }
      console.log(`Function ${fun} doesn't exist.`);
    },
    conLoaded() {
      return this.conscripte && this.conscripte.ID;
    },
    updateBasedOnMilitaryId() {
      let sections = this.sections,
        c = this.conscripte;

      if (c.militaryId.length == 13) {
        c.typeId = c.militaryId[5] == "3" ? 2 : 1; // مجند أو راتب عالي
        c.qualificationId =
          c.typeId == 2 ? c.qualificationId : Number(c.militaryId[5]); // المؤهل
        c.areaId = Number(c.militaryId[4]); // منطقة التجنيد
        c.forceId =
          Number(c.militaryId.substring(6, 8)) == 18
            ? 66
            : Number(c.militaryId.substring(6, 8));
        if (
          [52, 66, 18, 4, 88, 77].includes(c.forceId) ||
          (c.forceId == 10 && c.typeId !== 2)
        ) {
          c.sourceId = null;
        }
        let groupObject = {
          52: 1,
          66: 2,
          18: 2,
          4: 3,
          77: 1,
          88: 4
        };
        c.groupId =
          c.typeId !== 2 && groupObject[c.forceId]
            ? groupObject[c.forceId]
            : c.groupId;
        c.degreeId = c.forceId == 4 ? 3 : c.degreeId;
        this.changeFields(
          false,
          "4",
          ["sourceId"],
          "removed",
          [52, 66, 18, 4, 77, 88].includes(c.forceId) ||
            (c.forceId == 10 && c.typeId !== 2)
        );
        // Disable fields come from MilitaryId
        this.changeFields(false, "2", [], "readonly");
      }
    },
    updateBasedOnMaritalStates() {
      // 2. Disable wifes-sons-daughters counters if marital states is Single
      let c = this.conscripte;
      this.changeFields(
        false,
        "1",
        ["wifeCount", "sonsCount", "daughtersCount"],
        "removed",
        [1, 4].includes(c.martialStateId) || !c.martialStateId
      );
    },
    updateBasedOnQualificationId() {
      let sections = this.sections,
        c = this.conscripte,
        isNotIgnorant = c.typeId == 1 && c.qualificationId !== 0;
      // Disable ignorant fields
      c.ignorantId = isNotIgnorant ? null : c.ignorantId;
      c.ignorantSupporterId = isNotIgnorant ? null : c.ignorantSupporterId;
      this.changeFields(
        false,
        "4",
        ["ignorantId", "ignorantSupporterId"],
        "removed",
        isNotIgnorant
      );
    },
    updateBasedOnTypeId() {
      // 3. Remove sections based on conscripte.typeId
      let sections = this.sections,
        c = this.conscripte;
      sections.find(s => s.id == (c.typeId == 2 ? "4" : "5")).removed = true;
    },
    async updateBasedOnConscriptionDate() {
      // Change conscription period - تحديد المرحلة التجنيدية
      let c = this.conscripte,
        conscriptionDate = c.conscriptionDate;
      if (conscriptionDate && conscriptionDate.length > 0) {
        let year = new Date(conscriptionDate).getFullYear(),
          month = Number(new Date(conscriptionDate).getMonth() + 1),
          periodSortIndex = Math.ceil(month / 3),
          periodText = `${year}/${periodSortIndex}`;
        let exists = await this.api("global/get_one", {
          table: "periods",
          where: {
            periodText
          }
        });
        if (exists.ok) {
          c.periodId = exists.data.id;
        } else {
          let addPeriod = await this.api("global/create_one", {
            table: "periods",
            where: {
              periodText
            }
          });
          if (addPeriod.ok) {
            let getPeriod = await this.api("global/get_one", {
              table: "periods",
              where: {
                periodText
              }
            });
            if (getPeriod.ok) {
              c.periodId = getPeriod.data.id;
              this.init("periods");
            }
          }
        }
      }
    },
    updateBasedOnNotes() {
      let notes = this.conscripte.notes,
        notesDemobilization = this.conscripte.notesDemobilization;
      this.removeOrRedTab(
        "red",
        "notes",
        (notesDemobilization && notesDemobilization.length > 0) ||
          (notes && notes.length > 0)
      );
    },
    removeOrRedTab(action, tabId, condition, counter = 0) {
      if (
        tabId &&
        tabId.length > 0 &&
        action &&
        ["red", "removed"].includes(action)
      ) {
        this.windows.find(w => w.id == tabId)[action] = condition;
        if (counter && counter > 0) {
          this.windows.find(w => w.id == tabId).counter = counter;
        }
      }
    },
    changeFields(
      activate = false,
      sectionId = "",
      fieldIds = [],
      action = "readonly",
      condition = true
    ) {
      if (sectionId && sectionId.length > 0) {
        let sections = this.sections;
        sections
          .find(s => s.id == sectionId)
          .childs.filter(
            ch => fieldIds.length == 0 || fieldIds.includes(ch.model)
          )
          .forEach(field => {
            if (activate) {
              field.readonly = false;
              field.disabled = false;
            } else {
              field[action] = condition;
            }
          });
      }
    },
    saveEverything() {
      this.$set(this, "local_loading", true);
      let date_keys = Object.keys(this.conscripte)
          .map(k => (k.includes("Date") ? k : "NOT_A_DATE"))
          .filter(k => k !== "NOT_A_DATE"),
        other_date_keys = [],
        conscripte = { ...this.conscripte },
        fix = this.originalDates(
          [conscripte],
          [...date_keys, ...other_date_keys],
          true
        )[0];
      delete fix.image;
      console.log(fix);
      this.api("global/update_one", {
        table: "conscriptes",
        where: {
          militaryId: fix.militaryId
        },
        update: fix
      })
        .then(async x => {
          console.log(x);
          this.showSuccess("تم تحديث البيانات.");
        })
        .catch(error => {
          console.log(error);
          this.showError("حدث خطأ أثناء تحديث البيانات.");
        })
        .finally(() => {
          this.$set(this, "local_loading", false);
        });
    },
    init(specificTable = "") {
      // Get selects
      Object.keys(this.selects).forEach(key => {
        let { table, localTable, attrs } = this.selects[key];
        if (table) {
          let obj = {
            table
          };
          if (attrs && attrs.length > 0) {
            obj.attrs = attrs;
          }
          this.$set(this.selects[key], "loading", true);
          this.api("global/get_all", obj)
            .then(x => {
              this.$set(
                this.selects[key],
                "data",
                x.data.sort(
                  (a, b) =>
                    a[this.selects[key].value] - b[this.selects[key].value]
                )
              );
            })
            .catch(error => {
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
          this.$set(
            this.selects[key],
            "data",
            data.sort(
              (a, b) => a[this.selects[key].value] - b[this.selects[key].value]
            )
          );
          this.$set(this.selects[key], "loading", false);
        }
      });
    }
  }
};
</script>
