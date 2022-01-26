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
              v-if="operation.type == 'update1sFromWebSegelat'"
              size="350"
              color="primary"
              :indeterminate="
                segelatWeb.operation.begin && !segelatWeb.operation.perc
              "
              v-model="segelatWeb.operation.perc"
            >
              <div v-if="!segelatWeb.operation.begin">
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
                  <v-card-title class="pb-1 text-h1 d-block" dir="ltr"
                    >{{ segelatWeb.operation.perc }} %</v-card-title
                  >
                </div>
                <div>
                  <v-card-title class="pb-1 d-block error--text">
                    <span class="font-weight-bold">أخطاء</span>
                    :
                    <!-- {{ operation.errors }} -->
                    {{ errors.items.length }}
                  </v-card-title>
                  <v-card-title class="pb-1 d-block error--text">
                    {{ segelatWeb.operation.done }}
                    /
                    {{ segelatWeb.cons.items.length }}
                  </v-card-title>
                </div>
                <div class="mt-4">
                  <v-btn
                    @click="stopOperationModel = true"
                    icon
                    x-large
                    color="error"
                  >
                    <v-icon>mdi-stop-circle-outline</v-icon>
                  </v-btn>
                </div>
              </div>
            </v-progress-circular>
            <v-progress-circular
              v-else
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
                <div>
                  <v-card-title class="d-block error--text">
                    <span class="font-weight-bold">أخطاء</span>
                    :
                    <!-- {{ operation.errors }} -->
                    {{ errors.items.length }}
                  </v-card-title>
                </div>
                <div class="mt-4">
                  <v-btn
                    @click="stopOperationModel = true"
                    icon
                    x-large
                    color="error"
                  >
                    <v-icon>mdi-stop-circle-outline</v-icon>
                  </v-btn>
                </div>
              </div>
            </v-progress-circular>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col>
        <v-card>
          <v-card-title>
            الأخطاء
          </v-card-title>
          <v-divider></v-divider>
          <v-text-field
            v-model.lazy="errors.search"
            filled
            dense
            prepend-inner-icon="mdi-magnify"
          ></v-text-field>
          <v-data-table
            height="335"
            :search.sync="errors.search"
            :headers="errors.headers"
            :items="errors.items"
            v-model="errors.selected"
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

    <v-card class="mb-4" v-if="result.items.length">
      <v-card-title>
        المصدر
        <v-spacer></v-spacer>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              :disabled="result.items.length > 0"
              @click="
                $refs.upload_file.$el.children[1].children[0].children[0].children[1].click()
              "
              icon
              v-on="on"
            >
              <v-icon>mdi-paperclip</v-icon>
            </v-btn>
          </template>
          <span>اختيار ملف</span>
        </v-tooltip>
        <v-file-input
          v-model="file"
          ref="upload_file"
          filled
          class="d-none"
          counter
          @change="fileUploaded"
        ></v-file-input>
      </v-card-title>
      <v-divider></v-divider>
      <!-- <v-text-field
        v-model.lazy="result.search"
        filled
        dense
        prepend-inner-icon="mdi-magnify"
      ></v-text-field> -->
      <v-data-table
        :search.sync="result.search"
        :headers="result.headers"
        :items="result.items"
        v-model="result.selected"
        fixed-header
        hide-default-header
        multi-sort
      >
        <template v-slot:header="table">
          <table-header-filters
            :items="result.items"
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
        <template v-slot:item.status="{ item }">
          <v-chip
            v-if="item.status"
            small
            class="font-weight-bold"
            :color="item.status ? status_colors[item.status] : ''"
          >
            {{ item.status ? status_texts[item.status] : "" }}
          </v-chip>
        </template>
      </v-data-table>
    </v-card>
    <v-card class="mb-4" v-if="segelatWeb.cons.items.length > 0">
      <v-card-title>
        المجندين
      </v-card-title>
      <v-divider></v-divider>
      <v-text-field
        v-model.lazy="segelatWeb.cons.search"
        filled
        dense
        prepend-inner-icon="mdi-magnify"
      ></v-text-field>
      <v-data-table
        :search.sync="segelatWeb.cons.search"
        :headers="segelatWeb.cons.headers"
        :items="segelatWeb.cons.items"
        v-model="segelatWeb.cons.selected"
        fixed-header
      >
        <template v-slot:item.webOperationStatus="{ item }">
          <v-chip
            v-if="item.webOperationStatus"
            small
            class="font-weight-bold"
            :color="
              item.webOperationStatus
                ? status_colors[item.webOperationStatus]
                : ''
            "
          >
            {{
              item.webOperationStatus
                ? status_texts[item.webOperationStatus]
                : ""
            }}
          </v-chip>
        </template>
      </v-data-table>
    </v-card>

    <div v-if="allowChilds">
      <child1
        ref="child1"
        @numbers_passed_conscriptes="
          currentUnitListProgress = currentUnitListProgress + 1
        "
        @pushError="pushError"
        @removeError="removeError"
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
        @pushError="pushError"
        @removeError="removeError"
        @newListIsEmpty="numbers_passed_units = numbers_passed_units + 1"
      ></child2>
      <child3
        ref="child3"
        @numbers_passed_conscriptes="
          currentUnitListProgress = currentUnitListProgress + 1
        "
        @pushError="pushError"
        @removeError="removeError"
        @newListIsEmpty="numbers_passed_units = numbers_passed_units + 1"
      ></child3>
      <child4
        ref="child4"
        @numbers_passed_conscriptes="
          currentUnitListProgress = currentUnitListProgress + 1
        "
        @pushError="pushError"
        @removeError="removeError"
        @newListIsEmpty="numbers_passed_units = numbers_passed_units + 1"
      ></child4>
    </div>
    <v-dialog
      v-if="isCurrentRoute(componentName)"
      scrollable
      v-model="stopOperationModel"
      max-width="450"
    >
      <v-card>
        <v-card-title class="error white--text">
          إيقاف العملية
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pt-6">
          <div v-if="operation.done > 0 || segelatWeb.operation.done > 0">
            في حالة إيقاف العملية سوف يكون بإمكانك استكمالها في أي وقت, ولكن
            سيتم إعادة الوحدة الحالية بالكامل من بدايتها.
          </div>
          <div v-else>
            لا يمكنك إيقاف العملية في المرحلة الأولى
          </div>
        </v-card-text>
        <v-card-actions class="px-4">
          <v-spacer></v-spacer>
          <v-btn
            color="error"
            large
            outlined
            class="px-6"
            v-text="'رجوع'"
            @click="stopOperationModel = false"
          ></v-btn>
          <v-btn
            color="error"
            large
            :disabled="
              operation.done == 0 &&
                segelatWeb.operation.done !== null &&
                segelatWeb.operation.done == 0
            "
            class="px-6"
            v-text="'إيقاف'"
            @click="stopOperation()"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-if="isCurrentRoute(componentName)"
      v-model="oneUnit.model"
      persistent
      scrollable
      max-width="450"
    >
      <v-card :loading="oneUnit.loading" :disabled="oneUnit.loading">
        <v-card-title>
          اختر الوحدة المراد تشغيلها
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pt-6">
          <v-autocomplete
            :loading="oneUnit.loading"
            v-model="operation.startIn"
            :items="result.items"
            filled
            label="الوحدة"
            item-text="unitText"
            item-value="id"
          ></v-autocomplete>
        </v-card-text>
        <v-card-actions class="px-4">
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            outlined
            large
            class="px-6"
            @click="oneUnit.model = false"
          >
            عودة
          </v-btn>
          <v-btn
            color="primary"
            large
            class="px-6"
            @click="update1sFromWebUnit(false)"
          >
            تشغيل
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-if="isCurrentRoute(componentName)"
      v-model="onePdf.model"
      scrollable
      max-width="500"
      persistent
    >
      <v-card>
        <v-card-title>
          قم بتحديد ملف Pdf
        </v-card-title>
        <v-card-text>
          <v-file-input
            clearable
            filled
            label="الملف"
            persistent-hint
            v-model="onePdf.file"
          ></v-file-input>
        </v-card-text>

        <v-card-actions class="px-4">
          <v-spacer></v-spacer>
          <v-btn
            class="px-6"
            color="primary"
            outlined
            @click="onePdf.model = false"
            large
          >
            عودة
          </v-btn>
          <v-btn class="px-6" color="primary" @click="readOnePdf()" large>
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
export default {
  name: "CompleteFugitiveData",
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
    onePdf: {},
    controlOp: {
      currentOp: "",
      currentFunc: () => {},
      currentParams: [],
      pause: false,
      tryingToPause: false,
      disableOperateBtn: false,
      functions: {}
    },
    fixedIds: [],
    currentUnitId: null,
    tableFilters: {},
    checkInService: {
      model: false,
      excelFile: null,
      downloadS1: false,
      notInculdedInTheForceList: false,
      inServiceCons: []
    },
    segelatWeb: {
      militaryOperationId: 0,
      militaryOperations: [],
      units: {
        items: [],
        loading: false
      },
      excelFile: null,
      profileModel: false,
      startIn: null,
      unitId: null,
      model: false,
      from: null,
      to: new Date().toISOString().substring(0, 10),
      operation: {
        begin: false,
        done: 0,
        finish: false,
        perc: 0,
        conscriptionForces: [],
        conscriptionYear: "",
        conscripteType: "0"
      },
      conscripteTypes: [
        {
          text: "الكل",
          value: "0"
        },
        {
          text: "راتب عالي",
          value: "1"
        },
        {
          text: "مجندين",
          value: "2"
        }
      ],
      cons: {
        items: [],
        headers: [
          {
            text: "الرقم العسكري",
            value: "militaryId",
            sortable: false
          },
          {
            text: "الإسم",
            value: "fullName",
            sortable: false
          },
          {
            text: "تاريخ التجنيد",
            value: "hisConscriptionDate",
            sortable: false
          },
          {
            text: "الحالة",
            value: "webOperationStatus",
            sortable: false
          }
        ],
        search: "",
        selected: []
      }
    },
    onePdf: {
      model: "",
      loading: false
    },
    oneUnit: {
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
    additionalHeaders: [
      {
        text: "force",
        value: "force",
        sortable: false
      },
      {
        text: "done",
        value: "done",
        sortable: false
      },
      {
        text: "error",
        value: "error",
        sortable: false
      }
    ],
    numbers_done_units: 0,
    numbers_passed_units: 0,
    currentUnitListLength: 0,
    currentUnitListProgress: 0,
    // numbers_passed_conscriptes: 0,
    currentOH: null,
    operation_types_loading: false,
    noSavedOperations: ["backupDB", "update1sFromWebUnit"],
    operation_types: [
      {
        name: "استخراج البيانات من ملف PDF",
        method: "openPdfReader"
      }
      // {
      //   text: "مطابقة قوة جميع الوحدات بقاعدة البيانات",
      //   value: "compareUnitForceWithDatabase"
    ],
    result: {
      search: "",
      items: [],
      headers: [],
      selected: []
    },
    errors: {
      search: "",
      items: [],
      headers: [
        {
          text: "المعرف",
          sortable: false,
          value: "identifier"
        },
        {
          text: "الواصف",
          sortable: false,
          value: "describer"
        },
        {
          text: "الأخطاء",
          sortable: false,
          value: "operation_errors"
        }
      ],
      selected: []
    },
    // * Military Web
    status_colors: {
      overlaped: "default",
      pending: "default",
      running: "orange grey--text text--lighten-5",
      error: "error",
      done: "success"
    },
    status_texts: {
      overlaped: "تم تجاوزه",
      pending: "منتظر",
      running: "يعمل",
      error: "خطأ",
      done: "اكتمل"
    },
    login_success: false,
    list_test: [],
    list_test_search: "",
    conscripte_results: {
      items: [],
      headers: [
        {
          text: "الرقم العسكري",
          value: "militaryId"
        },
        {
          text: "العنوان",
          value: "address"
        },
        {
          text: "units",
          value: "units"
        },
        {
          text: "promotions",
          value: "promotions"
        },
        {
          text: "penalties",
          value: "penalties"
        },
        {
          text: "ta3be2as",
          value: "ta3be2as"
        }
      ],
      search: "",
      selected: []
    },
    currentCons: []
  }),
  mounted() {},
  watch: {
    "params.id"(v) {
      //
    },
    "operation.done"(done) {
      if (done && done > 0) {
        let all = this.result.items.length;
        this.$set(this.operation, "perc", Math.floor((done * 100) / all));
      }
    },
    "segelatWeb.operation.done"(done) {
      if (done && done > 0) {
        let all = this.segelatWeb.cons.items.length;
        this.$set(
          this.segelatWeb.operation,
          "perc",
          Math.floor((done * 100) / all)
        );
      }
    },
    currentUnitListProgress(v) {
      if (!this.stopOperationOk) {
        if (v && v > 0) {
          if (this.operation.type == "update1sFromWebSegelat") {
            if (v - 1 == this.segelatWeb.cons.items.length) {
              this.showSuccess("تم تحديث جميع الـ 1 س");
              this.stopOperation(false, false, false);
            } else {
              this.$set(
                this.segelatWeb.operation,
                "done",
                Number(this.segelatWeb.operation.done) + 1
              );
              if (
                this.segelatWeb.cons.items[
                  this.segelatWeb.operation.done - 1
                ] &&
                this.segelatWeb.cons.items[this.segelatWeb.operation.done - 1]
                  .webOperationStatus == "pending"
              ) {
                this.$set(
                  this.segelatWeb.cons.items[
                    this.segelatWeb.operation.done - 1
                  ],
                  "webOperationStatus",
                  "done"
                );
              }
            }
          } else {
            this.$set(
              this.result.items[this.numbers_passed_units],
              "done",
              Number(this.result.items[this.numbers_passed_units].done) + 1
            );
            if (this.numbers_passed_units == 0) {
              //
            } else {
              // if (v !== this.currentUnitListLength) {
              //   this.$set(
              //     this.result.items[this.numbers_passed_units],
              //     "done",
              //     Number(this.result.items[this.numbers_passed_units].done) + 1
              //   );
              // }
            }
            // console.log(v);
            console.log(v);
            if (v == this.currentUnitListLength) {
              this.$set(
                this,
                "numbers_passed_units",
                this.numbers_passed_units + 1
              );
            }
          }
        }
      } else {
        this.$refs.child1.stopOperationOk = true;
      }
    },
    numbers_passed_units(v) {
      if (v && !this.stopOperationOk) {
        let { done } = this.operation;
        // let status = this.result.items[v - 1].status;
        this.$set(this.operation, "done", v);
        // if (!status || status == "running") {
        //   this.$set(this.result.items[v - 1], "status", "done");
        // }
        if (this.result.items == Number(done) + 1) {
          console.log("Now true");
          this.$set(this.operation, "finish", true);
          this.$set(this.operation, "begin", false);
          this.$set(this, "login_success", false);
          this.stopOperation(true, true);
        } else {
          this.logout(v);
          let status = this.result.items[v].status;
          let prev_status = this.result.items[v - 1].status;
          if (!status || status == "pending") {
            this.$set(this.result.items[v], "status", "running");
          }
          if (!prev_status || prev_status == "running") {
            this.$set(this.result.items[v - 1], "status", "done");
          }
          this.stopOperation(true);
        }
      }
    }
  },
  sockets: {
    gotUnitsFromWeb(x) {
      if (x.error) {
        this.$set(this, "list_test", x.error);
      }
      this.$set(this, "list_test", x.data);
      this.fixAndAddConscripte(x.data);
    },
    gotUnitsForceList(x) {
      // console.log(x , 'gotUnitsForceList');
      if (this.isStopped()) {
        return;
      }
      let { cons, error } = x;
      if (error) {
        console.log(`Error: `, error);

        // don't pass the unit
        //this.passUnit(this.numbers_passed_units);

        this.repeatCurrentOpAfter(3000);

        this.pushError({
          id: this.result.items[this.numbers_passed_units].unitText,
          type: "وحدة",
          errors: ["تعذر تحليل قوة الوحدة من النود", error]
        });
      } else {
        this.removeError({
          id: this.result.items[this.numbers_passed_units].unitText,
          type: "وحدة",
          errors: ["تعذر تحليل قوة الوحدة من النود"]
        });
        /***
         * في الاول كنا بنستخدم
         * list of miliaryIds
         * ونعمل فلترة ليهم
         *
         * دلوقتي بنستخدم
         * list of conscriptes obejcts
         * علشان ساعات مبنقدرش نوصل
         * لل1س فبقينا ناخد المعلومات الأساسية من هنا ونفلتر عليها
         * ونضيفها قبل ما نجرب ال1س
         */
        // Check for constraints
        if (this.operation.type == "update1sFromWeb") {
          if (this.operation.conscriptionYear) {
            // list = list.filter(
            //   f => f.substring(0, 4) == this.operation.conscriptionYear
            // );
            cons = cons.filter(
              con =>
                con.militaryId.substring(0, 4) ==
                this.operation.conscriptionYear
            );
          }
          if (
            this.operation.conscriptionForces &&
            Array.isArray(this.operation.conscriptionForces) &&
            this.operation.conscriptionForces.length > 0
          ) {
            // list = list.filter(f =>
            //   this.operation.conscriptionForces.includes(f.substring(6, 8))
            // );

            cons = cons.filter(con =>
              this.operation.conscriptionForces.includes(con.substring(6, 8))
            );
          }
        }

        cons = cons.map((con, index) => ({
          index,
          militaryId: con.militaryId,
          fullName: con.fullName,
          unitText: this.result.items[this.numbers_passed_units].unitText
        }));

        if (this.fixedIds && this.fixedIds.length) {
          // If there are fixed Ids that means
          // this operation is for checking which Conscriptes are in Service.
          // ! الكود دا حطيته عشان عم علاء كان عايز يجيب أرقام عسكرية معينة
          // ! الأرقام العسكرية دي هتلاقيني حاططها فوق في الداتا اسمها fixedIds

          if (this.checkInService.notInculdedInTheForceList) {
            cons = this.fixedIds.map(ele => ({ militaryId: ele }));
            this.$set(this.checkInService, "inServiceCons", [...cons]);
          } else {
            cons = cons.filter(con => {
              return this.fixedIds.includes(con.militaryId);
            });
            this.$set(this.checkInService, "inServiceCons", [
              ...this.checkInService.inServiceCons,
              ...cons
            ]);
          }

          if (!this.checkInService.downloadS1) {
            // pass the unit
            this.$set(
              this,
              "numbers_passed_units",
              Number(this.numbers_passed_units) + 1
            );
            return;
          }
        } else {
          // get only Hrs hodod
          cons = cons.filter(con => {
            let identifier =
                con.militaryId.length == 13 ? con.militaryId.slice(6, 8) : null,
              // سلاح حرس حدود
              // 66 سائق
              // كاتب
              // مشاه اجهزه قياده
              // ٨٨ ظابط احتياط
              // ١٨ سواق راتب عالي
              whiteList = ["52", "18", "66", "04", "77", "88"],
              isHodod = identifier && whiteList.includes(identifier);
            return isHodod;
          });
        }

        // fix index
        cons = cons.map((con, index) => ({
          ...con,
          index: index + 1
        }));
        // save it for later if one of conscriptes
        this.currentCons = cons;
        console.log(this.currentCons);
        // now generate list militaryIds
        let list = cons.map(con => con.militaryId);

        this.$set(
          this.result.items[this.numbers_passed_units],
          "force",
          list.length
        );
        // Node Here
        // let childCount = 2,
        //   halfs = Math.floor(list.length / childCount);

        this.$refs.child1.setNewForceList(list);
        // this.$refs.child1.setNewForceList(list.slice(0, halfs));
        // console.log(list.slice(0, halfs));
        // this.$refs.child2.setNewForceList(list.slice(halfs, halfs * 2));
        // console.log(list.slice(halfs, halfs * 2));
        // this.$refs.child3.setNewForceList(list.slice(halfs * 2, halfs * 3));
        // console.log(list.slice(halfs * 2, halfs * 3));
        // this.$refs.child4.setNewForceList(list.slice(halfs, list.length));
        // console.log(list.slice(halfs * 3, list.length));
        this.$set(this, "currentUnitListLength", list.length);
        this.$set(this, "currentUnitListProgress", 0);
        // this.$set(
        //   this.result.items[this.numbers_passed_units],
        //   "forceList",
        //   list
        // );
        this.$set(this.result.items[this.numbers_passed_units], "done", 0);
        this.$set(this.result.items[this.numbers_passed_units], "error", 0);
        // this.loadDoc(0);
        // this.loadDoc(1);
        this.$nextTick(() => {
          let intVal = setInterval(() => {
            this.$nextTick(() => {
              x.list = null;
            });
            clearInterval(intVal);
          }, 2000);
        });
      }
    },
    async gotMyIdData(x) {
      let { data, id, error } = x;
      if (error) {
        this.$set(this, "list_test", error);
      } else {
        data.militaryId = id;
        // let date = await this.api("server/get-time");
        // console.log(date.data);
        this.$refs.child1.fixAndAddConscripte(data);
        // this.$set(this, "list_test", data);
      }
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
    openPdfReader() {
      this.$set(this.onePdf, "model", true);
    },
    async readOnePdf() {
      this.$set(this.onePdf, "model", false);

      await this.api("sections/nozom/readOnePdf", {
        file: this.onePdf.file.path
      });
    },
    async pushUnitPasswordToDB() {
      let units = this.result.items;

      units.forEach(async (unit, i) => {
        await this.api("global/create_one", {
          table: "webUnitsPasswords",
          where: {
            id: i + 1,
            unitText: unit.unitText,
            username: unit.username,
            password: unit.password
          }
        });
        console.log(i + 1);
      });
    },
    async pushError(obj = {}) {
      // ignore errors when search in all units with spefic ids
      if (obj.type === "فرد") return null;

      let identifier = obj.id,
        describer = obj.type,
        operation_errors = obj.errors,
        segelatWeb = obj.segelatWeb ? true : false;
      if (segelatWeb) {
        // let index = this.segelatWeb.cons.items.findIndex(
        //   i => i.militaryId == identifier
        // );
        // this.$set(
        //   this.segelatWeb.cons.items[index],
        //   "webOperationStatus",
        //   "error"
        // );
        // this.$set(
        //   this.segelatWeb.operation,
        //   "done",
        //   Number(this.segelatWeb.operation.done) + 1
        // );
        this.$set(
          this.segelatWeb.cons.items[this.currentUnitListProgress],
          "webOperationStatus",
          "error"
        );
      } else {
        this.$set(
          this.result.items[this.numbers_passed_units],
          "error",
          this.result.items[this.numbers_passed_units].error + 1
        );
      }
      if (this.currentOH) {
        let error = {
            identifier,
            describer,
            errors: operation_errors.join(" --||-- "),
            recordedAt: new Date(),
            webOperationId: this.operation_types.filter(
              c => c.method == this.operation.type
            )[0].id,
            webOperationHistoryId: this.currentOH.id
          },
          addErrors = await this.api("global/create_one", {
            table: "webOperationErrors",
            where: error
          });
      }
      // this.$set(this.operation, "errors", this.operation.errors + 1);
      // console.log(this.operation.errors);
      this.$set(this.errors.items, this.errors.items.length, {
        identifier,
        describer,
        operation_errors
      });
      // console.log(this.errors.items);
    },
    async removeError(obj = { id: null, type: null, errors: [] }) {
      let errors = this.errors.items,
        oHId = this.currentOH.id,
        isExists = false,
        // for backward iterate
        index = errors.length - 1;

      // front end uses operation_errors but in DB uses errors !!
      let errorToRemove = {
        identifier: obj.id,
        describer: obj.type,
        errors: obj.errors,
        operation_errors: obj.errors
      };

      // delete in front end
      while (index >= 0) {
        if (
          (errors[index].identifier == errorToRemove.identifier ||
            !errorToRemove.identifier) &&
          errors[index].describer == errorToRemove.describer &&
          (!errorToRemove.operation_errors?.length ||
            errorToRemove.operation_errors.includes(
              errors[index].operation_errors[0]
            ))
        ) {
          console.log(`تم حذف ال ${errorToRemove.identifier} من front end`);
          errors.splice(index, 1);
          isExists = true;
        }
        index -= 1;
      }

      // delete in DB
      if (isExists) {
        // delete without operationErrors
        let whereErrors = {};
        if (errorToRemove.errors?.length == 1) {
          whereErrors = { errors: { $like: `${errorToRemove.errors[0]}%` } };
        } else if (errorToRemove.errors?.length > 1) {
          whereErrors = { errors: { $or: [] } };
          errorToRemove.errors.forEach(error => {
            whereErrors.errors.$or.push({ $like: `%${error}%` });
          });
        }
        await this.api("global/delete_all", {
          table: "webOperationErrors",
          where: {
            webOperationHistoryId: oHId,
            ...(errorToRemove.identifier
              ? { identifier: errorToRemove.identifier }
              : {}),
            describer: errorToRemove.describer,
            ...whereErrors
          }
        })
          .then(x => {
            console.log(`تم حذف ال ${errorToRemove.identifier} من back end`);
          })
          .catch(err => {
            console.log(err);
            this.showError("لم يتم حذف الأخطاء من قاعدة البيانات");
          });
      }
    }
  }
};
</script>
