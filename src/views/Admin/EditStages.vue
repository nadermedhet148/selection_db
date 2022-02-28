<template>
  <div>
    <v-card :loading="searchLoading" :disabled="searchLoading">
      <v-card-title>
        <v-spacer></v-spacer>
        <v-btn @click="actionAdd()" large outlined color="primary">
          إضافة مرحلة
        </v-btn>
      </v-card-title>
      <v-divider></v-divider>
    </v-card>

    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :items="mainTable.items"
      :title="'المراحل'"
    >
    </table-bulider>

    <v-dialog
      persistent
      v-model="createdObject.model"
      scrollable
      max-width="750"
    >
      <v-card
        :loading="createdObject.loading"
        :disabled="createdObject.loading"
      >
        <v-card-title>
          <v-spacer></v-spacer>
          <v-btn @click="createdObject.model = false" icon>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-row>
            <template
              v-for="(h, i) in mainTable.headers
                .filter(h => h.inModel)
                .sort((a, b) => a.sort - b.sort)"
            >
              <v-col :cols="h.cols ? h.cols : '6'" :key="i">
                <v-text-field
                  v-if="!h.type || ['text', 'date'].includes(h.type)"
                  filled
                  :type="h.type == 'date' ? 'date' : 'text'"
                  :label="h.text"
                  v-model="note[h.searchValue]"
                  :hide-details="h.hint ? false : true"
                  :persistent-hint="h.hint ? true : false"
                  :readonly="h.readonly"
                ></v-text-field>
                <v-autocomplete
                  v-else-if="h.type == 'select'"
                  filled
                  :label="h.text"
                  :multiple="true"
                  :readonly="h.readonly"
                  v-model="note[h.searchValue]"
                  :hide-details="h.hint ? false : true"
                  :persistent-hint="h.hint ? true : false"
                  :items="
                    selects[h.searchValue] ? selects[h.searchValue].data : []
                  "
                  :item-value="
                    selects[h.searchValue]
                      ? selects[h.searchValue].value
                      : 'value'
                  "
                  :item-text="
                    selects[h.searchValue]
                      ? selects[h.searchValue].text
                      : 'text'
                  "
                ></v-autocomplete>
                <v-textarea
                  v-else-if="h.type == 'textarea'"
                  filled
                  :label="h.text"
                  v-model="note[h.searchValue]"
                  :hide-details="h.hint ? false : true"
                  :persistent-hint="h.hint ? true : false"
                  auto-grow
                  :readonly="h.readonly"
                  rows="1"
                ></v-textarea>

                <v-checkbox
                  v-else-if="h.type == 'checkbox'"
                  v-model="note[h.searchValue]"
                  :label="h.text"
                  hide-details
                  class="my-0"
                ></v-checkbox>
              </v-col>
            </template>
          </v-row>
        </v-card-text>
        <v-card-actions class="px-4">
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            outlined
            large
            class="px-6"
            @click="createdObject.model = false"
            v-text="'رجوع'"
          ></v-btn>
          <v-btn
            color="primary"
            large
            class="px-6"
            @click="saveItem()"
            v-text="'حفظ '"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
const lodash = require("lodash");
const types = require("../../server-sequelize/reciever/af/sections/tasgeel/reports/types")
  .default;

export default {
  name: "BranchNotes",
  props: {},
  mounted() {
    this.init();
    this.findItems();
  },
  data: () => ({
    note: {
      isFollowed: true
    },
    subjectLimit: 10,
    createdObject: {
      model: false,
      fullscreen: false,
      loading: false,
      deleteModel: false,
      viewModel: false,
      item: {}
    },
    textDialog: {
      model: false,
      fullscreen: false,
      title: "",
      text: ""
    },
    search: {
      // section: this.$store.state.constants.sections[0]
    },
    searchLoading: false,
    mainTable: {
      headers: [
        {
          text: "السنة",
          value: "text",
          searchValue: "text",
          sortable: true,
          type: "text",
          inSearch: true,
          inTable: true,
          inModel: true,
          sort: 1
        }
      ],
      items: [],
      printer: {}
    },

    componentName: "BranchNotes",
    selects: {}
  }),
  watch: {},
  methods: {
    findItems() {
      this.mainTable.items = lodash.flattenDeep(
        this.$store.state.constants.years
          .sort((a, b) => b - a)
          .map(year =>
            this.$store.state.constants.RecuStage.data.map(stage => ({
              text: `${stage.text}-${year}`
            }))
          )
      );
    },
    async saveItem() {
      this.$set(this.createdObject, "loading", true);
      let saveItem;

      const constants = this.$store.state.constants;

      saveItem = await this.api(`global/update_one`, {
        table: "Config",
        where: {
          type: "constants"
        },
        update: {
          json: JSON.stringify(constants)
        }
      });

      this.findItems();

      this.$set(this.$store.state, "constants", constants);

      this.$set(this.createdObject, "loading", false);
      this.$set(this.createdObject, "model", false);
    },
    actionAdd() {
      this.$set(this.createdObject, "item", {});
      this.$set(this.createdObject, "model", true);
    },
    actionEdit(item) {
      this.$set(this.createdObject, "model", true);
      this.$set(this, "note", {
        ...item,
        isEdit: true
      });
    }
  }
};
</script>
