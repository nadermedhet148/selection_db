<template>
  <div class="position-relative display-inline-block">
    <!--
    <v-btn class="px-6" @click="printPerson()" large outlined color="primary">
      <v-icon class="me-3">mdi-printer</v-icon>
      طباعة بروفايل الفرد
    </v-btn>
    -->
    <v-dialog scrollable persistent v-model="model" max-width="450">
      <v-card>
        <v-card-title>
          طباعة بروفايل فرد
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pt-4">
          <div v-if="loading">
            <div>
              جارِ طباعة البيانات الأساسية للفرد
            </div>
            <div>
              <v-progress-linear indeterminate></v-progress-linear>
            </div>
          </div>
          <div v-else>
            <div>
              {{
                success ? "تمت العملية بنجاح" : "عفواً, تعذر طباعة بيانات الفرد"
              }}
            </div>
          </div>
        </v-card-text>
        <v-card-actions class="px-4" v-if="!loading">
          <v-btn @click="model = false" text large color="primary">
            إغلاق
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            v-if="success"
            @click="openExternal(fileLocation.folder)"
            color="primary"
            outlined
            large
            class="px-6"
          >
            فتح المجلد
          </v-btn>
          <v-btn
            v-if="success"
            @click="openExternal(fileLocation.file)"
            color="primary"
            large
            class="px-6"
          >
            فتح الملف
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "PrintConscripteProfile",
  props: {
    militaryId: {
      type: String,
      default: ""
    }
  },
  data: () => ({
    model: false,
    loading: true,
    success: false,
    fileLocation: {}
  }),
  methods: {
    async printPerson() {
      let militaryId = this.militaryId;
      if (militaryId) {
        this.$set(this, "model", true);
        this.$set(this, "loading", true);
        this.$set(this, "success", false);
        let conscripte = await this.api("global/get_one", {
          table: "conscriptes",
          where: {
            militaryId
          },
          include: [
            {
              model: "units"
            },
            {
              model: "degrees"
            },
            {
              model: "zones"
            },
            {
              model: "ignorants"
            },
            {
              model: "ignorantSupporters"
            },
            {
              model: "reductionStates"
            },
            {
              model: "webJobInArmies"
            },
            {
              model: "governorates"
            },
            {
              model: "additionalYears"
            },
            {
              model: "dutyStates"
            },
            {
              model: "dutyCurrentStates"
            },
            {
              model: "webQesms"
            },
            {
              model: "qualifications"
            },
            {
              model: "mobilizationAreas"
            }
          ]
        });
        let c = conscripte.data,
          splitPeriods = ["servicePeriod", "lostPeriod", "clearServicePeriod"],
          fixTime = function(t) {
            if (t && t > 0) {
              let second = t / 1000,
                minute = second / 60,
                hour = minute / 60,
                day = hour / 24;
              return day; // TODO: add [ day - 5 ] because there is 5 days defrence
            }
            return 0;
          },
          cdate = c.conscriptionDate,
          ddate = c.demobilizationDate,
          dsdate = c.demobilizationDateStarter,
          // cdate is the day you joined the army .
          // dsdate is the day you are supposed to leave the army ex: 1/3/2020 for hamdi
          // ddate is the actual day you finished your nantional service ,
          // it must be >= dsdate , if its larger than dsdate then this person has fa2da period.
          safy_moda = new Date(dsdate) - new Date(cdate),
          fa2da = new Date(ddate) - new Date(dsdate),
          all_moda = new Date(ddate) - new Date(cdate);
        c.servicePeriod = fixTime(all_moda);
        c.clearServicePeriod = fixTime(safy_moda);
        c.lostPeriod = fixTime(fa2da);
        splitPeriods.forEach(p => {
          let period = c[p],
            years = Math.floor(Number(period) / (12 * 30)),
            months = Math.floor((Number(period) - years * (12 * 30)) / 30),
            days = Number(period) - years * (12 * 30) - months * 30;
          c[p] = [Math.round(years), Math.round(months), Math.round(days)];
        });
        let obj = {
          lostPeriodDay: c.lostPeriod[2],
          lostPeriodMonth: c.lostPeriod[1],
          lostPeriodYear: c.lostPeriod[0],
          servicePeriodDay: c.servicePeriod[2],
          servicePeriodMonth: c.servicePeriod[1],
          servicePeriodYear: c.servicePeriod[0],
          clearServicePeriodDay: c.clearServicePeriod[2],
          clearServicePeriodMonth: c.clearServicePeriod[1],
          clearServicePeriodYear: c.clearServicePeriod[0],
          militaryId: c.militaryId,
          tripartiteNumber: c.tripartiteNumber
            ? c.tripartiteNumber.replace(/-/g, "/").replace(/\//g, " / ")
            : "",
          fullName: c.fullName,
          degreeFinal:
            c.degree && c.degree.degreeType ? c.degree.degreeType : "",
          qualificationFinal:
            c.qualification && c.qualification.name
              ? c.qualification.name
              : "asdv",
          additionalYearFinal:
            c.additionalYear && c.additionalYear.state
              ? c.additionalYear.state
              : "",
          unitFinal: c.unit && c.unit.unitText ? c.unit.unitText : "",
          zoneFinal: c.zone && c.zone.zoneText ? c.zone.zoneText : "",
          webJobInArmyFinal:
            c.webJobInArmy && c.webJobInArmy.displayedText
              ? c.webJobInArmy.displayedText
              : "",
          governorateFinal:
            c.governorate && c.governorate.displayedText
              ? c.governorate.displayedText
              : "",
          areaFinal:
            c.mobilizationArea && c.mobilizationArea.name
              ? c.mobilizationArea.name
              : "",
          reductionStateFinal:
            c.reductionState && c.reductionState.state
              ? c.reductionState.state
              : "",
          address: c.address ? c.address : "",
          notes: c.notes ? c.notes : "",
          notesDemobilization: c.notesDemobilization
            ? c.notesDemobilization
            : "",
          webQesmFinal:
            c.webQesm && c.webQesm.displayedText ? c.webQesm.displayedText : "",
          dutyStateFinal:
            c.dutyState && c.dutyState.text ? c.dutyState.text : "",
          dutyCurrentStateFinal:
            c.dutyCurrentState && c.dutyCurrentState.text
              ? c.dutyCurrentState.text
              : "",
          ignorantFinal:
            c.ignorant && c.ignorant.displayedText
              ? c.ignorant.displayedText
              : "",
          ignorantSupporterFinal:
            c.ignorantSupporter && c.ignorantSupporter.displayedText
              ? c.ignorantSupporter.displayedText
              : "",
          demobilizationDateStarterDay: c.demobilizationDateStarter
            ? new Date(c.demobilizationDateStarter).getDate()
            : "",
          demobilizationDateStarterMonth: c.demobilizationDateStarter
            ? new Date(c.demobilizationDateStarter).getMonth() + 1
            : "",
          demobilizationDateStarterYear: c.demobilizationDateStarter
            ? new Date(c.demobilizationDateStarter).getFullYear()
            : "",
          demobilizationDateDay: c.demobilizationDate
            ? new Date(c.demobilizationDate).getDate()
            : "",
          demobilizationDateMonth: c.demobilizationDate
            ? new Date(c.demobilizationDate).getMonth() + 1
            : "",
          demobilizationDateYear: c.demobilizationDate
            ? new Date(c.demobilizationDate).getFullYear()
            : "",
          conscriptionDateDay: c.conscriptionDate
            ? new Date(c.conscriptionDate).getDate()
            : "",
          conscriptionDateMonth: c.conscriptionDate
            ? new Date(c.conscriptionDate).getMonth() + 1
            : "",
          conscriptionDateYear: c.conscriptionDate
            ? new Date(c.conscriptionDate).getFullYear()
            : "",
          endingDutyDateDay: c.endingDutyDate
            ? new Date(c.endingDutyDate).getDate()
            : "",
          endingDutyDateMonth: c.endingDutyDate
            ? new Date(c.endingDutyDate).getMonth() + 1
            : "",
          endingDutyDateYear: c.endingDutyDate
            ? new Date(c.endingDutyDate).getFullYear()
            : ""
        };
        this.api(`printer/word/reports`, {
          query: "conscripte/soldier",
          data: obj,
          filename: `${obj.militaryId} - ${
            obj.fullName
          } - ${new Date().getTime()}`,
          isPDF: false
        })
          .then(x => {
            this.$set(this, "fileLocation", x.data);
            this.$set(this, "success", true);
          })
          .catch(error => {
            console.log(error);
            this.$set(this, "fileLocation", {});
            this.$set(this, "success", false);
          })
          .finally(() => {
            this.$set(this, "loading", false);
          });
      }
    }
  }
};
</script>
