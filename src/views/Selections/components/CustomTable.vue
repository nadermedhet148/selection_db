<template>
  <v-card class="mt-8">
    <v-card-title>
      {{ title }}

      <v-spacer />

      <printer-menu
        :disabled="data == null || data.length == 0"
        :data="printer"
        :fab="false"
      />
    </v-card-title>

    <v-divider />

    <v-data-table
      :headers="headers.filter(h => h.inTable)"
      :items="data"
      :loading="loading"
      hide-default-header
      fixed-header
      multi-sort
    >
      <template v-slot:header="table">
        <table-header-filters
          :items="data"
          :table="table"
          :filters.sync="filters"
        />
      </template>

      <template v-slot:footer="table">
        <table-footer-filters :filters.sync="filters" :table="table" />
      </template>

      <template v-slot:item.Name="{ item }">
        <v-chip
          color="transparent"
          :to="`/soldiers_plus/${item.ID}`"
          @click.right="copyText(item.Name)"
        >
          {{ item.Name }}
        </v-chip>
      </template>

      <template v-slot:item.ID="{ item }">
        <v-chip
          color="transparent"
          :to="`/soldiers_plus/${item.ID}`"
          @click.right="copyText(item.ID)"
        >
          {{ item.ID }}
        </v-chip>
      </template>

      <template v-slot:item.Name="{ item }">
        <v-chip
          color="transparent"
          :to="`/soldiers_plus/${item.ID}`"
          @click.right="copyText(item.Name)"
        >
          {{ item.Name }}
        </v-chip>
      </template>

      <template v-slot:item.TripleNo="{ item }">
        <v-chip
          color="transparent"
          :to="`/soldiers_plus/${item.ID}`"
          @click.right="copyText(item.TripleNo)"
        >
          {{ item.TripleNo }}
        </v-chip>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
export default {
  name: "CustomTable",
  props: {
    title: {
      type: String,
      default: ""
    },
    loading: {
      type: Boolean,
      default: false
    },
    headers: {
      type: Array,
      default: () => []
    },
    data: {
      type: Array,
      default: () => []
    },
    filters: {
      type: Object,
      default: () => ({})
    },
    printer: {
      type: Object,
      default: () => ({})
    }
  }
};
</script>
