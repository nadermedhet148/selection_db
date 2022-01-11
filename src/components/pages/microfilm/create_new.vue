<template>
  <div>
    <!-- <v-card-text>
      <v-row>
        <v-col cols="12" md="4">
          <v-text-field
            label="رقم الفيلم"
            hide-details
            dense
            filled
            v-model="film.number"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="8">
          <v-text-field
            label="عنوان الكشف"
            hide-details
            dense
            filled
            v-model="film.title"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-card-text> -->
    <!-- <v-text-field
      prepend-inner-icon="mdi-magnify"
      hide-details
      v-model="film.search"
      filled
      dense
    >
      <template v-slot:append>
        <div style="transform: translate(0, -3px)">
          <v-btn icon>
            <v-icon>mdi-printer</v-icon>
          </v-btn>
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                ref="btn-delete-selected"
                :disabled="selected_items.length == 0"
                icon
                :color="selected_items.length == 0 ? '' : 'error'"
                v-on="on"
              >
                <v-icon>mdi-trash-can</v-icon>
              </v-btn>
            </template>
            <span>هل تريد حذف المحدد؟</span>
          </v-tooltip>
        </div>
      </template>
    </v-text-field> -->
    <v-data-table
      :items="film.items"
      :headers="headers"
      fixed-header
      show-select
      :search.sync="film.search"
      item-key="militaryId"
      loading-text="جارِ تحميل البيانات"
      disable-sort
      v-model="selected_items"
      :items-per-page="5"
      class="table-max-height"
      hide-default-header
      multi-sort
    >
      <template v-slot:header="table">
        <table-header-filters
          :items="film.items"
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
          @click.right="copyText(item.fullName)"
          :to="`/soldiers_plus/${item.militaryId}`"
        >
          {{ item.fullName }}
        </v-chip>
      </template>
    </v-data-table>
    <v-card-text>
      <v-text-field
        v-model="new_number"
        dense
        label="رقم جديد"
        filled
        prepend-inner-icon="mdi-plus"
        @keypress.enter="addNewNumber"
        :error-messages="film.error"
        :loading="film.loading"
      ></v-text-field>
    </v-card-text>
  </div>
</template>

<style lang="scss" scoped>
.table-max-height {
  max-height: calc(100vh - 450px);
}
</style>

<script>
export default {
  name: "create_new",
  data: () => ({
    tableFilters: {},
    new_number: "",
    film: {
      search: "",
      number: "",
      title: "",
      items: [],
      loading: false,
      error: ""
    },
    headers: [
      {
        text: "الرقم العسكري",
        sortable: true,
        value: "militaryId"
      },
      {
        text: "الإسم",
        sortable: true,
        value: "fullName"
      },
      {
        text: "الوحدة",
        sortable: true,
        value: "unit.unitText"
      },
      {
        text: "تاريخ التسريح",
        sortable: true,
        value: "demobilizationDate"
      }
    ],
    selected_items: []
  }),
  watch: {
    new_number(v) {
      if (this.film.error.length > 0) {
        this.$set(this.film, "error", "");
      }
      if (v && v.length == 13) {
        this.$nextTick(() => {
          let intVal = setInterval(() => {
            this.$nextTick(() => {
              this.addNewNumber();
            });
            clearInterval(intVal);
          }, 500);
        });
      }
    }
  },
  methods: {
    addNewNumber() {
      this.$set(this.film, "loading", true);
      let mid = this.new_number,
        isExists = this.film.items.find(i => i.militaryId == mid);
      if (isExists) {
        this.$set(this.film, "error", "هذا الرقم موجود بالفعل");
        this.$set(this.film, "loading", false);
        return;
      }
      this.api("global/get_one", {
        table: "conscriptes",
        where: {
          militaryId: mid
        },
        attrs: ["fullName", "militaryId", "demobilizationDate"],
        include: [
          {
            model: "units",
            attrs: ["unitText"]
          }
        ]
      })
        .then(x => {
          console.log(x.data);
          let isExists_again = this.film.items.find(i => i.militaryId == mid);
          if (isExists_again) {
            this.$set(this.film, "error", "هذا الرقم موجود بالفعل");
          } else {
            this.$set(
              this.film.items,
              this.film.items.length,
              this.fixDates([x.data], ["demobilizationDate"])[0]
            );
          }
        })
        .catch(err => {
          if (err.data == null) {
            this.$set(this.film, "error", "الرقم غير صحيح");
          } else {
            this.showError(err);
          }
          console.log(err);
        })
        .finally(() => {
          this.$set(this.film, "loading", false);
        });
    }
  }
};
</script>
