<template>
  <div class="">
    <v-card>
      <v-card-title>
        Functions
        <v-spacer></v-spacer>
        <v-btn icon @click="addFunction()">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-card-title>
      <v-divider></v-divider>
      <!-- <v-text-field
        prepend-inner-icon="mdi-magnify"
        v-model.lazy="result.search"
        filled
        dense
      ></v-text-field> -->
      <v-data-table
        :loading="result.loading"
        :search.sync="result.search"
        :headers="result.headers"
        :items="result.items"
        fixed-header
        v-model="result.selected"
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
        <template v-slot:item.actions="{ item }">
          <v-btn color="primary" icon @click="updateFunction(item)">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </template>
        <template v-slot:item.method="{ item }">
          <span dir="ltr"> {{ item.method }}() </span>
        </template>
      </v-data-table>
    </v-card>
    <v-dialog
      v-if="isCurrentRoute(componentName)"
      class=""
      scrollable
      persistent
      v-model="newFunction.model"
      max-width="450"
    >
      <v-card
        class=""
        :loading="newFunction.loading"
        :disabled="newFunction.loading"
      >
        <v-card-title class="">
          {{ newFunction.type == "add" ? "إضافة" : "تعديل" }} Function
          <v-spacer></v-spacer>
          <v-btn icon @click="newFunction.model = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class=" pt-6">
          <template v-for="(input, i) in inputs">
            <v-text-field
              :key="i"
              :label="input.label"
              v-model="newFunction[input.model]"
              :hint="input.hint"
              :hide-details="input.hint ? false : true"
              :persistent-hint="input.hint ? true : false"
              filled
              class="mb-4 "
            ></v-text-field>
          </template>
        </v-card-text>
        <v-card-actions class=" px-4">
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            outlined
            v-text="'عودة'"
            class="px-6"
            @click="newFunction.model = false"
            large
          ></v-btn>
          <v-btn
            color="primary"
            v-text="`${newFunction.type == 'add' ? 'إضافة جديد' : 'تعديل'}`"
            class="px-6"
            @click="updateFunction({}, false)"
            large
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "operation-functions",
  mounted() {
    this.getFunctions();
  },
  data: () => ({
    componentName: "admin_operations",
    tableFilters: {},
    result: {
      loading: false,
      search: "",
      headers: [
        {
          text: "ID",
          value: "id",
          sortable: false
        },
        {
          text: "Name",
          value: "name",
          sortable: false
        },
        {
          text: "Stop Type",
          value: "stopType",
          sortable: false
        },
        {
          text: "Method",
          value: "method",
          sortable: false
        },
        {
          text: "",
          value: "actions",
          sortable: false
        }
      ],
      items: [],
      selected: []
    },
    newFunction: {
      id: "",
      name: "",
      stopType: "",
      method: "",
      loading: false,
      model: false,
      type: "add"
    },
    inputs: [
      {
        label: "Name",
        model: "name"
      },
      {
        label: "Stop Type",
        model: "stopType"
      },
      {
        label: "Method",
        model: "method"
      }
    ]
  }),
  methods: {
    async updateFunction(item = {}, open = true) {
      if (open) {
        this.$set(this.newFunction, "type", "edit");
        this.$set(this.newFunction, "id", item.id);
        this.$set(this.newFunction, "name", item.name);
        this.$set(this.newFunction, "stopType", item.stopType);
        this.$set(this.newFunction, "method", item.method);
        this.$set(this.newFunction, "loading", false);
        this.$set(this.newFunction, "model", true);
      } else {
        this.$set(this.newFunction, "loading", true);
        let fun = this.newFunction;
        if (fun.type == "add") {
          delete fun.id;
        }
        let db_fun = await this.api(
          `global/${fun.type == "add" ? "create" : "update"}_one`,
          {
            table: "webOperations",
            where:
              fun.type == "add"
                ? fun
                : {
                    id: fun.id
                  },
            update: fun
          }
        );
        this.$set(this.newFunction, "loading", false);
        this.$set(this.newFunction, "model", false);
        this.getFunctions();
      }
    },
    addFunction() {
      this.$set(this.newFunction, "type", "add");
      this.$set(this.newFunction, "id", "");
      this.$set(this.newFunction, "name", "");
      this.$set(this.newFunction, "stopType", "");
      this.$set(this.newFunction, "method", "");
      this.$set(this.newFunction, "loading", false);
      this.$set(this.newFunction, "model", true);
    },
    async getFunctions() {
      this.$set(this.result, "loading", true);
      let functions = await this.api("global/get_all", {
        table: "webOperations"
      });
      this.$set(this.result, "items", functions.data);
      this.$set(this.result, "loading", false);
    }
  }
};
</script>
