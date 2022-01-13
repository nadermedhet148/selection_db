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
export default {
  name: "add-conscripte",
  mounted() {
    this.init();
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
            model: "",
            label: " التشكيل",
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
            model: "DutyID",
            label: " الواجب المدرب عليه",
            type: "select"
          },
          {
            model: "",
            label: "التسكين",
            type: "text",
            readonly: true
          },

          {
            model: "ArrivalDate",
            label: " تاريخ الوصول لمركز التدريب",
            type: "date"
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
            model: "NationalId",
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
      }
    ],
    selects: {
      SoldierLevel: {
        text: "text",
        value: "text",
        data: [...["جندي", "عريف", "رقيب", "رقيب اول ", "مساعد ", "مساعد اول"]]
      },
      KnowledgeLevel: {
        text: "text",
        value: "text",
        data: [
          ...["عليا", "فوق متوسطة", "متوسطة", "عادة"].map(text => ({ text }))
        ]
      },
      Religion: {
        text: "text",
        value: "text",
        data: [...["اخري", "مسيحي", "مسلم"].map(text => ({ text }))]
      },
      RecuTreat: {
        text: "text",
        value: "text",
        data: [
          ...["بدون", "سنة قابلة للرفع", "سنة غير قابلة للرفعس"].map(text => ({
            text
          }))
        ]
      },
      SoldierCategory: {
        text: "text",
        value: "text",
        data: [
          ...[
            "صف",
            "كاتب عسكري",
            "كاتب مالي",
            "سائق عجل",
            "مهني ",
            "حرفي"
          ].map(text => ({ text }))
        ]
      },
      BloodType: {
        text: "text",
        value: "text",
        data: [
          ...[
            "A",
            "A+",
            "A-",
            "B",
            "B+",
            "B-",
            "O",
            "O+",
            "O-",
            "AB",
            "AB+",
            "AB-"
          ].map(text => ({ text }))
        ]
      },
      RecuRegion: {
        text: "text",
        value: "text",
        data: [
          ...[
            "القاهرة",
            "الجيزة",
            "الأسكندرية",
            "الزقازيق",
            "أسيوط",
            "طنطا",
            "قنا",
            "المنصورة",
            "المنيا"
          ].map(text => ({ text }))
        ]
      },
      RecuStage: {
        text: "text",
        value: "text",
        data: [
          ...["الاولي", "الثانية", "الثالثة", "الرابعة"].map(text => ({ text }))
        ]
      },
      SoldierStatus: {
        text: "text",
        value: "text",
        data: [
          ...[
            "",
            "محول الى متطوع",
            "ترقى ملازم شرف",
            "نقل على الإحتياط",
            "اعفاء نهائى",
            "اعفاء مؤقت",
            "القبول بالكليات العسكريه",
            "رفت جوازى",
            "رفت وجوبى",
            "عدم الصلاحيه الفنيه",
            "الاستقاله",
            "عدم رغبه فى التجنيد",
            "الوفاه اثناء الخدمه",
            "الوفاه اثناء الغياب",
            "بلوغ السن القانونى",
            "مستجد بالمركز",
            "بالخدمة",
            "رفت طبي",
            "منتهى خدمته",
            "نقل خارج السلاح",
            "امني",
            "هارب",
            "إجراءات إنهاء خدمة"
          ].map(text => ({ text }))
        ]
      },
      College: {
        text: "text",
        value: "text",
        data: [
          ...[
            "فوق متوسطة",
            "متوسطة",
            "عادة",
            "اداب",
            "هندسة",
            "حاسبات ومعلومات",
            "تربية",
            "طب بشري",
            "طب بيطري",
            "طب اسنان",
            "صيدلة",
            "الالسن",
            "خدمة اجتماعيه",
            "جامعة عمالية",
            "حقوق",
            "تجارة",
            "زراعة",
            "شريعة وقانون",
            "دراسات اسلامية",
            "اصول دين",
            "فنون جميلة",
            "فنون تطبيقية",
            "اقتصاد وعلوم سياسية",
            "اعلام",
            "تربية رياضية",
            "علوم",
            "سياحة وفنادق",
            "تربية نوعية",
            "تمريض",
            "تربية موسيقية",
            "تربية فنية",
            "اثار",
            "دار العلوم"
          ].map(text => ({ text }))
        ]
      },
      Direction: {
        text: "text",
        value: "text",
        data: [
          ...[
            "",
            "ج2",
            "ج3",
            "جنوبى",
            "شمالى",
            "غربى",
            "مركزى",
            "مج المخابرات",
            "رئاسة مج مخ والأمن",
            "رئاسة ومكاتب مج مخ البحر الأحمر",
            "رئاسة ومكاتب مج مخ الجنوبى",
            "رئاسة ومكاتب مج مخ الشمالى",
            "رئاسة ومكاتب مج مخ الغربى",
            "رئاسة ومكاتب مج مخ ج2 ",
            "رئاسة ومكاتب مج مخ ج3",
            "قيادات القطاعات",
            "كتائب م م م د",
            "قيادة الفوج 103",
            "قيادة الكتيبة 104"
          ].map(text => ({ text }))
        ]
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
    },
    loading: false
  }),
  watch: {
    // "conscripte.conscriptionDate"(v) {
    //   this.calculateDemobilizationDate();
    // }
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
    init(specificTable = "") {
      // for enhaa department can change the ending duty date
      if (this.$store.state.currentUser.section == 3) {
        let endingDutyModel = this.groups[3].items.find(x => {
          return x.model == "endingDutyDate";
        });

        endingDutyModel.readonly = false;
        this.isEnhaa = true;
      }

      // Get selects
      Object.keys(this.selects).forEach(key => {
        let { table, localTable, text, value, attrs } = this.selects[key];
        attrs = attrs ? attrs : [];
        if (table) {
          let obj = {
            table
          };
          // if (text && value) {
          //   obj.attrs = [text, value, ...attrs];
          // }
          this.$set(this.selects[key], "loading", true);
          this.api("global/get_all", obj)
            .then(x => {
              this.$set(this.selects[key], "data", x.data);
            })
            .catch(error => {
              // console.log(this.selects[key]);
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
    },
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
      // this.emptyFields(true);
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
        // attrs: models
      });
      // 2020178800544
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
        // this.showError("الرقم العسكري موجود بالفعل.");
        models.forEach(model => {
          this.$set(this.conscripte, model, data[model]);
        });
        // this.$set(this, "findingConscripte", false);
        // return;
      }
      // let {
      //   periodId,
      //   areaId,
      //   groupId,
      //   knowLedgeLevel,
      //   forceId,
      //   stateIdCurrent,
      //   additionalYearStateId,
      //   reductionStateId,
      //   soldierLevel,
      //   martialStateId,
      //   stateId
      // } = this.conscripte;
      // if (ID.length >= 13) {
      //   // substr(index(included), length)
      //   // substring(index(included), index(not included))
      //   // Example: 2020 5 2 52 0011 5
      //   // 2020 [Year of Conscription]
      //   // 5 [ Mobilization Area ]
      //   // 2 [ knowLedgeLevel ]
      //   // 52 [ ForceId ]
      //   // 0011 [ Series in Mobilization Area ]
      //   // 5 Random Integer
      //   // Fill other fields depending on militaryId
      //   if (!stateIdCurrent) {
      //     this.$set(this.conscripte, "stateIdCurrent", 1);
      //   }
      //   if (!stateId) {
      //     this.$set(this.conscripte, "stateId", 101);
      //   }
      //   if (!martialStateId) {
      //     this.$set(this.conscripte, "martialStateId", 1);
      //   }
      //   if (!soldierLevel) {
      //     this.$set(
      //       this.conscripte,
      //       "soldierLevel",
      //       forceCode == "88" ? 13 : 2
      //     );
      //   }
      //   if (!additionalYearStateId) {
      //     this.$set(this.conscripte, "additionalYearStateId", 1);
      //   }
      //   if (!reductionStateId) {
      //     this.$set(this.conscripte, "reductionStateId", 1);
      //   }
      //   // if (!areaId) {
      //   this.$set(this.conscripte, "areaId", Number(areaCode));
      //   // }
      //   // if (!knowLedgeLevel) {
      //   this.$set(
      //     this.conscripte,
      //     "knowLedgeLevel",
      //     forceCode == "88" ? 7 : Number(qualificationCode)
      //   );
      //   // }
      //   if (!forceId) {
      //     if (["04", "18", "10", "52", "66", "77", "88"].includes(forceCode)) {
      //       this.$set(this.conscripte, "forceId", Number(forceCode));
      //     }
      //   }
      //   if (!periodId) {
      //     let year = militaryId.substr(0, 4),
      //       month = new Date().getMonth() + 1,
      //       isOfficer = forceCode == "88",
      //       periodText = `${year}/${
      //         isOfficer ? (month > 6 ? 2 : 1) : Math.ceil(month / 3.9)
      //       }`,
      //       period = this.selects.periodId.data
      //         ? this.selects.periodId.data.find(f => f.periodText == periodText)
      //         : {};
      //     if (this.selects.periodId.data && period && period.id) {
      //       this.$set(this.conscripte, "periodId", period.id);
      //     }
      //   }
      //   // if (!groupId) {
      //   let groups = {
      //     "66": 2,
      //     "77": 3,
      //     "88": 4
      //   };
      //   this.$set(
      //     this.conscripte,
      //     "groupId",
      //     groups[forceCode] ? groups[forceCode] : 1
      //   );
      //   // }
      // }
      // this.$set(this, "findingConscripte", false);
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

      // تم السماح لمكتب الانهاء للاضافة
      // بسبب البطاقات العلاجية
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
      //////
      // نوع الخدمة
      /////
      if (conscripte.soldierLevel == 2) {
        // جندي
        conscripte.typeId = 1;
      } else {
        // راتب عالي
        conscripte.typeId = 2;
      }

      // let isEnhaa = this.isEnhaa;
      // if (isEnhaa && conscripte.stateIdCurrent != 2) {
      //   this.showError("غير مسموح لك بإضافة فرد حالته غير منتهي خدمته");
      //   this.$set(this, "loading", false);
      //   return;
      // }
      // if (isEnhaa && !conscripte.stateId) {
      //   this.showError("من فضلك ادخل سبب الانهاء");
      //   this.$set(this, "loading", false);
      //   return;
      // }
      // if (isEnhaa && !conscripte.soldierLevel) {
      //   this.showError("من فضلك أدخل الدرجة");
      //   this.$set(this, "loading", false);
      //   return;
      // }
      // if (isEnhaa && !conscripte.endingDutyDate) {
      //   this.showError("من فضلك ادخل تاريخ الانهاء");
      //   this.$set(this, "loading", false);
      //   return;
      // }
      // if (isEnhaa && !conscripte.nationalId) {
      //   this.showError("من فضلك أدخل الرقم القومي");
      //   this.$set(this, "loading", false);
      //   return;
      // }
      // if (isEnhaa && !conscripte.phone) {
      //   this.showError("من فضلك ادخل رقم التليفون");
      //   this.$set(this, "loading", false);
      //   return;
      // }
      // if (isEnhaa && !conscripte.address) {
      //   this.showError("من فضلك ادخل العنوان المدني");
      //   this.$set(this, "loading", false);
      //   return;
      // }
      // if (isEnhaa && !conscripte.governorateId) {
      //   this.showError("من فضلك ادخل المحافظة");
      //   this.$set(this, "loading", false);
      //   return;
      // }
      // if (isEnhaa && !conscripte.religionId) {
      //   this.showError("من فضلك ادخل الديانة");
      //   this.$set(this, "loading", false);
      //   return;
      // }
      // if (isEnhaa && !conscripte.martialStateId) {
      //   this.showError("من فضلك ادخل الحالة الاجتماعية");
      //   this.$set(this, "loading", false);
      //   return;
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
      // let addedDemobilizationDate = this.calculateDemobilizationDate(isExists);
      // if (addedDemobilizationDate) {
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
          // this.emptyFields();
        } else {
          this.showError("تعذر تحديث الفرد في قاعدة البيانات");
        }
        // this.showError("هذا الفرد موجود بالفعل بنفس الرقم العسكري");
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
        // this.emptyFields();
      } else {
        this.showError("تعذر إضافة الفرد في قاعدة البيانات");
      }
      this.$set(this, "loading", false);
      // } else {
      //   this.$set(this, "loading", false);
      // }
    }
  }
};
</script>
