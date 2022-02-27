<template>
  <div class="position-relative display-inline-block">
    <v-btn class="px-6" @click="printPerson()" large outlined color="primary">
      <v-icon class="me-3">mdi-printer</v-icon>
      طباعة بروفايل الفرد
    </v-btn>

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
      let ID = this.militaryId;
      if (ID) {
        this.$set(this, "model", true);
        this.$set(this, "loading", true);
        this.$set(this, "success", false);
        let conscripte = await this.api("global/get_one", {
          table: "Soldier",
          where: {
            ID
          }
        });

        const data = {
          ...conscripte.data,

          TestDate: conscripte.data.TestDate
            ? new Date(conscripte.data.TestDate).toISOString().split("T")[0]
            : null,
          ArrivalDate: conscripte.data.ArrivalDate
            ? new Date(conscripte.data.ArrivalDate).toISOString().split("T")[0]
            : "",
          BirthDate: conscripte.data.BirthDate
            ? new Date(conscripte.data.BirthDate).toISOString().split("T")[0]
            : null
        };
        [
          "ID",
          "Name",
          "TripleNo",
          "KnowledgeLevel",
          "RecuStage",
          "RecuRegion",
          "IdentityNo",
          "BirthDate",
          "ArrivalDate",
          "TestDate",
          "Centre",
          "Religion",
          "Unit",
          "Brigade",
          "VideoPath",
          "Job",
          "FatherJob",
          "Tele",
          "BrothersCount",
          "RelationshipType",
          "Note",
          "Apprance",
          "FocusEvent",
          "Mood",
          "Talking",
          "Drugs",
          "GoHospitalBefore",
          "HospitalName",
          "TakeDrugsBefore",
          "DrugName",
          "MeetingMaker",
          "MeetingDescions"
        ].forEach(key => {
          if (!data[key]) {
            data[key] = "";
          }
        });
        this.api(`printer/word/reports`, {
          query: "soldier",
          data,
          filename: `${ID} - ${conscripte.data.Name} - ${new Date().getTime()}`,
          isPDF: false
        })
          .then(x => {
            this.$set(this, "fileLocation", x.data);
            this.$set(this, "success", true);
          })
          .catch(error => {
            console.log(error);
            this.$set(this, "fileLocation", {});
            this.$set(this, "error", false);
          })
          .finally(() => {
            this.$set(this, "loading", false);
          });
      }
    }
  }
};
</script>
