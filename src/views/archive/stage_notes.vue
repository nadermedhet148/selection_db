<template>
  <div>
    <v-card :loading="searchLoading" :disabled="searchLoading">
      <v-card-title>
        برجاء اختيار المرحلة المراد طباعتها
        <v-spacer></v-spacer>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-row>
          <template v-for="(h, i) in mainTable.headers.filter(h => h.inSearch)">
            <v-col v-if="h.type !== 'date'" :key="i" cols="6" lg="4">
              <v-text-field
                v-if="!h.type || h.type == 'text'"
                filled
                :label="h.text"
                v-model="search[h.searchValue]"
                :hide-details="h.hint ? false : true"
                :persistent-hint="h.hint ? true : false"
                @keypress.enter="findItems()"
              ></v-text-field>
              <v-autocomplete
                v-else-if="h.type == 'select'"
                filled
                :multiple="h.multiple"
                :label="h.text"
                v-model="search[h.searchValue]"
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
                  selects[h.searchValue] ? selects[h.searchValue].text : 'text'
                "
              ></v-autocomplete>
              <v-textarea
                v-else-if="h.type == 'textarea'"
                filled
                :label="h.text"
                v-model="search[h.searchValue]"
                :hide-details="h.hint ? false : true"
                :persistent-hint="h.hint ? true : false"
                auto-grow
                rows="1"
              ></v-textarea>

              <v-checkbox
                v-else-if="h.type == 'checkbox'"
                v-model="search[h.searchValue]"
                :label="h.text"
                hide-details
                class="my-0"
              ></v-checkbox>
            </v-col>
            <v-col
              class="py-0"
              cols="8"
              :key="i + '_date'"
              v-else-if="h.type == 'date'"
            >
              <v-row v-if="search[h.searchValue]">
                <v-col cols="6">
                  <v-text-field
                    filled
                    type="date"
                    :label="h.text + ' (من)'"
                    v-model="search[h.searchValue][0]"
                    :hide-details="h.hint ? false : true"
                    :persistent-hint="h.hint ? true : false"
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    filled
                    :label="h.text + ' (الى)'"
                    type="date"
                    v-model="search[h.searchValue][1]"
                    :hide-details="h.hint ? false : true"
                    :persistent-hint="h.hint ? true : false"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-col>
          </template>
        </v-row>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions class="px-4 py-4">
        <v-btn
          class="px-6"
          @click="findItems()"
          large
          color="primary"
          v-text="'بحث'"
        ></v-btn>
      </v-card-actions>
    </v-card>

    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      query="stageNotes"
      :items="mainTable.items"
      :title="'الملاحظات'"
    >
      <template v-slot:item.ID="{ item }">
        <v-chip
          color="transparent"
          :to="`/soldiers_plus/${item.ID}`"
          @click.right="copyText(item.ID)"
        >
          {{ item.ID }}
        </v-chip>
      </template>

      <template v-slot:item.isFollowed="{ item }">
        <v-chip :color="!item.isFollowed ? 'error' : 'success'">
          {{ item.isFollowed ? "نعم" : "لا" }}
        </v-chip>
      </template>
      <template v-slot:item.edit="{ item }">
        <v-chip color="transparent">
          <v-btn icon @click="actionEdit(item)" color="primary">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </v-chip>
      </template>
    </table-bulider>
  </div>
</template>

<script>
import constants from "./../../assets/constants.json";
const lodash = require("lodash");
const types = require("../../server-sequelize/reciever/af/sections/tasgeel/reports/types")
  .default;

export default {
  name: "CenterNotes",
  props: {},
  mounted() {
    this.selects.RecuStage.data = lodash.flattenDeep(
      this.$store.state.constants.years
        .sort((a, b) => b - a)
        .map(year =>
          this.$store.state.constants.RecuStage.data.map(stage => ({
            text: `${stage.text}-${year}`
          }))
        )
    );
    this.init();
  },
  data: () => ({
    note: {},
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
    search: {},
    searchLoading: false,
    mainTable: {
      headers: [
        {
          text: "الرقم العسكري",
          value: "Soldier.ID",
          searchValue: "ID",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "الاسم",
          value: "Soldier.Name",
          searchValue: "Name",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          readonly: true,
          sort: 1
        },
        {
          text: "تاريخ الاختبار",
          value: "Soldier.TestDate",
          searchValue: "TestDate",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "المختص",
          value: "section",
          searchValue: "section",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: false,
          sort: 1
        },
        {
          text: "الملحوظة",
          value: "Note",
          searchValue: "Note",
          sortable: true,
          type: "select",
          multiple: true,
          inSearch: true,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "نوع الملحوظة",
          value: "type",
          searchValue: "type",
          sortable: true,
          type: "select",
          inSearch: false,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "المرحلة التجندية",
          value: "RecuStage",
          searchValue: "RecuStage",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: false,
          inModel: false,
          readonly: true,
          sort: 1
        }
      ],
      items: [],
      printer: {}
    },

    componentName: "BranchNotes",
    selects: {
      RecuStage: {
        text: "text",
        value: "text",
        data: []
      },
      section: {
        text: "text",
        value: "text",
        data: constants.sections
      },
      Note: {
        text: "Note",
        value: "Note",
        table: "Notes"
      },
      type: {
        table: "Notes",
        text: "type",
        value: "type"
      }
    }
  }),
  watch: {
    "note.ID"(newValue) {
      this.findOne(newValue);
    }
  },
  methods: {
    findItems() {
      if (!this.search.RecuStage) {
        this.showError("المرحلة مطلوبة يجب ادلخلها");
      }
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);
      let where = {
          ...this.search,
          section: null
        },
        likes = ["ID"],
        multi = ["Note"];

      this.api("global/get_all", {
        table: "Notes",
        where: this.cleanObject({
          section: this.search.section,
          Note: this.mapToQuery(where, likes, multi).Note
        }),
        include: [
          {
            model: "Soldier",
            where: this.cleanObject({
              ...this.mapToQuery(where, likes, multi),
              Note: null
            })
          }
        ]
      })
        .then(x => {
          let data = x.data.map(ele => ({
              ...ele,
              Soldier: {
                ...ele.Soldier,
                TestDate: ele.Soldier?.TestDate
                  ? new Date(ele.Soldier.TestDate).toISOString().split("T")[0]
                  : ""
              }
            })),
            printer = {
              data: [
                ...lodash
                  .chunk(
                    data.map((ele, index) => ({
                      ...ele,
                      index: index + 1
                    })),
                    5
                  )
                  .map(page => ({
                    page
                  }))
              ],
              year: this.search.RecuStage.split("-")[1],
              stage: this.search.RecuStage.split("-")[0],
              excelKey: "data",
              excelHeaders: this.mainTable.headers.filter(f => f.inTable)
            };

          this.$set(this.mainTable, "items", data);
          this.$set(this.mainTable, "printer", printer);
        })
        .catch(error => {
          console.log(error);
          this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
        })
        .finally(() => {
          this.$set(this, "searchLoading", false);
        });
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
