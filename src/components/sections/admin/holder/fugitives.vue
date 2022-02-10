<template>
  <div>
    <v-dialog max-width="600" persistent v-model="formDialog.open">
      <v-card :loading="formDialog.loading">
        <v-card-title>
          <v-col cols="9">
            تقرير هاربين في فتره :
          </v-col>
          <v-col cols="3">
            <!-- <v-btn color="primary" @click="createReport()">
              عرض التقرير
            </v-btn> -->
          </v-col>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pt-5">
          <v-form ref="form" v-model="valid">
            <v-row>
              <template v-for="(input, i) of inputs">
                <v-col :key="i" :cols="input.cols" style="display: flex">
                  <v-btn
                    style="width: 100%; align-self: center;"
                    v-if="input.type == 'btn'"
                    color="primary"
                    @click="createReport()"
                  >
                    عرض التقرير
                  </v-btn>
                  <v-text-field
                    v-if="input.type == 'textField'"
                    :label="input.label"
                    v-model="input.model"
                    type="number"
                    :rules="input.rule"
                  ></v-text-field>
                  <v-row v-if="input.type == 'checkBox'">
                    <v-col
                      v-for="(type, i) in input.types"
                      :key="i"
                      :cols="type.cols"
                    >
                      <v-checkbox
                        v-model="formDialog.consType"
                        :label="type.label"
                        :value="type.value"
                      >
                      </v-checkbox>
                    </v-col>
                  </v-row>
                </v-col>
              </template>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-container fluid>
      <v-row>
        <v-col cols="6">
          <v-row>
            <v-col cols="12">
              <v-card>
                <v-card-title>
                  {{ this.header }}
                </v-card-title>
              </v-card>
            </v-col>
          </v-row>
          <v-row class="pt-5 pr-5">
            <v-col>
              <v-row>
                <v-col>اجمال الهاربين:</v-col>
                <v-col cols="">{{ stat.horopCounter }}</v-col>
              </v-row>
              <v-row>
                <v-col>اجمالي العوده:</v-col>
                <v-col cols="">{{ stat.awdaCounter }}</v-col>
              </v-row>
            </v-col>
            <v-col>
              <v-row>
                <v-col>اجمالي الجنود:</v-col>
                <v-col cols="">{{ stat.gnoodCounter }}</v-col>
              </v-row>
              <v-row>
                <v-col> :</v-col>
                <v-col cols="">{{ stat.ratbAlyCounter }}</v-col>
              </v-row>
              <!-- debug issues -->
              <!-- <v-row >
                <v-col>ليس لهم رتبه:</v-col>
                <v-col cols="">{{ stat.noDegree }}</v-col>
              </v-row> -->
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-divider class="pt-5"></v-divider>
              <v-card :loading="options.loder" elevation="0">
                <apex-chart
                  v-if="!options.loder"
                  width="100%"
                  high="auto"
                  type="line"
                  :options="options"
                  :series="series"
                ></apex-chart>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
        <v-col>
          <v-simple-table fixed-header height="1080px">
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-center">السنة</th>
                  <th class="text-center">
                    عدد الهاربين
                  </th>
                  <th class="text-center">
                    عوده
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(year, i) in years" :key="i">
                  <td class="text-center">{{ i }}</td>
                  <td class="text-center">
                    {{ years[i].absenceArray.length }}
                  </td>
                  <td class="text-center">{{ years[i].returnedCounter }}</td>
                </tr>
              </tbody>
            </template>
            <v-row>
              <v-col>
                اجمالي سنين البحث:
              </v-col>
              <v-col>
                اجمالي الهاربين:
              </v-col>
              <v-col>
                اجمالي العوده:
              </v-col>
            </v-row>
          </v-simple-table>
        </v-col>
      </v-row>

      <div></div>

      <v-row>
        <v-col></v-col>
        <v-col></v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
const consTypes = {
  rateb3aly: 1,
  askary: 0,
  all: 2
};
const horopStatus = {
  horob: 0,
  awdaa: 1
};

