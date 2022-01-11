<template>
  <div>
    <v-card>
      <v-card-title>
        استكمال الرقم القومي
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text class="pt-4">
        <v-row>
          <v-col>
            <v-dialog
              ref="from_date_dialog"
              v-model="search.from_date_model"
              :return-value.sync="search.from_date"
              width="290px"
              persistent
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="search.from_date"
                  prepend-inner-icon="mdi-calendar"
                  label="تاريخ البداية"
                  hint="قم بتحديد تاريخ بداية البحث"
                  persistent-hint
                  readonly
                  filled
                  v-on="on"
                  clearable
                >
                </v-text-field>
              </template>
              <v-date-picker
                ref="date_from_picker"
                v-model="search.from_date"
                scrollable
                color="primary"
              >
                <v-spacer></v-spacer>
                <v-btn
                  color="primary"
                  outlined
                  class="px-6 text-capitalize"
                  @click="search.from_date_model = false"
                  >إلغاء</v-btn
                >
                <v-btn
                  color="primary"
                  class="px-6 text-capitalize"
                  @click="$refs.from_date_dialog.save(search.from_date)"
                  >حفظ</v-btn
                >
              </v-date-picker>
            </v-dialog>
          </v-col>
          <v-col>
            <v-dialog
              ref="to_date_dialog"
              v-model="search.to_date_model"
              :return-value.sync="search.to_date"
              width="290px"
              persistent
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="search.to_date"
                  prepend-inner-icon="mdi-calendar"
                  label="تاريخ النهاية"
                  hint="قم بتحديد تاريخ نهاية البحث"
                  persistent-hint
                  readonly
                  filled
                  v-on="on"
                  clearable
                >
                </v-text-field>
              </template>
              <v-date-picker
                ref="date_to_picker"
                v-model="search.to_date"
                scrollable
                color="primary"
              >
                <v-spacer></v-spacer>
                <v-btn
                  color="primary"
                  outlined
                  class="px-6 text-capitalize"
                  @click="search.to_date_model = false"
                  >إلغاء</v-btn
                >
                <v-btn
                  color="primary"
                  class="px-6 text-capitalize"
                  @click="$refs.to_date_dialog.save(search.to_date)"
                  >حفظ</v-btn
                >
              </v-date-picker>
            </v-dialog>
          </v-col>
        </v-row>
        <!-- <v-file-input
              label="رفع ملف Excel"
              v-model="excel_file"
              filled
              prepend-icon=""
              
              show-size
              counter="1"
              hint="قم بتحديد ملف Excel به عمود واحد فقط, يحتوي على الأرقام العسكرية المراد وضع الرقم القومي لها."
              persistent-hint
              @change="excel_file_changed"
              :disabled="process.begin"
            ></v-file-input> -->
      </v-card-text>
      <v-card-actions class="px-4">
        <v-btn
          @click="searchDatabase"
          v-text="'بحث'"
          color="primary"
          large
          :disabled="
            (result.records.length > 0 && process.begin) ||
              !search.to_date ||
              !search.from_date
          "
          class="px-4"
        ></v-btn>
        <v-btn
          @click="getToken()"
          v-text="'بدأ العملية'"
          color="primary"
          outlined
          large
          :disabled="process.begin || result.records.length < 1"
          class="px-4"
        ></v-btn>
        <v-spacer class="px-1"></v-spacer>
        <v-progress-linear
          :value="process_perc"
          color="primary"
          height="42"
          rounded
        >
          <span class="font-weight-bold white--text">{{ process_perc }}%</span>
        </v-progress-linear>
      </v-card-actions>
      <v-divider class="my-3"></v-divider>
      <v-card-text>
        <!-- <v-text-field
          prepend-inner-icon="mdi-magnify"
          v-model="result.search"
          filled
          dense
        ></v-text-field> -->
        <v-data-table
          loading-text="جارِ تحميل البيانات"
          multi-sort
          :loading="result.loading"
          :items="result.records"
          :headers="result.headers"
          :search.sync="result.search"
          fixed-header
          hide-default-header
        >
          <template v-slot:header="table">
            <table-header-filters
              :items="result.records"
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
              @click.right="copyText(item.militaryId)"
              :to="`/soldiers_plus/${item.militaryId}`"
            >
              {{ item.militaryId }}
            </v-chip>
          </template>
          <template v-slot:item.fullName="{ item }">
            <v-chip
              color="transparent"
              @click.right="copyText(item.fullName)"
              :to="`/soldiers_plus/${item.militaryId}`"
            >
              {{ item.fullName }}
            </v-chip>
          </template>
          <template v-slot:item.nationalId="{ item }">
            <v-chip color="error" v-if="item.nationalId == 'no_nid'">
              لا يوجد
            </v-chip>
            <span v-else>
              {{ item.nationalId }}
            </span>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "national-id",
  data: () => ({
    tableFilters: {},
    search: {
      from_date: null,
      from_date_model: false,
      to_date: null,
      to_date_model: false
    },
    numbers_passed: 0,
    process: {
      begin: false,
      done: false,
      amount_done: 0,
      amount_all: 0
    },
    login_success: false,
    result: {
      loading: false,
      records: [],
      headers: [
        {
          text: "الرقم العسكري",
          sortable: false,
          value: "militaryId"
        },
        {
          text: "الإسم",
          sortable: false,
          value: "fullName"
        },
        {
          text: "الرقم القومي",
          sortable: false,
          value: "nationalId"
        }
      ],
      search: ""
    }
  }),
  sockets: {
    getMyNid(x) {
      let { nid, mid, error } = x;
      // this.result.records.find(r => r.militaryId == mid).nationalId = nid;
      if (error) {
        // this.showError(error);
        console.error(`Error ${mid}: ` + error);
        // if (error == "no_nid") {
        this.upadateDatabase(mid, "بدون");
        // }
      } else {
        this.upadateDatabase(mid, this.fixNumbers(nid));
      }
      let fixed_nid = error ? "no_nid" : this.fixNumbers(nid);
      this.$set(
        this.result.records[this.process.amount_done],
        "nationalId",
        fixed_nid
      );
      this.numbers_passed++;
    },
    saveNewExcel_saved(x) {
      this.showSuccess("تم حفظ الملف");
    }
  },
  computed: {
    process_perc: {
      get() {
        let { amount_done, amount_all } = this.process,
          perc = amount_all > 0 ? (amount_done * 100) / amount_all : 0;
        return perc.toFixed();
      },
      set(v) {
        return v;
      }
    }
  },
  watch: {
    login_success(v) {
      if (v && this.process.begin) {
        this.getNationalIDs();
      }
    },
    numbers_passed(v) {
      if (v) {
        let { amount_all, amount_done } = this.process;
        this.$set(this.process, "amount_done", v);
        if (amount_all == amount_done + 1) {
          console.log("Now true");
          this.$set(this.process, "done", true);
          this.$set(this.process, "begin", false);
          this.$set(this, "login_success", false);
          this.showSuccess("مبروك, أنا ضفتلك الأرقام القومية اللي لقيتها.");
          // console.log(this.process);
        } else {
          this.loadDoc(this.result.records[v].militaryId);
        }
      }
    }
  },
  methods: {
    searchDatabase() {
      this.$set(this.result, "loading", true);
      let { from_date, to_date } = this.search;
      this.api("sections/segelat_website/national_id/get", {
        from_date,
        to_date
      })
        .then(x => {
          let records = x.data;
          this.$set(this.result, "records", records);
          this.$set(this.result, "loading", false);
        })
        .catch(err => {
          console.log(err);
          this.$set(this.result, "loading", false);
        });
    },
    upadateDatabase(mid = "", nid = "") {
      this.api("sections/segelat_website/national_id/set", {
        mid,
        nid
      })
        .then(x => {
          console.log("Number Added: " + nid);
        })
        .catch(err => {
          console.log(err);
        });
    },
    async getMyNid(blob, id = "") {
      console.log("getMyNid: " + id);
      blob
        .arrayBuffer()
        .then(buffer => {
          this.$socket.client.emit("getMyNid", {
            buffer,
            id
          });
        })
        .catch(err => {
          console.log(err);
        });
      // buffer = await fetch(pdf).then(res => res.arrayBuffer());
    },
    saveNewFile() {
      const workbook = new Excel.Workbook(),
        sheet1 = workbook.addWorksheet("sheet1");
      let { records, headers } = this.result;
      sheet1.columns = [
        {
          header: "الرقم العسكري",
          id: "militaryId"
        },
        {
          header: "الرقم القومي",
          id: "nationalId"
        }
      ];
      records.forEach((record, i) => {
        sheet1.getRow(1).values = [record.militaryId, record.nationalId];
      });
      workbook.xlsx
        .writeFile()
        .then(buffer => {
          console.log(buffer);
          let _file = new Blob(buffer, {
            type:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64;"
          });
          console.log(_file);
          let file = window.URL.createObjectURL(_file);
          let a = document.createElement("a");
          a.href = file;
          a.download = "New File.xlsx";
          a.click();
        })
        .catch(err => {
          console.log(err);
        });
    },
    getNationalIDs() {
      console.log("getNationalIDs");
      let { records } = this.result;
      this.$set(this.process, "amount_all", records.length);
      if (records.length > 0) {
        console.log(records[0].militaryId);
        this.loadDoc(records[0].militaryId);
      }
    },
    analyzeFile() {
      const xlsxParser = require("xlsx-parse-json");
      let file = this.excel_file;
      if (file) {
        xlsxParser.onFileSelection(file).then(data => {
          let items = data.Sheet1;
          this.$set(this.result, "records", items);
        });
      } else {
        this.$set(this.result, "records", []);
      }
    },
    excel_file_changed(e) {
      this.analyzeFile();
    },
    loadDoc(id = "") {
      console.log("loadDoc: " + id);
      let xhttp = new XMLHttpRequest(),
        that = this;
      xhttp.responseType = "blob";
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          that.getMyNid(this.response, id);
          // let file = window.URL.createObjectURL(this.response);
          // let a = document.createElement("a");
          // a.href = file;
          // a.download = this.response.name || id;
          // a.click();
          // if (that.login_success) {
          //   that.process.amount_done++;
          // }
        }
      };
      xhttp.onerror = function(error) {
        console.log("Error");
        console.log(error);
        that.showError("تعذر الإتصال بالشبكة العسكرية");
      };
      xhttp.ontimeout = function(error) {
        console.log("Timeout");
        console.log(error);
        that.showError(
          "تعذر الإتصال بالشبكة العسكرية, الرجاء التأكد من وجود اتصال."
        );
      };
      xhttp.open(
        "post",
        "http://1.33.1.150/segelat/OneSeenDocument/OneSeenData",
        true
      );
      xhttp.setRequestHeader(
        "Content-type",
        "application/x-www-form-urlencoded"
      );
      xhttp.send("milNo=" + id);
    },
    getToken(downloadOne = false) {
      let xhttp = new XMLHttpRequest(),
        that = this,
        token = "";
      this.$set(this.process, "begin", true);
      this.$set(this.process, "done", false);
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          let html = document.createElement("html");
          html.innerHTML = this.responseText;
          html.hidden = true;
          let token_inputs = html.getElementsByTagName("input");
          token = token_inputs["__RequestVerificationToken"].value;
          that.login(token, downloadOne);
        }
      };
      xhttp.onerror = function(error) {
        console.log("Error");
        console.log(error);
        that.showError("تعذر الإتصال بالشبكة العسكرية");
      };
      xhttp.ontimeout = function(error) {
        console.log("Timeout");
        console.log(error);
        that.showError(
          "تعذر الإتصال بالشبكة العسكرية, الرجاء التأكد من وجود اتصال."
        );
      };
      xhttp.open("get", "http://1.33.1.150/segelat/Home/Login", true);
      xhttp.setRequestHeader(
        "Content-type",
        "application/x-www-form-urlencoded"
      );
      xhttp.send();
    },
    login(token = "", downloadOne = false) {
      let xhttp = new XMLHttpRequest(),
        that = this;
      this.$set(this.process, "begin", true);
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          if (downloadOne) {
            that.loadDoc(that.s1.mil_id);
          } else {
            that.$set(that, "login_success", true);
          }
        }
      };
      xhttp.onerror = function(error) {
        console.log("Error");
        console.log(error);
        that.showError(error);
      };
      xhttp.ontimeout = function(error) {
        console.log("Timeout");
        console.log(error);
        that.showError(error);
      };
      xhttp.open("post", "http://1.33.1.150/segelat/Home/Login", true);
      xhttp.setRequestHeader(
        "Content-type",
        "application/x-www-form-urlencoded"
      );
      xhttp.send(
        "UserName=10000053&Password=army53&__RequestVerificationToken=" + token
      );
    }
  }
};
</script>
