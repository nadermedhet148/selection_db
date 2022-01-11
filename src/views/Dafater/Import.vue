<template>
  <div>
    <v-card class="mb-8" :loading="loading">
      <v-card-title>
        تصدير ملفات Excel الى قاعدة البيانات
        <v-spacer></v-spacer>
        <v-file-input
          v-model="file"
          @change="fileChanged"
          hide-details
          ref="fileExcel"
          hide-input
          style="max-width: 30px"
        ></v-file-input>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text v-if="fileInfo && fileInfo.length > 0">
        <v-row>
          <template v-for="(fi, i) in fileInfo">
            <v-col cols="3" :key="i">
              <span class="primary--text">
                {{ fi.key }}
                :
              </span>
              <v-btn
                @click="
                  ['numValidRows', 'numInvalidRows'].includes(fi.keyEn)
                    ? showItems(fi.keyEn)
                    : () => {}
                "
                text
              >
                <span v-if="fi.keyEn == 'lastModifiedDate'">
                  {{ fi.val | moment("from", "now") }}
                </span>
                <span v-else>
                  {{ fi.val }}
                </span>
              </v-btn>
            </v-col>
          </template>
          <v-col cols="3">
            <v-autocomplete
              label="مستخدم الملف"
              hint="من فضلك حدد لمن ينتمي هذا الملف"
              persistent-hint
              solo
              dense
              v-model="options.userId"
              :items="users"
              item-value="userId"
              item-text="realName"
            ></v-autocomplete>
          </v-col>
          <v-col cols="3">
            <v-autocomplete
              label="الشيت المطلوب"
              hint="حدد الشيت المطلوب رفعه"
              persistent-hint
              solo
              v-model="options.fileSheet"
              dense
              :items="fileSheets"
            ></v-autocomplete>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-text v-else class="text-center py-6">
        <v-btn @click="chooseFile()" fab x-large width="150" height="150">
          <div>
            <div class="mb-3">
              <v-icon>mdi-paperclip</v-icon>
            </div>
            <div class="mt-3">
              اختر ملف
            </div>
          </div>
        </v-btn>
      </v-card-text>
      <v-divider></v-divider>
      <v-data-table
        v-if="previewer.items.length > 0"
        :items="previewer.items"
        :headers="previewer.headers"
        multi-sort
        hide-default-header
        fixed-header
      >
        <template v-slot:header="table">
          <table-header-filters
            :items="previewer.items"
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
      </v-data-table>
      <v-divider></v-divider>
      <v-card-actions v-if="file ? true : false" class="px-4">
        <v-btn @click="importValidRows()" color="primary" large class="px-6">
          تصدير الصفوف المطابقة للشروط
        </v-btn>
      </v-card-actions>
    </v-card>
    <div class="mb-8" v-if="progress.start">
      <v-row>
        <v-col cols="5">
          <v-card>
            <v-card-text class="text-center">
              <v-progress-circular
                color="primary"
                size="250"
                width="4"
                v-model="progress.perc"
              >
                <div>
                  <div class="mb-4 text-h4">{{ progress.perc }}%</div>
                  <div class="my-4">
                    {{ progress.done }}
                    /
                    {{ progress.all }}
                  </div>
                  <div class="mt-4">
                    {{ progress.exists }}
                    موجود بالفعل
                  </div>
                </div>
              </v-progress-circular>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="7">
          <v-card>
            <v-card-title>
              الأخطاء
            </v-card-title>
            <v-data-table
              fixed-header
              hide-default-header
              :items="errors.items"
              :headers="errors.headers"
            >
              <template v-slot:header="table">
                <table-header-filters
                  :items="errors.items"
                  :table="table"
                  :filters.sync="errorsFilters"
                ></table-header-filters>
              </template>
              <template v-slot:footer="table">
                <table-footer-filters
                  :filters.sync="errorsFilters"
                  :table="table"
                ></table-footer-filters>
              </template>
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
const xlsxParser = require("xlsx-parse-json");
export default {
  name: "DafaterImport",
  mounted() {
    this.init();
    this.fillHeaders();
    this.fetchSelects();
  },
  data: () => ({
    progress: {
      start: false,
      end: false,
      done: 0,
      all: 0,
      perc: 0,
      exists: 0
    },
    errors: {
      items: [],
      headers: [
        {
          text: "الرقم العسكري",
          value: "militaryId"
        },
        {
          text: "الإسم",
          value: "fullName"
        },
        {
          text: "البيان",
          value: "errors"
        }
      ]
    },
    errorsFilters: {},
    tableFilters: {},
    loading: false,
    options: {
      userId: null,
      fileSheet: null
    },
    previewer: {
      items: [],
      headers: []
    },
    sheetHeader: {
      "الرقم العسكري": "militaryId",
      الدرجة: "degreeId",
      الاسم: "fullName",
      "تاريخ الميلاد": "birthDate",
      المؤهل: "qualificationId",
      المحافظة: "governorateId",
      العنوان: "address",
      "الرقم الثلاثي": "tripartiteNumber",
      "تاريخ إنهاء الخدمة": "demobilizationDate",
      "تاريخ الإلحاق": "conscriptionDate",
      "رقم التعبئة": "unitDaftarTa3Be2A",
      "رقم الدفتر": "daftarNumber"
    },
    users: [],
    file: null,
    analyzedFile: null,
    fileSheets: [],
    fileInfo: [],
    fileInfoMap: {
      name: "اسم الملف",
      lastModifiedDate: "آخر تعديل",
      size: "الحجم",
      numRows: "عدد الصفوف",
      numValidRows: "الصفوف المطابقة للشروط",
      numInvalidRows: "الغير مطابقة للشروط"
    },
    selects: {
      degreeId: {
        table: "degrees",
        itemText: "degreeType",
        itemValue: "degreeId",
        fixKeys: {
          "عريف مجند": "عـريف",
          "رقيب مجند": "رقيـب",
          "ملازم مجند": "ملازم"
        }
      },
      qualificationId: {
        table: "qualifications",
        itemText: "name",
        itemValue: "qualificationId"
      },
      governorateId: {
        table: "governorates",
        itemText: "displayedText",
        itemValue: "id",
        fixKeys: {
          اسيوط: "أسيوط",
          اسوان: "أسوان",
          الجيزه: "الجيزة",
          كفرالشيخ: "كفر الشيخ",
          الاسكندرية: "الإسكندرية",
          الاسماعيلية: "الإسماعيلية",
          الاقصر: "الأقصر",
          "البحر الاحمر": "البحر الأحمر",
          إلمنيا: "المنيا",
          "بنى سويف": "بني سويف"
        }
      }
    }
  }),
  watch: {
    "progress.done"(v) {
      let all = this.progress.all;
      this.$set(this.progress, "perc", Math.floor((v * 100) / all));
    },
    "options.fileSheet"(v) {
      let sheetHeader = this.sheetHeader,
        allLength = this.analyzedFile[v].length,
        validRows = this.analyzedFile[v].filter(r => {
          let returner = true;
          Object.keys(sheetHeader).forEach(key => {
            if (["الرقم العسكري", "الاسم"].includes(key) && !r[key])
              returner = false;
          });
          return returner;
        }).length,
        invalidRows = allLength - validRows;
      this.fileInfo.find(f => f.keyEn == "numRows").val = allLength;
      this.fileInfo.find(f => f.keyEn == "numValidRows").val = validRows;
      this.fileInfo.find(f => f.keyEn == "numInvalidRows").val = invalidRows;
    }
  },
  methods: {
    async importValidRows() {
      let { userId, fileSheet } = this.options;
      if (!userId) {
        this.showError("من فضلك قم بتحديد المستخدم الذي ينتمي له هذا الملف.");
        return;
      }
      this.$set(this.progress, "start", true);
      this.$set(this.progress, "all", 0);
      this.$set(this.progress, "done", 0);
      this.$set(this.progress, "perc", 0);
      this.$set(this.progress, "exists", 0);
      let that = this,
        sheetHeader = this.sheetHeader,
        analyzedFile = this.analyzedFile[fileSheet],
        selects = this.selects,
        items = analyzedFile.map((r, i) => {
          let returner = true;
          Object.keys(sheetHeader).forEach(key => {
            if (["الرقم العسكري", "الاسم"].includes(key) && !r[key])
              returner = false;
          });
          return returner
            ? {
                ...r,
                index: i + 2
              }
            : null;
        });
      items = items.filter(f => f);
      // removes null value
      this.$set(this.progress, "all", items.length);
      let data,
        itemText,
        itemValue,
        fixKeys = {},
        obj,
        asyncedLoop = () => {
          return new Promise((success, failure) => {
            (async function loop() {
              for (let i = 0; i < items.length; i++) {
                let c = items[i],
                  fixedC = {
                    errors: []
                  },
                  itemValid = true;
                Object.keys(c).forEach(key => {
                  // c = {} object with arabic keys
                  // fixedC= {} object with english keys
                  // key =  arabic key
                  // keyEn = the opposite key in en
                  let keyEn = sheetHeader[key];
                  // trimming value
                  fixedC[keyEn] = c[key] ? c[key].toString().trim() : c[key];
                  // check if the value is not number
                  fixedC[keyEn] =
                    key == "رقم التعبئة" && isNaN(fixedC[keyEn])
                      ? null
                      : fixedC[keyEn];
                  // check if english key exist in selects keys
                  if (selects[keyEn]) {
                    data = selects[keyEn].data;
                    itemText = selects[keyEn].itemText;
                    itemValue = selects[keyEn].itemValue;
                    fixKeys = selects[keyEn].fixKeys
                      ? selects[keyEn].fixKeys
                      : {};
                    // findkey checks if value exist in fixkeys and if so take the value of fixkeys obj
                    let findKey = fixKeys[fixedC[keyEn]]
                      ? fixKeys[fixedC[keyEn]]
                      : fixedC[keyEn];
                    obj = data.find(f => f[itemText] == findKey);
                    if (obj) {
                      fixedC[keyEn] = obj[itemValue];
                    } else {
                      itemValid = false;
                      fixedC.errors.push(`خانة ${key} غير مكتوبة بشكل صحيح
                      -${fixedC[keyEn]}-
                      `);
                    }
                  }
                });
                if (!itemValid) {
                  that.$set(
                    that.errors.items,
                    that.errors.items.length,
                    fixedC
                  );
                }
                fixedC.daftarBy = userId;
                fixedC.daftarAt = new Date();
                delete fixedC.undefined;
                let conscripte = itemValid
                    ? await that.api("global/get_one", {
                        table: "conscriptes",
                        where: {
                          militaryId: fixedC.militaryId
                        },
                        attributes: ["militaryId"]
                      })
                    : null,
                  isCreate =
                    conscripte && conscripte.data && conscripte.data.militaryId
                      ? false
                      : true;
                if (itemValid) {
                  try {
                    await that.api(
                      `global/${isCreate ? "create" : "update"}_one`,
                      {
                        table: "conscriptes",
                        where: isCreate
                          ? {
                              ...fixedC
                            }
                          : {
                              militaryId: fixedC.militaryId
                            },
                        update: fixedC
                      }
                    );
                  } catch (error) {
                    console.log(error);
                    console.log(fixedC);
                  }
                }
                that.$set(that.progress, "done", i + 1);
                if (!isCreate) {
                  that.$set(that.progress, "exists", that.progress.exists + 1);
                }
                if (i == items.length - 1) {
                  success(true);
                }
              }
            })();
          });
        };
      await asyncedLoop();
      this.$set(this.progress, "end", true);
    },
    chooseFile() {
      return this.$refs.fileExcel.$children[0].$el.click();
    },
    showItems(key) {
      let sheet = this.options.fileSheet,
        sheetHeader = this.sheetHeader,
        analyzedFile = this.analyzedFile[sheet],
        items = [];
      switch (key) {
        case "numValidRows":
          items = analyzedFile.map((r, i) => {
            let returner = true;
            Object.keys(sheetHeader).forEach(key => {
              if (["الرقم العسكري", "الاسم"].includes(key) && !r[key])
                returner = false;
            });
            return returner
              ? {
                  ...r,
                  index: i + 2
                }
              : null;
          });
          items = items.filter(f => f);
          break;
        case "numInvalidRows":
          items = analyzedFile.map((r, i) => {
            let returner = false;
            Object.keys(sheetHeader).forEach(key => {
              if (["الرقم العسكري", "الاسم"].includes(key) && !r[key])
                returner = true;
            });
            return returner
              ? {
                  ...r,
                  index: i + 2
                }
              : null;
          });
          items = items.filter(f => f);
          break;
      }
      this.$set(this.previewer, "items", items);
    },
    fileChanged(e) {
      this.$set(this, "fileInfo", []);
      if (e) {
        console.log(e);
        this.$set(this, "loading", true);
        console.log(e.name);
        let splitter = e.name.split(".");
        if (!["xlsx", "xls"].includes(splitter[splitter.length - 1])) {
          this.showError("من فضلك قم بتحديد ملف Excel");
          return;
        }
        xlsxParser.onFileSelection(e).then(data => {
          let sheets = Object.keys(data),
            fixedData = {};
          sheets.forEach(sheet => {
            fixedData[sheet] = this.fixDates(data[sheet], [
              "تاريخ الميلاد",
              "تاريخ إنهاء الخدمة",
              "تاريخ الإلحاق"
            ]);
          });
          this.$set(this, "fileSheets", sheets);
          this.$set(this, "analyzedFile", fixedData);
          console.log(fixedData);
          this.$set(this.options, "fileSheet", sheets[0]);
          Object.keys(this.fileInfoMap).forEach(key => {
            let val = this.fileInfoMap[key];
            this.fileInfo.push({
              key: val,
              keyEn: key,
              val: key == "size" ? this.fileSize(e[key]) : e[key]
            });
          });
        });
        this.$set(this, "loading", false);
      }
    },
    fillHeaders() {
      let sheetHeader = this.sheetHeader,
        headers = [
          {
            text: "م",
            value: "index"
          }
        ];
      Object.keys(sheetHeader).forEach(key => {
        headers.push({
          text: key,
          value: key,
          dbValue: sheetHeader[key]
        });
      });
      this.$set(this.previewer, "headers", headers);
    },
    fetchSelects() {
      let selects = this.selects;
      Object.keys(selects).forEach(async key => {
        let { table } = selects[key],
          items = await this.api("global/get_all", {
            table
          });
        this.$set(this.selects[key], "data", items.data);
      });
    },
    init() {
      this.api("global/get_all", {
        table: "users"
      })
        .then(x => {
          this.$set(this, "users", x.data);
        })
        .catch(error => {
          this.showError(
            "حدث خطأ أثناء عرض قائمة المستخدمين من قاعدة البيانات"
          );
        });
    }
  }
};
</script>
