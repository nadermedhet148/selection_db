<template>
  <div>
    <v-card :loading="loading" :disabled="loading">
      <v-text-field
        prepend-inner-icon="mdi-magnify"
        v-model.lazy="search"
        filled
        dense
      ></v-text-field>
      <v-data-table
        class="empty-cells-table"
        :items="externals"
        :headers="headers"
        :search.sync="search"
        fixed-header
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
        <template v-slot:item.actions="{ item }">
          <v-btn outlined :to="`/fugitives/${item.militaryId}`">
            عرض الهروب
          </v-btn>
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
        <template v-slot:item.returnDate="{ item }">
          {{ item.returnDate ? item.returnDate : "--" }}
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "basic-profile-fugitives",
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
    loading: false,
    headers: [
      {
        text: "تاريخ الغياب",
        sortable: true,
        value: "absenceDate"
      },
      {
        text: "تاريخ الشطب",
        sortable: true,
        value: "strikeoffDate"
      },
      {
        text: "تاريخ العودة",
        sortable: true,
        value: "returnDate"
      },
      {
        text: "",
        sortable: false,
        value: "actions"
      }
    ],
    search: ""
  })
};
</script>
