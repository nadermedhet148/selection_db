<template>
  <div>
    <v-card class="mt-6">
      <v-card-title>
        احصائات الدفاتر
        <v-spacer></v-spacer>
      </v-card-title>
      <v-divider></v-divider>
      <!-- <v-text-field
        prepend-inner-icon="mdi-magnify"
        v-model.lazy="result.search"
        filled
        dense
      ></v-text-field> -->
      <v-data-table
        :headers="result.headers"
        :items="result.items"
        :loading="result.loading"
        item-key="id"
        fixed-header
        hide-default-header
        multi-sort
      >
        <template v-slot:header="table">
          <table-header-filters
            :items="result.items"
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
        <template v-slot:item.percentage="{ item }">
          <v-chip
            :color="
              item.percentage >= 90
                ? 'success'
                : item.percentage < 90 && item.percentage > 0
                ? 'warning'
                : 'transparent'
            "
          >
            {{ item.percentage + " %" }}
          </v-chip>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "dafater_statistics",
  async mounted() {
    await this.getDafaterStatistics();
  },
  data: () => ({
    tableFilters: {},
    result: {
      items: [],
      headers: [
        { text: "عنوان الدفتر", value: "name", sortable: true },
        { text: "المسجل", value: "assignedTo", sortable: true },
        { text: "معدل التسجيل", value: "percentage", sortable: true }
      ],
      loading: true
    }
  }),
  methods: {
    async getDafaterStatistics() {
      const include = [
        { model: "users" },
        {
          model: "dafaterImages",
          include: [{ model: "dafaterRel" }]
        }
      ];

      let allDafater = await this.api("global/get_all", {
        table: "dafater",
        include
      });
      this.result.loading = false;
      if (
        allDafater &&
        allDafater.ok &&
        allDafater.data &&
        allDafater.data.length
      ) {
        const mapToTable = item => {
          let allImgsCount = item.count,
            assignedImgsCount = 0,
            obj = {
              name: "",
              assignedTo: "",
              percentage: 0
            };
          obj.name = `${item.code} - ${item.name}`;
          obj.assignedTo = item.user ? item.user.realName : "لا يوجد";

          if (item.dafaterImages && item.dafaterImages.length) {
            assignedImgsCount = item.dafaterImages.filter(
              i => i.dafaterRels.length
            ).length;
            obj.percentage = Math.floor(
              (Number(assignedImgsCount) / Number(allImgsCount)) * 100
            );
          }
          return obj;
        };
        this.$set(this.result, "items", [...allDafater.data.map(mapToTable)]);
      }
      console.log(allDafater);
    }
  }
};
</script>