export default {
  name: "fugitives_report",
  // components: {
  //   StatsPie: () => import("@/components/sections/admin/stats/pie.vue"),
  //   StatsLine: () => import("@/components/sections/admin/stats/line.vue")
  // },
  data: () => ({
    options: {
      loder: true,
      chart: {
        id: "horob-chart1",
        background: "#fff",
        sparkline: {
          enabled: false
        }
      },
      xaxis: {
        categories: []
      }
    },

    series: [
      {
        id: horopStatus.horob,
        name: "هروب",
        data: [],
        color: "#FF0820"
      },
      {
        id: horopStatus.awdaa,
        name: "عوده",
        data: [],
        color: "#008345"
      }
    ],
    valid: false,
    literals: {
      show: false,
      startyear: "1994",
      endYear: ""
    },
    formDialog: {
      open: true,
      loading: false,
      consType: []
    },
    inputs: {
      startDtate: {
        type: "textField",
        model: "",
        label: "من سنه",
        cols: 6,
        rule: [
          v => !!v || "يجب ادخال سنه البداية البحث.",
          v => v?.trim().length < 5 || "هذا الرقم لا يصلح"
        ]
      },
      endDtate: {
        type: "textField",
        model: "",
        label: "الي سنه",
        cols: 6,
        rule: [
          v => !!v || ".يجب ادخال سنه نهاية البحث.",
          v => v?.trim().length < 5 || "هذا الرقم لا يصلح"
        ]
      },
      askaryTypes: {
        type: "checkBox",
        model: "dialog.consType",
        cols: 8,
        types: [
          {
            label: "مجند",
            value: consTypes.askary,
            cols: 6
          },
          {
            label: "راتب عالي",
            value: consTypes.rateb3aly,
            cols: 6
          }
        ]
      },
      btn: {
        type: "btn"
      }
    },
    years: [],
    stat: {
      horopCounter: 0,
      awdaCounter: 0,
      gnoodCounter: 0,
      ratbAlyCounter: 0
    }
  }),
  mounted() {
    this.clearData();
    // this.getData("2015", "2020");
  },
  methods: {
    createReport() {
      this.$refs.form.validate();
      if (this.valid) {
        if (this.inputs.endDtate.model < this.inputs.startDtate.model) {
          this.showError("تاريخ نهايه البحث اصغر من تاريخ بدايه البحث.");
          return;
        }
        if (
          this.inputs.startDtate.model > this.todayYear ||
          this.inputs.endDtate.model > this.todayYear
        ) {
          this.showError("لقد بحثت في فتره لم تاتي بعد.");
          return;
        }
        this.$set(this.formDialog, "loading", true);
        this.getData(
          this.inputs.startDtate.model,
          this.inputs.endDtate.model,
          this.formDialog.consType
        );
        this.$set(this.literals, "startyear", this.inputs.startDtate.model);
        this.$set(this.literals, "endYear", this.inputs.endDtate.model);
      }
    },
    getData(startYear, EndYear, type = consTypes.all) {
      this.$set(this.formDialog, "loading", true);
      let data = this.api("sections/horob/get_between_dates", {
        startYear: startYear,
        EndYear: EndYear,
        consType: type
      })
        .then(x => {
          this.$set(this, "years", x.data);
          this.$set(this.literals, "show", true);
          this.getStat();
          console.log("hvvbfh ", this.years);
          this.fillCHart(x.data);
          this.$set(this.formDialog, "open", false);
        })

        .catch(err => {
          console.log("err :: ", err);
          this.showError("حدث خطأ");
        })
        .finally(() => {
          this.$set(this.options, "loder", false);
          this.$set(this.formDialog, "loading", true);
        });
    },
    fillCHart(dataArray) {
      console.log("fillCHart");
      let categories = [];
      let horopArray = [];
      let awdaaArray = [];

      for (let i in dataArray) {
        categories.push(parseInt(i));
        awdaaArray.push(dataArray[i].returnedCounter);
        horopArray.push(dataArray[i].absenceArray.length);
      }

      this.$set(this.options.xaxis, "categories", categories);
      this.$set(this.series[horopStatus.horob], "data", horopArray);
      this.$set(this.series[horopStatus.awdaa], "data", awdaaArray);
      this.$set(this.formDialog, "loading", false);
    },
    clearData() {
      this.$set(this.inputs.startDtate, "model", "1995");
      this.$set(this.inputs.endDtate, "model", "");
      this.$set(this.formDialog, "consType", []);
    },
    openNewDialog() {
      this.clearData();
      this.$set(this.formDialog, "open", true);
      this.$set(this, "years", []);
    },
    getStat() {
      let horopCounter = 0;
      let awdaCounter = 0;
      let gnoodCounter = 0;
      let ratbAlyCounter = 0;

      for (let year in this.years) {
        horopCounter += this.years[year].absenceArray.length;
        awdaCounter += this.years[year].returnedCounter;
        gnoodCounter += this.years[year].absenceArray.filter(
          item => item.degree.degreeId == 2
        ).length;

        // ratbAlyCounter += this.years[year].absenceArray.filter(
        //   item => item.degree.degreeId != 2
        // ).length;
      }

      ratbAlyCounter = horopCounter - gnoodCounter;

      this.$set(this.stat, "horopCounter", horopCounter);
      this.$set(
        this.stat,
        "awdaCounter",
        `${awdaCounter}(%${Math.round((awdaCounter / horopCounter) * 100)})`
      );
      this.$set(this.stat, "gnoodCounter", gnoodCounter);
      this.$set(this.stat, "ratbAlyCounter", ratbAlyCounter);
    }
  },
  computed: {
    todayYear: function() {
      return new Date().getUTCFullYear();
    },
    header: function() {
      let typeString = {
        0: "الجنود",
        1: " ",
        2: "  الجنود"
      };
      let type =
        this.consTypes?.length == 2 || !this.consTypes?.length
          ? 2
          : this.consTypes[0];

      return (
        "كشف " +
        "ب" +
        typeString[type] +
        " " +
        "الهاربين من" +
        " " +
        this.literals.startyear +
        " الي " +
        this.literals.endYear +
        ":"
      );
    }
  }
};
</script>
