<template>
  <div tabindex="0" class="no-focus profile">
    <template v-for="(group, i) in groups">
      <v-card v-if="group.items.length > 0" class="mb-8" :key="i">
        <v-card-title
          class="primary white--text"
          v-text="group.title"
        ></v-card-title>
        <v-card-subtitle v-text="group.desc"></v-card-subtitle>
        <v-divider></v-divider>
        <v-card-text>
          <v-row>
            <template v-for="(item, ii) in group.items">
              <v-col :key="ii" cols="6" lg="4" xl="3">
                <v-text-field
                  v-model="conscripte[item.model]"
                  :label="item.label"
                  filled
                  v-if="item.type == 'text'"
                  disabled
                  outlined
                ></v-text-field>

                <v-card v-if="item.type == 'file'">
                  <div>
                    {{ item.label }}
                  </div>

                  <v-chip color="transparent">
                    <v-btn
                      icon
                      @click="openFile(conscripte[item.model])"
                      color="primary"
                    >
                      <v-icon>mdi-file</v-icon>
                    </v-btn>
                  </v-chip>
                </v-card>
              </v-col>
            </template>
          </v-row>
        </v-card-text>
      </v-card>
    </template>
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

<style>
.profile .v-input__slot {
  background: none !important;
}
.profile .v-label {
  color: #000 !important;
  font-size: 16px !important;
}
.profile
  .theme--light.v-text-field--outlined:not(.v-input--is-focused).v-input--is-disabled
  > .v-input__control
  > .v-input__slot
  fieldset {
  color: var(--v-primary-base) !important;
}

.theme--light.v-input input,
.theme--light.v-input textarea {
  color: rgba(0, 0, 0, 0.87) !important ;
}

.profile .v-sheet.v-card:not(.v-sheet--outlined) {
  box-shadow: none;
}
</style>
<script>
const constants = require("../../Constant").default;
const _ = require("lodash");
export default {
  name: "new-profile",
  props: {
    conscripteObJ: {
      type: Object,
      default: () => {}
    }
  },
  mounted() {
    this.conscripte = {
      ...this.conscripteObJ,
      weapon: (this.conscripteObJ.Weapon || {}).Weapon,
      Markez_Tadreb: (this.conscripteObJ.Weapon || {}).Markez_Tadreb,
      unit: (this.conscripteObJ.Unit || {}).Unit,
      duty: (this.conscripteObJ.Duty || {}).Duty,
      centre: (this.conscripteObJ.Centre || {}).Centre,
      city: (this.conscripteObJ.City || {}).City
    };
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
            type: "text"
          },
          {
            model: "Name",
            label: "الإسم الكامل",
            type: "text"
          },
          {
            model: "TripleNo",
            label: "الرقم الثلاثي",
            type: "text"
          },
          {
            model: "KnowledgeLevel",
            label: "المؤهل",
            type: "text"
          },

          {
            model: "RecuStage",
            label: "المرحلة التجنيدية",
            type: "text"
          },
          {
            model: "RecuRegion",
            label: "مكان التجنيد",
            type: "text"
          },
          {
            model: "IdentityNo",
            label: " الرقم القومي",
            type: "text"
          },
          {
            model: "BirthDate",
            label: " تاريخ الميلاد",
            type: "text"
          },
          {
            model: "ArrivalDate",
            label: "تاريخ الوصول",
            type: "text"
          },
          {
            model: "TestDate",
            label: " تاريخ الاختبار",
            type: "text"
          },
          {
            model: "Centre",
            label: " المركز ",
            type: "text"
          },
          {
            model: "Religion",
            label: "الديانة",
            type: "text"
          },
          {
            model: "Unit",
            label: "الوحدة",
            type: "text"
          },
          {
            model: "Brigade",
            label: "السرية",
            type: "text"
          },
          {
            model: "VideoPath",
            label: "مكان فيديو المقابلة",
            type: "file"
          }
        ]
      }
    ],

    loading: false
  }),
  watch: {},
  methods: {
    async findConscripte() {
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
      });
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
        models.forEach(model => {
          this.$set(this.conscripte, model, data[model]);
        });
      }
    },
    async openFile(path) {
      await this.api("server/open-item", {
        path
      });
    }
  }
};
</script>
