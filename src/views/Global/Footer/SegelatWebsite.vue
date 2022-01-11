<template>
  <div>
    <v-row>
      <v-col cols="12" lg="6">
        <v-card>
          <v-card-title>
            1 س لفرد
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-text-field
              v-model="s1.mil_id"
              filled
              hint="أكتب الرقم العسكري للفرد"
              persistent-hint
              label="الرقم العسكري"
              v-mask="'#############'"
              counter="13"
              @keypress.enter="getToken(true)"
            ></v-text-field>
          </v-card-text>
          <v-card-actions class="px-4">
            <v-btn
              @click="getToken(true)"
              class="px-4"
              v-text="'تحميل'"
              large
              :disabled="!s1.mil_id || s1.mil_id.trim().length < 1"
              color="primary"
            ></v-btn>
            <v-btn
              :disabled="!s1.mil_id || s1.mil_id.trim().length < 1"
              class="px-4"
              v-text="'مقارنة بقاعدة البيانات المحلية'"
              large
              color="primary"
              outlined
            ></v-btn>
          </v-card-actions>
        </v-card>
        <conscription-date class="mt-6"></conscription-date>
      </v-col>
      <v-col cols="12" lg="6">
        <national-id></national-id>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import Excel from "exceljs";
export default {
  components: {
    NationalId: () =>
      import("@/components/pages/segelat_website/national_id.vue"),
    ConscriptionDate: () =>
      import("@/components/pages/segelat_website/conscription_date.vue")
  },
  name: "segelat_website",
  data: () => ({
    s1: {
      mil_id: ""
    },
    excel_file: null
  }),
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
