<template>
  <div tabindex="0" class="no-focus profile">
    <template v-for="(group, i) in groups">
      <v-card
        v-if="filterItemsForType(group.items).length > 0"
        class="mb-8"
        :key="i"
      >
        <v-card-title
          class="primary white--text"
          v-text="group.title"
        ></v-card-title>
        <v-card-subtitle v-text="group.desc"></v-card-subtitle>
        <v-divider></v-divider>
        <v-card-text>
          <v-row>
            <template v-for="(item, ii) in filterItemsForType(group.items)">
              <v-col
                v-if="(isEnhaa && item.forEnhaa) || !isEnhaa"
                :key="ii"
                cols="6"
                lg="4"
                xl="3"
              >
                <v-text-field
                  v-model="conscripte[item.model]"
                  :label="item.label"
                  filled
                  v-if="item.type == 'text'"
                  disabled
                  outlined
                ></v-text-field>

                <v-card v-if="item.type == 'image'">
                  <v-card-title class="text-h6">
                    {{ item.label }}
                  </v-card-title>
                  <v-img
                    :lazy-src="conscripte[item.model]"
                    max-height="300"
                    contain
                    max-width="250"
                    :src="conscripte[item.model]"
                  ></v-img>
                </v-card>
              </v-col>
            </template>
          </v-row>
        </v-card-text>
      </v-card>
    </template>
    <v-dialog persistent scrollable max-width="200" v-model="loading">
      <v-card height="150">
        <v-layout align-center align-content-center justify-center fill-height>
          <div>
            <div>
              <v-progress-circular
                indeterminate
                color="primary"
                size="65"
              ></v-progress-circular>
            </div>
            <div class="mt-6">
              جارِ التحميل
            </div>
          </div>
        </v-layout>
      </v-card>
    </v-dialog>
  </div>
</template>

<style>
.profile .v-input__slot {
  background: none !important;
}
.profile .v-label {
  color: #000 !important;
  font-size: 16px !important;
}
.profile
  .theme--light.v-text-field--outlined:not(.v-input--is-focused).v-input--is-disabled
  > .v-input__control
  > .v-input__slot
  fieldset {
  color: var(--v-primary-base) !important;
}

.theme--light.v-input input,
.theme--light.v-input textarea {
  color: rgba(0, 0, 0, 0.87) !important ;
}

