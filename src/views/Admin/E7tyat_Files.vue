<template>
  <div>
    <v-card class="mb-4">
      <v-card-title>
        إضافة ملف
      </v-card-title>
      <v-card-text>
        <v-file-input
          label="الملف"
          hint="فم بتحديد المف المراد إضافته"
          persistent-hint
          filled
          prepend-icon=""
          counter="1"
          v-model="file"
        ></v-file-input>
      </v-card-text>
      <v-card-actions class="px-4">
        <v-btn
          v-text="'رفع الملف'"
          class="px-6"
          color="primary"
          @click="analyzeFile"
          :disabled="!file"
        ></v-btn>
        <v-btn
          v-text="'نقل الكل على الإحتياط'"
          class="px-6"
          outlined
          color="primary"
          :disabled="items.length == 0"
        ></v-btn>
      </v-card-actions>
    </v-card>
    <v-card>
      <v-card-title>
        معاينة الملف
        <v-spacer></v-spacer>
        <v-autocomplete
          style="max-width: 300px"
          :items="files"
          @change="fileNameChanged"
          filled
          label="اختر ملف"
          hide-details
          v-model="fileName"
        ></v-autocomplete>
      </v-card-title>
      <!-- <v-text-field
        prepend-inner-icon="mdi-magnify"
        v-model="search"
        filled
        dense
      ></v-text-field> -->
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="items"
          multi-sort
          :search="search"
          hide-default-header
        >
          <template v-slot:header="table">
            <table-header-filters
              :items="items"
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
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "e7tyat_files",
  mounted() {
    this.getAllFiles();
  },
  data: () => ({
    tableFilters: {},
    excelPath: `\\\\192.9.201.30\\طباعة\\دفاتر قسم الإحتياط\\`,
    files: [],
    fileName: "",
    fileBlob: null,
    file: null,
    search: "",
    items: [],
    headers: [
      {
        text: "الرقم العسكري",
        sortable: true,
        value: "الرقم العسكري"
      },
      {
        text: "الدرجة",
        sortable: true,
        value: "الدرجة"
      },
      {
        text: "الإسم",
        sortable: true,
        value: "الاسم" // Group.
      },
      {
        text: "تاريخ الميلاد",
        sortable: true,
        value: "تاريخ الميلاد"
      },
      {
        text: "المؤهل",
        sortable: true,
        value: "المؤهل"
      },
      {
        text: "المحافظة",
        sortable: true,
        value: "المحافظة"
      },
      {
        text: "العنوان",
        sortable: true,
        value: "العنوان"
      },
      {
        text: "الرقم الثلاثي",
        sortable: true,
        value: "الرقم الثلاثي"
      },
      {
        text: "تاريخ إنهاء الخدمة",
        sortable: true,
        value: "تاريخ إنهاء الخدمة"
      },
      {
        text: "تاريخ الإلحاق",
        sortable: true,
        value: "تاريخ الإلحاق"
      },
      {
        text: "رقم التعبئة",
        sortable: true,
        value: "رقم التعبئة"
      }
    ],
    degrees: ["جندى", "عريف مجند", "رقيب مجند", "ملازم مجند"],
    qualifications: ["عليا", "فوق متوسطة", "متوسطة", "عادة"],
    convert_text: "نقل إلى الإحتياط",
    new_units: {
      "361": "ك المقر",
      "423": "ك 115",
      "422": "ك 16",
      "424": "",
      "428": "",
      "382": "",
      "375": "",
      "827": "", // Check
      "439": "",
      "368": "",
      "482": "",
      "372": "",
      "393": "",
      "425": "",
      "529": "",
      "415": "",
      "479": "",
      "478": "",
      "426": "",
      "443": "",
      "373": "", // Check
      "386": "",
      "392": "",
      "482": "",
      "481": "",
      "389": "",
      "411": "",
      "427": "",
      "478": "",
      "388": "",
      "393": "", // Check
      "431": "",
      "422": "",
      "421": "",
      "395": "",
      "543": "",
      "424": "",
      "428": "",
      "384": "",
      "537": "",
      "382": "",
      "375": "",
      "374": "",
      "441": "",
      "527": "",
      "368": "",
      "361": "",
      "533": "",
      "372": "",
      "393": "",
      "529": "",
      "525": "",
      "415": "",
      "479": "",
      "478": "",
      "539": "",
      "443": "",
      "373": "",
      "386": ""
    }
  }),
  methods: {
    async fileNameChanged() {
      if (this.fileName) {
        let path = `${this.excelPath}${this.fileName}`,
          file = await this.api("server/get-file", {
            path
          });
        if (file && file.ok && file.data) {
          console.log(file);
          this.$set(this, "fileBlob", file.data);
        } else {
          this.showError("حدث خطأ أثناء استدعاء الملف من جهاز رئيس الفرع");
        }
      } else {
        // Empty table
      }
    },
    async getAllFiles() {
      let path = this.excelPath,
        files = await this.api("server/get-files", {
          path
        });
      if (files && files.ok && files.data) {
        let excelFiles = files.data.filter(
          f =>
            f.substring(f.length - 4, f.length) == "xlsx" &&
            f.substring(0, 1) !== "~"
        );
        this.$set(this, "files", excelFiles);
      } else {
        this.showError("حدث خطأ أثناء استدعاء الملفات من جهاز رئيس الفرع");
      }
    },
    fixFile(items) {
      items.forEach((item, i) => {});
      return items;
    },
    analyzeFile2() {
      const xlsxParser = require("xlsx-parse-json");
      let file = this.file;
      console.log(file);
      xlsxParser.onFileSelection(file).then(data => {
        let items = data.Sheet1;
        items.filter(item => {
          // Index Number 6,7 [66, 04]
          return (
            item.numnum &&
            `${item.numnum.split("")[6]}${item.numnum.split("")[7]}` !== "66" &&
            `${item.numnum.split("")[6]}${item.numnum.split("")[7]}` !== "04"
          );
          // let num = item.numnum;
          // if (num) {
          //   let num_arr = num.split(""),
          //     scope = `${num_arr[6]}${num_arr[7]}`,
          //     ban = ["66", "04"];
          //   if (!ban.includes(scope)) {
          //     return item;
          //   }
          // } else {
          //   console.log(item);
          // }
        });
        console.log(items);
      });
    },
    analyzeFile() {
      const xlsxParser = require("xlsx-parse-json");
      let file = this.file;
      // let file2 = new File(this.fileBlob, this.fileName, {
      //   type:
      //     "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      // });
      xlsxParser.onFileSelection(file).then(data => {
        let items = this.fixFile(
          this.fixDates(data.Sheet1, [
            "تاريخ الميلاد",
            "تاريخ الإلحاق",
            "تاريخ إنهاء الخدمة"
          ])
        );
        this.$set(this, "items", items);
      });
    }
  }
};
</script>
