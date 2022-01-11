<template>
  <div>
    <v-card :loading="loading" :disabled="loading">
      <v-row class="py-0 my-0">
        <v-col class="py-0 my-0">
          <v-text-field
            prepend-inner-icon="mdi-magnify"
            v-model.lazy="search"
            filled
            dense
          >
          </v-text-field>
        </v-col>
        <v-col cols="auto" class="my-0 py-0">
          <div class="pe-4 pt-1">
            <!-- <v-btn
              class="me-2"
              outlined
              color="error"
              v-if="isAdmin()"
              :disabled="selected.length == 0"
            >
              <v-icon>mdi-trash-can</v-icon>
            </v-btn> -->
            <!-- <v-btn color="primary" outlined>
              <v-icon class="me-2">mdi-plus</v-icon>
              إضافة جديد
            </v-btn> -->
          </div>
        </v-col>
      </v-row>
      <v-data-table
        class="empty-cells-table"
        :items="externals"
        :headers="headers"
        :search.sync="search"
        fixed-header
        v-model="selected"
        item-key="committeeId"
        hide-default-header
        multi-sort
      >
        <template v-slot:header="table">
          <table-header-filters
            :items="externals"
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

        <!-- Non empty قرار اللجنه -->
        <template v-slot:item.committee.displayedText="{ item }">
          <v-chip
            v-if="item.committee && item.comitDecisionId"
            small
            class="font-weight-bold"
            :color="colors[item.committee.id]"
          >
            {{ item.committee.displayedText }}
          </v-chip>
        </template>

        <template v-slot:item.isFollowed="{ item }">
          <v-chip
            small
            :color="item.isFollowed ? 'error' : 'success'"
            class="font-weight-bold"
          >
            {{ item.isFollowed ? "نعم" : "لا" }}
          </v-chip>
        </template>

        <template v-slot:item.injury.diagnosis="{ item }">
          <div v-if="item.injury && item.injury.diagnosis">
            {{ item.injury.diagnosis | filterStrLimit(subjectLimit) }}

            <v-btn
              @click="openDiagnosisDialog(item.injury)"
              icon
              small
              depressed
            >
              <v-icon>
                mdi-window-{{ item.subjectShown ? "restore" : "maximize" }}
              </v-icon>
            </v-btn>
          </div>
          <div v-else>
            لا يوجد
          </div>
        </template>

        <!-- <template v-slot:item.isUnCompleted="{ item }">
          <v-chip
            small
            :color="item.isUnCompleted ? 'error' : 'success'"
            class="font-weight-bold"
          >
            {{ item.isUnCompleted ? "نعم" : "لا" }}
          </v-chip>
        </template> -->

        <template v-slot:item.actions="{ item }">
          <v-chip class="transparent">
            <v-btn
              v-if="isTasgilOrEnhaa() || isAdmin()"
              color="primary"
              icon
              @click="openItemDialog(item)"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn
              v-if="isAdmin()"
              color="error"
              icon
              @click="openDeleteDialog(item)"
            >
              <v-icon>mdi-trash-can</v-icon>
            </v-btn>
          </v-chip>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="itemDialog.model" persistent scrollable max-width="850">
      <v-card :loading="itemDialog.loading" :disabled="itemDialog.loading">
        <v-card-title class="white--text primary">
          تعديل لجنة طبية
          <v-spacer></v-spacer>
          <v-btn icon @click="itemDialog.model = false" dark>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>

        <v-card-text class="pt-6">
          <v-row>
            <template v-for="(f, i) in itemDialog.fields">
              <v-col :key="i" cols="12" :lg="f.fullWidth ? '12' : '6'">
                <v-text-field
                  v-if="!f.type || ['text', 'date'].includes(f.type)"
                  filled
                  :type="f.type == 'date' ? 'date' : 'text'"
                  :label="f.label"
                  :hint="f.hint"
                  v-model="data[f.model]"
                  :persistent-hint="f.hint ? true : false"
                  :hide-details="f.hint ? false : true"
                  :clearable="!f.readonly"
                  :readonly="f.readonly"
                ></v-text-field>
                <v-autocomplete
                  v-if="f.type == 'select'"
                  filled
                  :readonly="f.readonly"
                  :label="f.label"
                  :hint="f.hint"
                  :persistent-hint="f.hint ? true : false"
                  :hide-details="f.hint ? false : true"
                  :items="tables[f.model].data"
                  v-model="data[f.model]"
                  item-text="text"
                  item-value="id"
                  :loading="tables[f.model].loading"
                  :clearable="!f.readonly"
                  :error-messages="tables[f.model].error"
                ></v-autocomplete>
                <v-textarea
                  v-else-if="f.type == 'textarea'"
                  filled
                  v-model="data[f.model]"
                  :label="f.label"
                  :hint="f.hint"
                  :persistent-hint="f.hint ? true : false"
                  :hide-details="f.hint ? false : true"
                  auto-grow
                  :readonly="f.readonly"
                  :clearable="!f.readonly"
                ></v-textarea>
              </v-col>
            </template>
          </v-row>
        </v-card-text>
        <v-card-actions class="px-4">
          <v-spacer></v-spacer>
          <v-btn
            @click="closeDialog()"
            color="primary"
            outlined
            large
            class="px-6"
          >
            رجوع
          </v-btn>
          <v-btn color="primary" large class="px-6" @click="saveEdite()">
            تعديل
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="deleteDialog.model" scrollable max-width="450">
      <v-card :loading="deleteDialog.loading" :disabled="deleteDialog.loading">
        <v-card-title class="error white--text">
          حذف المجلس الطبي
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text
          v-if="
            deleteDialog.item &&
              (deleteDialog.item.conscripte || deleteDialog.item.name)
          "
          class="pt-4"
        >
          هل تريد بالتأكيد حذف المجلس الطبي لـ
          <span
            class="error--text"
            v-text="
              deleteDialog.item.conscripte
                ? deleteDialog.item.conscripte.fullName
                : deleteDialog.item.name
            "
          ></span>
        </v-card-text>
        <v-card-actions class="px-4">
          <v-spacer></v-spacer>
          <v-btn
            outlined
            large
            color="error"
            class="px-6"
            v-text="'رجوع'"
            @click="deleteDialog.model = false"
          ></v-btn>
          <v-btn
            large
            color="error"
            class="px-6"
            v-text="'حذف المجلس الطبي'"
            @click="deleteSelected()"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="diagnosisDialog.model" max-width="450">
      <v-card>
        <v-card-title> تشخيص الأصابة </v-card-title>
        <v-card-text>
          {{ diagnosisDialog.diagnosis }}
        </v-card-text>
        <v-card-actions style="justify-content: flex-end">
          <v-btn
            color="error"
            v-text="'رجوع'"
            icon
            large
            @click="diagnosisDialog.model = false"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "basic-profile-medical-committees",
  props: {
    externals: {
      type: Array,
      default: () => []
    },
    conscripte: {
      type: Object,
      default: () => ({})
    }
  },
  mounted() {
    this.initDropBoxItems();
  },
  filters: {
    filterStrLimit(str, limit) {
      return `${str.length <= limit ? str : str.substr(0, limit) + ".."}`;
    }
  },
  methods: {
    openDiagnosisDialog(injury) {
      this.$set(this, "diagnosisDialog", {});
      this.$set(this.diagnosisDialog, "model", true);
      this.$set(this.diagnosisDialog, "item", injury);
      this.$set(this.diagnosisDialog, "diagnosis", injury?.diagnosis);
    },
    initDropBoxItems() {
      console.log("ex :", this.externals);
      console.log("tables : ", this.tables);
      for (const key in this.tables) {
        let { table, text, value } = this.tables[key];
        this.$set(this.tables[key], "loading", true);
        this.api("global/get_all", {
          table,
          attrs: [
            [text, "text"],
            [value, "id"]
          ]
        })
          .then(x => {
            this.$set(this.tables[key], "data", x.data);
          })
          .catch(err => {
            this.$set(
              this.table[key],
              "error",
              "حدث خطأ اثناء استدعاء البيانات"
            );
          })
          .finally(() => {
            this.$set(this.tables[key], "loading", false);
          });
      }
    },
    initData(item) {
      this.$set(this, "data", { ...item });
      if (!this.conscripte.stateId) {
        this.data.stateId = this.conscripte.stateIdCurrent == 1 ? 101 : "";
      } else {
        this.data.stateId = this.conscripte.stateId;
      }
      this.$set(this.data, "fullName", this.conscripte.fullName);
      this.$set(this.data, "subjectShown", false);

      console.log("initData(item) => this.data ", this.data);
    },
    openItemDialog(item) {
      // console.log("item after open dialog : ", item);
      this.$set(this, "data", {});
      this.initData(item);
      this.$set(this.itemDialog, "model", true);
    },
    closeDialog() {
      this.$set(this.itemDialog, "model", false);
    },
    openDeleteDialog(item) {
      this.$set(this.deleteDialog, "item", item);
      this.$set(this.deleteDialog, "model", true);
    },
    async deleteSelected() {
      this.$set(this.deleteDialog, "loading", true);
      let deleteItems = await this.api("global/delete_all", {
        table: "medicalCommittees",
        where: { committeeId: this.deleteDialog.item.committeeId }
      });
      let index = this.externals.findIndex(
        item => item.committeeId == this.deleteDialog.item.committeeId
      );
      if (deleteItems.ok && index != -1) {
        this.externals.splice(index, 1);
      }
      this.$set(this.deleteDialog, "loading", false);
      this.$set(this.deleteDialog, "model", false);
      this.$set(this.deleteDialog, "item", {});
    },
    saveEdite() {
      this.$set(this.itemDialog, "loading", true);
      // i don't know why at this moment but
      // there's two props for MC-ID and sql need both to work
      this.$set(
        this.data,
        "MedicalCommitteeTypeID",
        this.data.medicalCommitteeTypeId
      );

      if (
        this.data.comitDecisionId &&
        this.data.medicalCommitteeTypeId &&
        this.data.committeeDate &&
        this.data.committeeNumber
      ) {
        this.data.isFollowed = false;
      }

      let update = this.api("global/update_one", {
        table: "medicalCommittees",
        where: { committeeId: this.data.committeeId },
        update: this.data
      })
        .then(x => {
          console.log("x", x);
          let index = this.externals.findIndex(
            item => item.committeeId == this.data.committeeId
          );

          //comitDecisionId
          let comitDecisionIdIndex = this.tables.comitDecisionId.data.findIndex(
            item => item.id == this.data.comitDecisionId
          );

          let MCTypeIdIndex = this.tables.medicalCommitteeTypeId.data.findIndex(
            item => item.id == this.data.medicalCommitteeTypeId
          );

          console.log("MCTypeIdIndex", MCTypeIdIndex);

          if (MCTypeIdIndex != -1) {
            let data = this.tables.medicalCommitteeTypeId.data[MCTypeIdIndex];
            let medicalCommitteeType = {
              displayedText: data.text,
              id: data.id
            };
            this.$set(this.data, "medicalCommitteeType", medicalCommitteeType);
          }

          if (comitDecisionIdIndex != -1) {
            let data = this.tables.comitDecisionId.data[comitDecisionIdIndex];
            let committee = {
              displayedText: data.text,
              id: data.id
            };
            console.log("committee", committee);
            this.$set(this.data, "committee", committee);
          }

          if (index != -1 && x.ok) {
            this.$set(this.externals, index, this.data);
          }
        })
        .catch(e => {
          console.log(e);
        })
        .finally(() => {
          this.$set(this.itemDialog, "loading", false);
        });

      this.closeDialog();
    }
  },

  data: () => ({
    diagnosisDialog: {
      model: false,
      diagnosis: "",
      item: {}
    },
    subjectLimit: 10,
    deleteDialog: {
      model: false,
      loading: false,
      item: {}
    },
    tableFilters: {},
    loading: false,
    search: "",
    colors: {
      1: "success",
      2: "error",
      5: "orange"
    },
    data: {
      // committeeId: "",
      // militaryId: "",
      // fullName: "",
      // conscriptionDate: "",
      // demobilizationDate: "",
      // unitId: "",
      // stateId: "",
      // medicalCommitteeTypeId: "",
      // date: "",
      // committeeNumber: "",
      // comitDecisionId: "",
      // notes: "",
      // isFollowed,
      // MedicalCommitteeTypeID
    },
    itemDialog: {
      model: false,
      loading: false,
      militaryId: "",
      fields: [
        {
          label: "الإسم",
          type: "text",
          model: "fullName",
          readonly: true
        },
        {
          label: "حالة الفرد",
          type: "select",
          model: "stateId",
          readonly: true
        },
        //
        {
          label: "نوع اللجنة",
          type: "select",
          model: "medicalCommitteeTypeId"
        },
        {
          label: "تاريخ اللجنة",
          type: "date",
          model: "committeeDate"
        },
        {
          label: "رقم اللجنة",
          type: "text",
          model: "committeeNumber"
        },
        {
          label: "قرار اللجنة",
          type: "select",
          model: "comitDecisionId"
        },
        {
          label: "تشخيص المجلس الطبي",
          type: "textarea",
          model: "notes",
          fullWidth: true
        }
      ]
    },
    selected: [],
    headers: [
      {
        text: "رقم اللجنة",
        sortable: true,
        value: "committeeNumber"
      },
      {
        text: "تاريخ اللجنة",
        sortable: true,
        value: "committeeDate"
      },
      {
        text: "نوع اللجنة",
        sortable: true,
        value: "medicalCommitteeType.displayedText"
      },
      {
        text: "تشخيص المجلص الطبي",
        sortable: true,
        value: "notes"
      },
      {
        text: "تشخيص الأصابة",
        sortable: false,
        value: "injury.diagnosis"
      },
      // {
      //   text: "قرار اللجنة",
      //   sortable: true,
      //   value: "committee.displayedText"
      // },
      {
        text: "متابع",
        sortable: true,
        value: "isFollowed"
      },
      {
        text: "",
        sortable: false,
        value: "actions"
      }
    ],
    tables: {
      stateId: {
        table: "dutyStates",
        text: "text",
        value: "stateId",
        data: null,
        loading: null,
        error: null
      },
      medicalCommitteeTypeId: {
        table: "medicalCommitteeTypes",
        text: "displayedText",
        value: "id",
        data: null,
        loading: null,
        error: null
      },
      comitDecisionId: {
        table: "committees",
        text: "displayedText",
        value: "id",
        data: null,
        loading: null,
        error: null
      }
    }
  })
};
</script>