.profile .v-sheet.v-card:not(.v-sheet--outlined) {
  box-shadow: none;
}
</style>
<script>
const constants = require("../../Constant").default;
const _ = require("lodash");
export default {
  name: "new-profile",
  props: {
    conscripteObJ: {
      type: Object,
      default: () => {}
    }
  },
  mounted() {
    this.conscripte = {
      ...this.conscripteObJ,
      weapon: (this.conscripteObJ.Weapon || {}).Weapon,
      Markez_Tadreb: (this.conscripteObJ.Weapon || {}).Markez_Tadreb,
      unit: (this.conscripteObJ.Unit || {}).Unit,
      duty: (this.conscripteObJ.Duty || {}).Duty,
      centre: (this.conscripteObJ.Centre || {}).Centre,
      city: (this.conscripteObJ.City || {}).City
    };
  },
  data: () => ({
    findingConscripte: false,
    conscripte: {
      conscriptionDate: null,
      unitID: null
    },
    isEnhaa: false,
    groups: [
      {
        title: "بيانات تجنيدية",
        desc: "",
        forEnhaa: true,
        items: [
          {
            model: "ID",
            label: "الرقم العسكري",
            type: "text",
            readonly: true
          },
          {
            model: "Name",
            label: "الإسم الكامل",
            type: "text",
            readonly: true
          },
          {
            model: "TripleNo",
            label: "الرقم الثلاثي",
            type: "text",
            readonly: true
          },
          {
            model: "Type",
            label: "توع المجند",
            type: "text"
          },

          {
            model: "IndexNo",
            label: "رقم السجل ",
            type: "text",
            readonly: true
          },
          {
            model: "SoldierLevel",
            label: "الدرجة",
            type: "text",
            readonly: true
          },
          {
            model: "SoldierStatus",
            label: "حالة الفرد",
            type: "text",
            readonly: true
          },
          {
            model: "EndingCause",
            label: "سبب الإنهاء",
            type: "text",
            readonly: true
          },
          {
            model: "KnowledgeLevel",
            label: "المؤهل",
            type: "text",
            readonly: true
          },

          {
            model: "SoldierCategory",
            label: "الفئة",
            type: "text",
            readonly: true
          },
          {
            model: "RecuTreat",
            label: "المعاملة التجنيدية",
            type: "text",
            readonly: true
          },
          {
            model: "MissingTime",
            label: "مدة الفاقدة",
            type: "text",
            readonly: true
          },

          {
            model: "RecuStage",
            label: "المرحلة التجنيدية",
            type: "text",
            readonly: true
          },
          {
            model: "Direction",
            label: " الاتجاه",
            type: "text",
            readonly: true
          }
        ]
      },
      {
        title: "مكان الخدمة",
        desc: "",
        items: [
          {
            model: "weapon",
            label: "السلاح",
            type: "text",
            readonly: true
          },
          {
            model: "unit",
            label: "الوحدة",
            type: "text",
            readonly: true
          },

          {
            model: "Markez_Tadreb",
            label: " مركز التدريب",
            type: "text",
            readonly: true
          },
          {
            model: "duty",
            label: " الواجب المدرب عليه",
            type: "text",
            readonly: true
          },

          {
            model: "ArrivalDate",
            label: " تاريخ الوصول لمركز التدريب",
            type: "text",
            readonly: true
          }
        ]
      },
      {
        title: "بيانات شخصية",
        desc: "",
        items: [
          {
            model: "BirthDate",
            label: "تاريخ الميلاد",
            type: "text",
            readonly: true
          },
          {
            model: "IdentityNo",
            label: "الرقم القومي",
            type: "text",
            readonly: true
          },
          {
            model: "SoldierTELE",
            label: "رقم التليفون",
            type: "text",
            readonly: true
          },
          {
            model: "RelevantTELE",
            label: "رقم تلفون الاقارب",
            type: "text",
            readonly: true
          },
          {
            model: "Address",
            label: "العنوان المدني",
            type: "text",
            readonly: true
          },
          {
            model: "Job",
            label: "المهنة ",
            type: "text",
            readonly: true
          },
          {
            model: "city",
            label: "المحافظة",
            type: "text",
            counter: 11
          },
          {
            model: "centre",
            label: "المركز",
            type: "text",
            counter: 11,
            readonly: true
          },

          {
            model: "Religion",
            label: "الديانة",
            type: "text",
            counter: 11,
            readonly: true
          },
          {
            model: "BloodType",
            label: "فصيلة الدم",
            type: "text",
            counter: 11,
            readonly: true
          },
          {
            model: "College",
            label: "الكلية ",
            type: "text",
            counter: 11,
            readonly: true
          },
          {
            model: "Specialization",
            label: "التخصص ",
            type: "text",
            readonly: true
          },
          {
            model: "image",
            label: "الصورة الشخصية",
            type: "image"
          }
        ]
      },
      {
        title: "بيانات الخدمة",
        desc: "",
        forEnhaa: true,
        items: [
          {
            model: "RecuStartDate",
            label: "تاريخ التجنيد",
            type: "text",
            readonly: true
          },
          {
            model: "RecuEndDate",
            label: "تاريخ التسريح",
            type: "text",
            readonly: true
          },
          {
            model: "RecuRegion",
            label: "منطقة التجنيد",
            type: "text",
            counter: 11
          },
          {
            model: "Notes",
            label: "ملاحظات عامة",
            type: "text",
            forEnhaa: true
          }
        ]
      },
      {
        title: "الإدارات التخصصية",
        desc: "",
        forEnhaa: true,
        items: [
          {
            model: "Treatment",
            label: "المعاملة",
            type: "text"
          },
          {
            model: "DriverLevel",
            label: "درجة الرخصة",
            type: "text"
          },
          {
            model: "ServiceType",
            label: "نوع الخدمة",
            type: "text"
          }
        ]
      },
      {
        title: "بيانات الراتب العالي",
        desc: "",
        items: [
          { model: "FileNo", label: "رقم الملف", type: "text" },
          { model: "RatebCategory", label: "الفئة", type: "text" },
          { model: "RatebLevel", label: "الدرجة", type: "text" },
          { model: "Directionforunit", label: "الاتجاة", type: "text" },
          { model: "RatebState", label: "الحالة", type: "text" },
          { model: "ServiceStyle", label: "نوع الخدمة", type: "text" },
          {
            model: "SatrtingSarefRateb",
            label: "تاريح صرف الراتب",
            type: "text"
          },
          { model: "VolunteeringDate", label: "تاريخ التطوع", type: "text" },
          { model: "OlderindNo", label: "رقم الاقدمية", type: "text" },
          { model: "Qualification", label: "المؤهل", type: "text" },
          { model: "Namat", label: "النمط", type: "text" },
          { model: "Dof3aNum", label: "رقم الدفعة", type: "text" },
          { model: "JobBefore", label: "الوظيفة", type: "text" },
          { model: "UnitJob", label: "العمل في الوحدة", type: "text" },
          { model: "MartialStatus", label: "الحالة الاجتماعية", type: "text" },
          { model: "NumOfChilds", label: "عدد الاطفال", type: "text" },
          {
            model: "UnitJoinDate",
            label: "تاريخ الالتحاق بالوحدة",
            type: "text"
          },
          { model: "RatebCategoryFari", label: "الفئة الفرعية", type: "text" }
        ]
      }
    ],

    loading: false
  }),
  watch: {},
  methods: {
    async calculateDemobilizationDate(isExists = false) {
      let {
        conscriptionDate,
        knowLedgeLevel,
        additionalYearStateId,
        forceId,
        militaryId
      } = this.conscripte;

      // علشان ميطلعش
      // error لمكتب الانهاء
      if (this.$store.state.currentUser.section == 3) {
        return;
      }

      if (
        !conscriptionDate ||
        (!knowLedgeLevel && knowLedgeLevel !== 0) ||
        (!additionalYearStateId && additionalYearStateId !== 0) ||
        (!forceId && forceId !== 0)
      ) {
        this.showError(
          "يجب تسجيل تاريخ التجنيد والمؤهل وبيان السنة الزيادة والسلاح لحساب تاريخ التسريح. في حال إذا كان ينقصك واحد أو أكثر منها, قم بتسجيله من فضلك"
        );
        return false;
      }
      let cdate = new Date(conscriptionDate),
        // 2020-01-15
        requiredMonths = {
          0: 35,
          7: 11,
          2: 11,
          8: 17,
          1: 23
        },
        hasAdditionalYear = additionalYearStateId == 4,
        period = requiredMonths[knowLedgeLevel],
        demobilizationDate = new Date(
          cdate.setMonth(new Date(conscriptionDate).getMonth() + period)
        );
      demobilizationDate = new Date(
        demobilizationDate.setMonth(demobilizationDate.getMonth() + 2)
      );
      demobilizationDate = this.getClosestDof3a(
        demobilizationDate,
        hasAdditionalYear
      );
      let { points } = isExists
        ? await this.fixDemobilizationDate(militaryId)
        : {};
      this.$set(
        this.conscripte,
        "demobilizationDate",
        isExists ? this.fixDate(points.demobilizationDate) : demobilizationDate
      );
      this.$set(
        this.conscripte,
        "demobilizationDateStarter",
        isExists
          ? this.fixDate(points.demobilizationDateStarter)
          : demobilizationDate
      );
      this.$set(
        this.conscripte,
        "endingDutyDate",
        isExists ? this.fixDate(points.endingDutyDate) : demobilizationDate
      );
      return true;
    },
    getClosestDof3a(date = new Date(), hasAdditionalYear = false) {
      let { year, month, day } = {
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          day: date.getDate()
        },
        mainDof3as = [3, 6, 9, 12],
        // secondaryDof3as = [2, 5, 8, 11],
        // dof3asToUse = hasAdditionalYear ? secondaryDof3as : mainDof3as;
        dof3asToUse = mainDof3as;
      if (dof3asToUse.includes(month) && day == 1) {
        return this.fixDate(date);
      }
      dof3asToUse.push(month);
      dof3asToUse.sort((a, b) => a - b);
      let index = dof3asToUse.indexOf(month) + 1,
        requiredIndex = index == dof3asToUse.length ? 0 : index,
        requiredMonth = dof3asToUse[requiredIndex],
        finalDate = new Date(
          `${requiredIndex == 0 ? year + 1 : year}-${
            hasAdditionalYear ? requiredMonth + 2 : requiredMonth
          }-1`
        );
      return this.fixDate(finalDate);
    },
    async findConscripte() {
      let { ID } = this.conscripte,
        forceCode = ID.substr(6, 2),
        areaCode = ID.substr(4, 1),
        qualificationCode = ID.substr(5, 1),
        groupItems = this.groups.map(g => g.items),
        models = [];
      groupItems.forEach(gitems => {
        let item_models = gitems.map(g => g.model);
        models = [...models, ...item_models];
      });
      if (!ID || ID.length == 0) {
        return;
      }
      this.$set(this, "findingConscripte", true);
      let conscripte = await this.api("global/get_one", {
        table: "Soldier",
        where: {
          ID
        }
      });
      if (
        conscripte &&
        conscripte.ok &&
        conscripte.data &&
        conscripte.data.ID
      ) {
        let data = this.fixDates(
          [conscripte.data],
          [
            "conscriptionDate",
            "demobilizationDate",
            "endingDutyDate",
            "demobilizationDateStarter",
            "birthDate"
          ]
        )[0];
        models.forEach(model => {
          this.$set(this.conscripte, model, data[model]);
        });
      }
    },
    filterItemsForType(items) {
      let ratebCoulmns = [
        "FileNo",
        "RatebCategory",
        "RatebLevel",
        "Directionforunit",
        "RatebState",
        "ServiceStyle",
        "SatrtingSarefRateb",
        "VolunteeringDate",
        "OlderindNo",
        "Qualification",
        "Namat",
        "Taskeen",
        "TahtElTawze3",
        "Dof3aNum",
        "JobBefore",
        "UnitJob",
        "MartialStatus",
        "NumOfChilds",
        "UnitJoinDate",
        "RatebCategoryFari"
      ];

      let soliderCoulmns = [
        "IndexNo",
        "SoldierCategory",
        "SoldierLevel",
        "RecuRegion",
        "RecuStartDate",
        "RecuStage",
        "RecuTreat",
        "MissingTime",
        "RecuEndDate",
        "SoldierStatus",
        "EndingCause",
        "College",
        "Specialization",
        "Job",
        "Direction",
        "Directionforunit",
        "ArrivalDate",
        "Alhaq",
        "TahtEltawze3",
        "BrotherID",
        "ServiceType",
        "GHA",
        "DriverLevel",
        "Treatment",
        "Markez_Tadreb"
      ];
      return this.conscripte.Type == constants.serviceTypesMap.solider
        ? items.filter(ele => ratebCoulmns.indexOf(ele.model) == -1)
        : items.filter(ele => soliderCoulmns.indexOf(ele.model) == -1);
    }
  }
};
</script>
