<template>
  <div
    @keydown.f12="addConscripte"
    @keydown.insert="emptyFields()"
    tabindex="0"
    class="no-focus"
  >
    <template v-for="(group, i) in groups">
      <v-card class="mb-8" :key="i">
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

                <v-file-input
                  v-model="conscripte[item.model]"
                  v-if="item.type == 'file'"
                  :label="item.label"
                  accept="image/png, image/jpeg, image/bmp, image/jpg"
                  prepend-icon="mdi-camera"
                  show-size
                  truncate-length="14"
                ></v-file-input>
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
      this.conscripte.Type = this.params.type;
      this.findConscripte();
    }
  },
  data: () => ({
    findingConscripte: false,
    conscripte: {
      Type: constants.serviceTypesMap.solider
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
            counter: 13
          },
          {
            model: "Name",
            label: "الإسم الكامل",
            type: "text"
          },
          {
            model: "TripleNo",
            label: "الرقم الثلاثي",
            type: "text"
          },
          {
            model: "KnowledgeLevel",
            label: "المؤهل",
            type: "select"
          },
          {
            model: "RecuStage",
            label: "المرحلة التجنيدية",
            type: "select"
          },
          {
            model: "RecuRegion",
            label: "مكان التجنيد",
            type: "select"
          },
          {
            model: "IdentityNo",
            label: " الرقم القومي",
            type: "text"
          },
          {
            model: "BirthDate",
            label: " تاريخ الميلاد",
            type: "date"
          },
          {
            model: "ArrivalDate",
            label: "تاريخ الوصول",
            type: "date"
          },
          {
            model: "TestDate",
            label: " تاريخ الاختبار",
            type: "date"
          },
          {
            model: "Centre",
            label: " المركز ",
            type: "select"
          },
          {
            model: "Religion",
            label: "الديانة",
            type: "select"
          },
          {
            model: "Unit",
            label: "الوحدة",
            type: "select"
          },
          {
            model: "VideoPath",
            label: "فيديو المقابلة",
            type: "file"
          },
          {
            model: "Brigade",
            label: "السرية",
            type: "text"
          }
        ]
      },
      {
        title: "بيانات المقابلة",
        desc: "",
        forEnhaa: true,
        items: [
          { model: "Job", label: "الوظيفة قبل التجنيد", type: "text" },
          { model: "FatherJob", label: "وظيفة الاب", type: "text" },
          { model: "Tele", label: "رقم التلفون", type: "text" },
          { model: "BrothersCount", label: "عدد الاشقاء", type: "text" },
          {
            model: "RelationshipType",
            label: "العلاقة مع العائلة",
            type: "text"
          },
          { model: "Note", label: "شكوي الجندي", type: "text" },
          { model: "Apprance", label: "المظهر", type: "select" },
          { model: "FocusEvent", label: "درجة التركيز", type: "select" },
          { model: "Mood", label: "الحالة المزاجية", type: "select" },
          { model: "Talking", label: "اضطرابات الكلام", type: "select" },
          { model: "Drugs", label: "تعاطي ادوية", type: "select" },
          {
            model: "GoHospitalBefore",
            label: "ذهب لمستشفي او عيادة",
            type: "select"
          },
          { model: "HospitalName", label: "اسم المستشفي", type: "text" },
          {
            model: "TakeDrugsBefore",
            label: "له خبرة بتعاطي ادوية",
            type: "select"
          },
          { model: "DrugName", label: "اسم الدواء", type: "text" },
          { model: "MeetingMaker", label: "القائم بالمقابلة", type: "text" },
          { model: "MeetingDescions", label: "راي المقابلة", type: "text" }
        ]
      }
    ],
    selects: {
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
      Centre: {
        table: "Centre",
        text: "Centre",
        value: "Centre"
      },
      Unit: {
        table: "Unit",
        text: "Unit",
        value: "Unit"
      },
      GoHospitalBefore: {
        text: "text",
        value: "text",
        data: ["نعم", "لا"]
      },
      TakeDrugsBefore: {
        text: "text",
        value: "text",
        data: ["نعم", "لا"]
      },
      Apprance: {
        text: "text",
        value: "text",
        data: constants.meetingStatus
      },
      FocusEvent: {
        text: "text",
        value: "text",
        data: constants.meetingStatus
      },
      Mood: {
        text: "text",
        value: "text",
        data: constants.meetingStatus
      },
      Talking: {
        text: "text",
        value: "text",
        data: constants.meetingStatus
      },
      Drugs: {
        text: "text",
        value: "text",
        data: constants.meetingStatus
      }
    },
    loading: false
  }),
  watch: {
    "conscripte.IdentityNo"(v) {
      if (v.length == 14) {
        this.$set(this.conscripte, "BirthDate", this.nationalIdToDate(v));
      }
    },
    "conscripte.TripleNo"(v) {
      let splittedValue = v.split("-");
      if (v.split("-").length == 3) {
        this.$set(
          this.conscripte,
          "Centre",
          this.selects.Centre.data.find(ele => ele.CentreID == splittedValue[1])
            .Centre
        );
      }
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
        type = this.conscripte.Type,
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
        data.DutyID = parseInt(data.DutyID);
        models.forEach(model => {
          this.$set(this.conscripte, model, data[model]);
        });
        this.conscripte.Type = type;
      }
    },

    toBase64: file =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      }),
    async addConscripte() {
      this.$set(this, "loading", true);
      let conscripte = { ...this.conscripte };
      Object.keys(conscripte).forEach(key => {
        let val = conscripte[key];
        if (val == undefined) {
          conscripte[key] = null;
        }
      });

      if (conscripte.VideoPath) {
        conscripte.VideoPath = await conscripte.VideoPath.path;
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
      let addCon = await this.api("global/create_one", {
        table: "Soldier",
        where: conscripte
      });
      if (addCon && addCon.ok) {
        this.showSuccess("تم إضافة الفرد بنجاح");
      } else {
        this.showError("تعذر إضافة الفرد في قاعدة البيانات");
      }
      this.emptyFields();
      this.$set(this, "loading", false);
    }
  }
};
</script>
