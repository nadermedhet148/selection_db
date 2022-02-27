<template>
  <div class="mb-10">
    <v-row>
      <v-col cols="12" lg="6">
        <v-card>
          <v-card-title>
            اختيار وتشغيل العملية
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-autocomplete
              filled
              label="نوع العملية"
              v-model="operation.type"
              :items="operation_types"
              item-text="name"
              item-value="method"
              dense
            ></v-autocomplete>
          </v-card-text>
          <v-card-text class="text-center">
            <v-progress-circular
              size="350"
              color="primary"
              :indeterminate="operation.begin && !operation.perc"
              v-model="operation.perc"
            >
              <div v-if="!operation.begin">
                <div>
                  <v-btn
                    @click="runOperation(operation.type)"
                    icon
                    x-large
                    :disabled="!operation.type"
                    color="primary"
                  >
                    <v-icon>mdi-power</v-icon>
                  </v-btn>
                </div>
              </div>
              <div v-else>
                <div>
                  <v-card-title class="text-h1 d-block" dir="ltr"
                    >{{ operation.perc }} %</v-card-title
                  >
                </div>
              </div>
            </v-progress-circular>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col>
        <v-card>
          <v-card-title>
            {{ resultTitle }}
          </v-card-title>
          <v-divider></v-divider>
          <v-text-field
            v-model.lazy="results.search"
            filled
            dense
            prepend-inner-icon="mdi-magnify"
          ></v-text-field>
          <v-data-table
            height="335"
            :search.sync="results.search"
            :headers="results.headers"
            :items="results.items"
            v-model="results.selected"
            fixed-header
          >
            <template #item.operation_errors="{ item }">
              <div>
                <template v-for="(err, i) in item.operation_errors">
                  <v-chip small :key="i" class="font-weight-bold my-1">
                    {{ err }}
                  </v-chip>
                </template>
              </div>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <div v-if="allowChilds">
      <child1
        ref="child1"
        @numbers_passed_conscriptes="
          currentUnitListProgress = currentUnitListProgress + 1
        "
        :current-unit-id="currentUnitId"
        :currentCons="currentCons"
        :controlOp="controlOp"
        @newListIsEmpty="numbers_passed_units = numbers_passed_units + 1"
      ></child1>
      <child2
        ref="child2"
        @numbers_passed_conscriptes="
          currentUnitListProgress = currentUnitListProgress + 1
        "
        @newListIsEmpty="numbers_passed_units = numbers_passed_units + 1"
      ></child2>
      <child3
        ref="child3"
        @numbers_passed_conscriptes="
          currentUnitListProgress = currentUnitListProgress + 1
        "
        @newListIsEmpty="numbers_passed_units = numbers_passed_units + 1"
      ></child3>
      <child4
        ref="child4"
        @numbers_passed_conscriptes="
          currentUnitListProgress = currentUnitListProgress + 1
        "
        @newListIsEmpty="numbers_passed_units = numbers_passed_units + 1"
      ></child4>
    </div>
    <v-dialog v-model="openExcel.model" scrollable max-width="500" persistent>
      <v-card>
        <v-card-title>
          قم بتحديد ملف Excel
        </v-card-title>
        <v-card-text>
          <v-file-input
            clearable
            filled
            label="الملف"
            persistent-hint
            v-model="openExcel.file"
          ></v-file-input>
        </v-card-text>
        <v-card-text>
          <v-autocomplete
            v-model="openExcel.RecuStage"
            label="مرحلة التجنيد"
            :items="RecuStages"
            item-text="text"
            item-value="value"
          ></v-autocomplete>
        </v-card-text>
        <v-card-text>
          <v-text-field
            v-model="openExcel.TestDate"
            type="date"
            label="وقت الاختبار"
          ></v-text-field>
        </v-card-text>

        <v-card-actions class="px-4">
          <v-spacer></v-spacer>
          <v-btn
            class="px-6"
            color="primary"
            outlined
            @click="openExcel.model = false"
            large
          >
            عودة
          </v-btn>
          <v-btn class="px-6" color="primary" @click="readOpenExcel()" large>
            تشغيل
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="compareDialog.model"
      scrollable
      max-width="500"
      persistent
    >
      <v-card>
        <v-card-title>
          قم بتحديد ملف Excel
        </v-card-title>
        <v-card-text>
          <v-file-input
            clearable
            filled
            label="الملف"
            persistent-hint
            v-model="compareDialog.file"
          ></v-file-input>
        </v-card-text>
        <v-card-text>
          <v-autocomplete
            v-model="compareDialog.RecuStage"
            label="مرحلة التجنيد"
            :items="RecuStages"
            item-text="text"
            item-value="value"
          ></v-autocomplete>
        </v-card-text>

        <v-card-actions class="px-4">
          <v-spacer></v-spacer>
          <v-btn
            class="px-6"
            color="primary"
            outlined
            @click="compareDialog.model = false"
            large
          >
            عودة
          </v-btn>
          <v-btn class="px-6" color="primary" @click="compareExcel()" large>
            تشغيل
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="UnitDialog.model" scrollable max-width="500" persistent>
      <v-card>
        <v-card-title>
          قم بتحديد ملف Excel
        </v-card-title>
        <v-card-text>
          <v-file-input
            clearable
            filled
            label="الملف"
            persistent-hint
            v-model="UnitDialog.file"
          ></v-file-input>
        </v-card-text>

        <v-card-actions class="px-4">
          <v-spacer></v-spacer>
          <v-btn
            class="px-6"
            color="primary"
            outlined
            @click="openExcel.model = false"
            large
          >
            عودة
          </v-btn>
          <v-btn class="px-6" color="primary" @click="updateExcel()" large>
            تشغيل
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
("use strict");
const xlsxParser = require("xlsx-parse-json");
const lodash = require("lodash");
const constants = require("../../Constant").default;

