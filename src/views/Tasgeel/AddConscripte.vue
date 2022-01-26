<template>
  <div
    @keydown.f12="addConscripte"
    @keydown.insert="emptyFields()"
    tabindex="0"
    class="no-focus"
  >
    <template v-for="(group, i) in groups">
      <v-card
        v-if="(isEnhaa && group.forEnhaa) || !isEnhaa"
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
            <template v-for="(item, ii) in group.items">
              <v-col
                v-if="(isEnhaa && item.forEnhaa) || !isEnhaa"
                :key="ii"
                cols="6"
                lg="4"
                xl="3"
              >
                <v-text-field
                  v-model="conscripte[item.model]"
                  v-if="!item.type || ['text', 'date'].includes(item.type)"
                  :type="item.type == 'date' ? 'date' : 'text'"
                  :label="item.label"
                  :hide-details="!item.hint && !item.counter"
                  :persistent-hint="item.hint || item.counter ? true : false"
                  :counter="item.counter"
                  filled
                  :clearable="isAdmin()"
                  :loading="
                    item.model == 'militaryId' && findingConscripte
                      ? true
                      : false
                  "
                  @keyup.enter="
                    item.model == 'ID' ? findConscripte() : () => {}
                  "
                  @keydown.tab="
                    item.model == 'militaryId'
                      ? findConscripte()
                      : item.model == 'conscriptionDate'
                      ? calculateDemobilizationDate()
                      : () => {}
                  "
                  :readonly="item.readonly"
                ></v-text-field>
                <v-textarea
                  v-model="conscripte[item.model]"
                  v-else-if="item.type == 'textarea'"
                  :label="item.label"
                  :hide-details="!item.hint && !item.counter"
                  :persistent-hint="item.hint || item.counter ? true : false"
                  :counter="item.counter"
                  :clearable="isAdmin()"
                  filled
                  :readonly="item.readonly"
                ></v-textarea>
                <v-autocomplete
                  v-model="conscripte[item.model]"
                  :clearable="isAdmin()"
                  :loading="
                    selects &&
                    selects[item.model] &&
                    selects[item.model].loading
                      ? selects[item.model].loading
                      : false
                  "
                  :readonly="item.readonly"
                  v-else-if="item.type == 'select'"
                  :label="item.label"
                  :hide-details="!item.hint && !item.counter"
                  :persistent-hint="item.hint || item.counter ? true : false"
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
                  filled
                  :error-messages="
                    selects && selects[item.model] && selects[item.model].error
                      ? selects[item.model].error
                      : ''
                  "
                ></v-autocomplete>
                <v-combobox
                  v-model="conscripte[item.model]"
                  :error-messages="
                    selects && selects[item.model] && selects[item.model].error
                      ? selects[item.model].error
                      : ''
                  "
                  :clearable="isAdmin()"
                  :loading="
                    selects &&
                    selects[item.model] &&
                    selects[item.model].loading
                      ? selects[item.model].loading
                      : false
                  "
                  :readonly="item.readonly"
                  v-else-if="item.type == 'combobox'"
                  :label="item.label"
                  :hide-details="!item.hint && !item.counter"
                  :persistent-hint="item.hint || item.counter ? true : false"
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
                  filled
                ></v-combobox>
              </v-col>
            </template>
          </v-row>
        </v-card-text>
      </v-card>
    </template>
    <v-btn
      style="position: fixed; top: 10px; left: 400px; z-index: 999"
      class="px-4"
      large
      color="primary"
      @click="addConscripte()"
    >
      <v-icon class="me-3">mdi-plus</v-icon>
      حفظ الفرد
    </v-btn>
    <v-btn
      style="position: fixed; top: 10px; left: 560px; z-index: 999"
      class="px-4"
      large
      outlined
      color="primary"
      @click="emptyFields()"
    >
      جديد
    </v-btn>
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

<script>
const constants = require("../../Constant").default;
const lodash = require("lodash");

