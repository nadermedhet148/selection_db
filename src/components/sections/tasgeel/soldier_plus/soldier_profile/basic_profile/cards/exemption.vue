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
            <v-btn
              v-if="isAdmin()"
              class="me-2"
              outlined
              color="error"
              :disabled="selected.length == 0"
            >
              <v-icon>mdi-trash-can</v-icon>
            </v-btn>
            <v-btn color="primary" outlined>
              <v-icon class="me-2">mdi-plus</v-icon>
              إضافة جديد
            </v-btn>
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
        item-key="injuryId"
        show-select
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
        <!-- Non empty -->
        <template v-slot:item.endingDutyStudy="{ item }">
          <v-chip
            v-if="item.endingDutyStudy"
            small
            class="font-weight-bold"
            :color="colors[item.endingDutyStudy]"
          >
            {{ endingDutyStudies[endingDutyStudy] }}
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
        <template v-slot:item.isUnCompleted="{ item }">
          <v-chip
            small
            :color="item.isUnCompleted ? 'error' : 'success'"
            class="font-weight-bold"
          >
            {{ item.isUnCompleted ? "نعم" : "لا" }}
          </v-chip>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "basic-profile-exemption",
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
  methods: {},
  data: () => ({
    tableFilters: {},
    endingDutyStudies: ["لا ينطبق", "رفت جوازي", "رفت وجوبي", "مستمر"],
    loading: false,
    colors: {
      1: "success",
      2: "error",
      3: "orange",
      4: "default"
    },
    selected: [],
    headers: [
      {
        text: "تاريخ التقديم",
        sortable: true,
        value: "exemptionDate"
      },
      {
        text: "سبب الإعفاء",
        sortable: true,
        value: "exemptionReason"
      },
      {
        text: "التصديق",
        sortable: true,
        value: "confirmationId"
      },
      {
        text: "متابع",
        sortable: true,
        value: "isFollowed"
      },
      {
        text: "لم يكتمل تسجيلة",
        sortable: true,
        value: "isUnCompleted"
      }
    ],
    search: ""
  })
};
</script>