export default {
  name: "admin_operations",
  components: {
    Child1: () =>
      import("@/components/sections/admin/operations/webChilds/c1.vue"),
    Child2: () =>
      import("@/components/sections/admin/operations/webChilds/c2.vue"),
    Child3: () =>
      import("@/components/sections/admin/operations/webChilds/c3.vue"),
    Child4: () =>
      import("@/components/sections/admin/operations/webChilds/c4.vue")
  },
  computed: {
    params() {
      let index = this.$store.state.routes.findIndex(
          v => v.name == this.componentName
        ),
        params = {};
      if (index !== -1) {
        params = this.$store.state.routes[index].params;
      }
      return params;
    }
  },
  data: () => ({
    componentName: "admin_operations",
    openExcel: {},
    controlOp: {
      currentOp: "",
      currentFunc: () => {},
      currentParams: [],
      pause: false,
      tryingToPause: false,
      disableOperateBtn: false,
      functions: {}
    },
    RecuStages: lodash.flattenDeep(
      constants.years.map(year =>
        constants.RecuStage.data.map(stage => `${stage.text}-${year}`)
      )
    ),
    currentUnitId: null,
    tableFilters: {},

    openExcel: {
      model: "",
      loading: false
    },
    compareDialog: {
      model: "",
      loading: false
    },
    UnitDialog: {
      model: "",
      loading: false
    },
    restore_options: {
      model: false,
      done: false,
      begin: false,
      path: null,
      dbname: ""
    },
    backup_options: {
      model: false,
      done: false,
      begin: false,
      path: null,
      dbname: "",
      dbs: [
        {
          name: "المجندين و المتابعة",
          id: "MilitaryRecordsDB"
        },
        {
          name: "دورة العمل",
          id: "SegelatOperationDB"
        },
        {
          name: "الإلتماسات",
          id: "RequestsSegDB"
        },
        {
          name: "البطاقات العلاجية",
          id: "TreatmentCards"
        }
      ]
    },
    resultTitle: "نتائج",
    file: null,
    allowChilds: true,
    stopOperationModel: false,
    stopOperationOk: false,
    operation: {
      stopIn: "",
      startIn: "",
      type: "",
      begin: false,
      perc: 0,
      done: 0,
      finish: false,
      errors: 0
    },
    noSavedOperations: ["backupDB", "update1sFromWebUnit"],
    operation_types: [
      {
        name: "استخراج البيانات من ملف Excel",
        method: "openExcelReader"
      },
      {
        name: "مقارنة مجندين المرحلة بمكتب الاستقبال",
        method: "openCompareDialog"
      }
    ],
    results: {
      search: "",
      items: [],
      headers: [
        {
          text: "المعرف",
          sortable: false,
          value: "ID"
        },
        {
          text: "الحالة",
          sortable: false,
          value: "status"
        }
      ],
      selected: []
    },
    statusColors: {
      error: "error",
      done: "success"
    },
    statusTexts: {
      error: "خطأ",
      done: "اكتمل"
    },
    login_success: false,
    list_test: [],
    list_test_search: "",

    currentCons: []
  }),
  mounted() {},
  watch: {
    "operation.done"(done) {
      if (done && done > 0) {
        let all = this.result.items.length;
        this.$set(this.operation, "perc", Math.floor((done * 100) / all));
      }
    }
  },
  sockets: {
    gotUnitsFromWeb(x) {
      //   if (x.error) {
      //     this.$set(this, "list_test", x.error);
      //   }
      //   this.$set(this, "list_test", x.data);
      //   this.fixAndAddConscripte(x.data);
    }
  },
  methods: {
    setOperationErrors(operationErrors) {
      for (let i = 0; i < operationErrors.length; i++) {
        operationErrors[i].operation_errors = operationErrors[i].errors.split(
          " --||-- "
        );
      }
      this.$set(this.errors, "items", operationErrors);
    },
    async init() {
      this.addFunctionsToControl();
    },
    addFunctionsToControl() {
      this.$set(this.controlOp.functions, "setCurrentOp", this.setCurrentOp);
      this.$set(this.controlOp.functions, "isStopped", this.isStopped);
      this.$set(
        this.controlOp.functions,
        "repeatCurrentOpAfter",
        this.repeatCurrentOpAfter
      );
    },
    runOperation(method) {
      this[method]();
    },
    openExcelReader() {
      this.$set(this.openExcel, "model", true);
    },
    openUnitDialog() {
      this.$set(this.UnitDialog, "model", true);
    },
    openCompareDialog() {
      this.$set(this.compareDialog, "model", true);
    },
    async compareExcel() {
      this.resultTitle = "الارقام العسكرية الغير مسجلة لدينا";
      this.$set(this.compareDialog, "model", false);

      xlsxParser.onFileSelection(this.compareDialog.file).then(async data => {
        let total = Object.values(data)[0].length,
          currentIndex = 0;
        const stageSoldiers = await this.api("global/get_all", {
          table: "Soldier",
          where: {
            RecuStage: this.compareDialog.RecuStage
          }
        });
        Object.values(data)[0].forEach(soldier => {
          let isExist = stageSoldiers.data.find(ele => {
            return soldier["الرقم العسكرى"] == ele.ID;
          });
          if (!isExist && soldier["الرقم العسكرى"]) {
            currentIndex++;
            this.operation.perc = Math.ceil((currentIndex / total) * 100);
            this.results.items.push({
              ID: soldier["الرقم العسكرى"],
              status: this.statusTexts.error
            });
          }
        });
      });
    },
    async readOpenExcel() {
      this.resultTitle = "النتائج";

      this.$set(this.openExcel, "model", false);

      let Centres = await this.api("global/get_all", {
        table: "Centre"
      });

      let fields = [
        {
          model: "ID",
          label: "الرقم العسكرى"
        },
        {
          model: "Name",
          label: "الاسم"
        },
        {
          model: "KnowledgeLevel",
          label: "المؤهل"
        },
        {
          model: "RecuRegion",
          label: "مكان التجنيد"
        },
        {
          model: "TestDate",
          label: "تاريخ الاختبار"
        },
        {
          model: "Unit",
          label: "الوحده الموزع عليها"
        }
      ];

      xlsxParser.onFileSelection(this.openExcel.file).then(async data => {
        let total = Object.values(data)[0].length,
          currentIndex = 0;
        this.operation.begin = true;
        await Promise.all(
          Object.values(data)[0].map(async ele => {
            let conscripte = {
              RecuStage: this.openExcel.RecuStage
            };
            fields.forEach(field => {
              conscripte[field.model] = ele[field.label];
            });
            if (!conscripte.ID) return;
            const levels = {
              1: "متوسطه",
              2: "عليا",
              0: "فوق متوسطة",
              8: "عادة"
            };
            const RecuRegionID = parseInt(conscripte.ID.charAt(4)) - 1;
            const LevelID = parseInt(conscripte.ID.charAt(5));

            conscripte.RecuRegion =
              constants.RecuRegion.data[RecuRegionID].text;
            conscripte.KnowledgeLevel = levels[LevelID];

            if (!conscripte.TestDate) {
              conscripte.TestDate = this.openExcel.TestDate;
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
            let addCon;
            if ((isExists, conscripte.Unit)) {
              addCon = await this.api("global/update_one", {
                table: "Soldier",
                where: {
                  ID: conscripte.ID
                },
                update: {
                  Unit: conscripte.Unit
                }
              });

              this.$set(this, "loading", false);
            } else {
              addCon = await this.api("global/create_one", {
                table: "Soldier",
                where: conscripte
              });
            }

            currentIndex++;
            this.operation.perc = Math.ceil((currentIndex / total) * 100);
            this.results.items.push({
              ID: conscripte.ID,
              status: this.statusTexts.done
            });

            return addCon;
          })
        );
      });
    }
  }
};
</script>