export default {
  name: "add_conscripte",
  computed: {
    params() {
      console.log(this.$store.state.routes);
      let index = this.$store.state.routes.findIndex(
          v => v.name == "add_conscripte"
        ),
        params = {};
      if (index !== -1) {
        params = this.$store.state.routes[index].params;
      }
      return params;
    }
  },
  mounted() {
    this.init();
    if (this.params.id) {
      this.conscripte.ID = this.params.id;
      this.findConscripte();
    }
  },
  data: () => ({
    findingConscripte: false,
    conscripte: {},

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
            counter: 13,
            forEnhaa: true
          },
          {
            model: "Name",
            label: "الإسم الكامل",
            type: "text",
            forEnhaa: true
          },
          {
            model: "TripleNo",
            label: "الرقم الثلاثي",
            type: "text"
          },
          {
            model: "IndexNo",
            label: "رقم السجل ",
            type: "text"
          },
          {
            model: "SoldierLevel",
            label: "الدرجة",
            type: "select"
          },
          {
            model: "SoldierStatus",
            label: "حالة الفرد",
            type: "select",
            forEnhaa: true
          },
          {
            model: "EndingCause",
            label: "سبب الإنهاء",
            type: "text"
          },
          {
            model: "KnowledgeLevel",
            label: "المؤهل",
            type: "select"
          },

          {
            model: "SoldierCategory",
            label: "الفئة",
            type: "select"
          },
          {
            model: "RecuTreat",
            label: "المعاملة التجنيدية",
            type: "select"
          },
          {
            model: "MissingTime",
            label: "مدة الفاقدة",
            type: "text"
          },
          // {
          //   model: "reductionStateId",
          //   label: "قرار التخفيض",
          //   type: "select"
          // },
          {
            model: "RecuStage",
            label: "المرحلة التجنيدية",
            type: "select"
          },
          // {
          //   model: "periodId",
          //   label: "الحاق",
          //   type: "select"
          // },

          {
            model: "Direction",
            label: " الاتجاه",
            type: "select"
          }
        ]
      },
      {
        title: "مكان الخدمة",
        desc: "",
        items: [
          {
            model: "WeaponID",
            label: "السلاح",
            type: "select"
          },
          {
            model: "UnitID",
            label: "الوحدة",
            type: "select"
          },

          {
            model: "Markez_Tadreb",
            label: " مركز التدريب",
            type: "text",
            readonly: true
          },
          {
            model: "DutyID",
            label: " الواجب المدرب عليه",
            type: "select"
          },
          {
            model: "",
            label: " التشكيل",
            type: "text",
            readonly: true
          },
          {
            model: "",
            label: "التسكين",
            type: "text",
            readonly: true
          },
          {
            model: "SourceId",
            label: "جهة الإمداد",
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
            type: "date"
          },
          {
            model: "IdentityNo",
            label: "الرقم القومي",
            type: "text",
            counter: 14
          },
          {
            model: "SoldierTELE",
            label: "رقم التليفون",
            type: "text",
            counter: 11,
            forEnhaa: true
          },
          {
            model: "RelevantTELE",
            label: "رقم تلفون الاقارب",
            type: "text",
            counter: 11
          },
          {
            model: "Address",
            label: "العنوان المدني",
            type: "text"
          },
          {
            model: "Job",
            label: "المهنة ",
            type: "text"
          },
          {
            model: "CityID",
            label: "المحافظة",
            type: "select"
          },
          {
            model: "CentreID",
            label: "المركز",
            type: "select"
          },
          {
            model: "Religion",
            label: "الديانة",
            type: "select"
          },
          {
            model: "BloodType",
            label: "فصيلة الدم",
            type: "select"
          },
          {
            model: "College",
            label: "الكلية ",
            type: "select"
          },
          {
            model: "Specialization",
            label: "التخصص ",
            type: "text"
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
            type: "date",
            forEnhaa: true
          },
          {
            model: "RecuEndDate",
            label: "تاريخ التسريح",
            type: "date"
          },
          {
            model: "ArrivalDate",
            label: " تاريخ الوصول لمركز التدريب",
            type: "date"
          },
          {
            model: "RecuRegion",
            label: "منطقة التجنيد",
            type: "select"
          },
          {
            model: "Notes",
            label: "ملاحظات عامة",
            type: "textarea",
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
            type: "select"
          },
          {
            model: "DriverLevel",
            label: "درجة الرخصة",
            type: "select"
          },
          {
            model: "ServiceType",
            label: "نوع الخدمة",
            type: "text"
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
      DriverLevel: {
        text: "text",
        value: "text",
        data: constants.DriverLevel.data
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
        data: lodash.flattenDeep(
          constants.years.map(year =>
            constants.RecuStage.data.map(stage => `${stage.text}-${year}`)
          )
        )
      },
      Treatment: {
        text: "text",
        value: "text",
        data: constants.Treatment.data
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
      WeaponID: {
        table: "Weapon",
        text: "Weapon",
        value: "WeaponID"
      },
      UnitID: {
        table: "Unit",
        value: "UnitID",
        text: "Unit"
      }
    },
    loading: false
  }),
  watch: {
    "conscripte.WeaponID"(v) {
      console.log(v);
      this.$set(
        this.conscripte,
        "Markez_Tadreb",
        this.selects.WeaponID.data.find(ele => ele.WeaponID == v).Markez_Tadreb
      );
    }
  },
  methods: {
    emptyFields(exeptId = false) {
      this.$set(this, "conscripte", {
        conscriptionDate: null,
        unitID: null,
        militaryId: exeptId ? this.conscripte.militaryId : null
      });
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
    async addConscripte() {
      this.$set(this, "loading", true);
      let conscripte = { ...this.conscripte };
      Object.keys(conscripte).forEach(key => {
        let val = conscripte[key];
        if (val == undefined) {
          conscripte[key] = null;
        }
      });

      if (![0, 12, 1, 3].includes(this.$store.state.currentUser.section)) {
        this.showError(
          "عفواً, ليس لديك صلاحية التعديل. هذه خاصة بقسم التسجيل."
        );

        this.$set(this, "loading", false);
        return;
      }
      if (!conscripte.ID) {
        this.showError("من فضلك قم بتسجيل الرقم العسكري");
        this.$set(this, "loading", false);
        return;
      }
      if (!conscripte.Name || conscripte.Name.trim().length == 0) {
        this.showError("من فضلك قم بتسجيل اسم الفرد");
        this.$set(this, "loading", false);
        return;
      }
      if (!conscripte.RecuStartDate) {
        this.showError("من فضلك قم بتسجيل تاريخ التجنيد");
        this.$set(this, "loading", false);
        return;
      }
      // /////
      // if (conscripte.soldierLevel == 2) {
      //   // جندي
      //   conscripte.typeId = 1;
      // } else {
      //   // راتب عالي
      //   conscripte.typeId = 2;
      // }

      let isExists = false,
        exists = await this.api("global/get_one", {
          table: "Soldier",
          where: {
            ID: conscripte.ID
          },
          attrs: ["ID"]
        });
      if (exists && exists.ok && exists.data && exists.data.ID) {
        isExists = true;
      }
      if (isExists) {
        let addCon = await this.api("global/update_one", {
          table: "Soldier",
          where: {
            ID: conscripte.ID
          },
          update: conscripte
        });
        if (addCon && addCon.ok) {
          this.showSuccess("تم تحديث الفرد بنجاح");
        } else {
          this.showError("تعذر تحديث الفرد في قاعدة البيانات");
        }
        this.$set(this, "loading", false);
        return;
      }
      console.log(conscripte);
      let addCon = await this.api("global/create_one", {
        table: "Soldier",
        where: conscripte
      });
      if (addCon && addCon.ok) {
        this.showSuccess("تم إضافة الفرد بنجاح");
      } else {
        this.showError("تعذر إضافة الفرد في قاعدة البيانات");
      }
      this.$set(this, "loading", false);
    }
  }
};
</script>
