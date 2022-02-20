<template>
  <div>
    <v-card :loading="searchLoading" :disabled="searchLoading">
      <v-card-title>
        بحث متقدم في الملاحظات الخاصة مركز الانتقاء و التوجيه
        <v-spacer></v-spacer>
        <v-btn @click="actionAdd()" large outlined color="primary">
          إضافة ملاحظة
        </v-btn>
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
                  @keypress.enter="findOne()"
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
const constants = require("../../Constant").default;
const lodash = require("lodash");
const types = require("../../server-sequelize/reciever/af/sections/tasgeel/reports/types")
  .default;

export default {
  name: "CenterNotes",
  props: {},
  mounted() {
    this.init();
  },
  data: () => ({
    note: {
      section: constants.sections[1],
      isFollowed: false
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
      section: constants.sections[1]
    },
    searchLoading: false,
    mainTable: {
      headers: [
        {
          text: "الرقم العسكري",
          value: "ID",
          searchValue: "ID",
          sortable: true,
          type: "text",
          inSearch: true,
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
          text: "المرحلة التجندية",
          value: "Soldier.RecuStage",
          searchValue: "RecuStage",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: false,
          readonly: true,
          sort: 1
        },
        {
          text: "الملحوظة",
          value: "Note",
          searchValue: "Note",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "القرار",
          value: "decision",
          searchValue: "decision",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "متابع",
          value: "isFollowed",
          searchValue: "isFollowed",
          sortable: true,
          type: "checkbox",
          inSearch: true,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "",
          value: "edit",
          searchValue: "edit",
          sortable: true,
          type: "checkbox",
          inSearch: false,
          inTable: true,
          inModel: false,
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
        data: lodash.flattenDeep(
          constants.years.map(year =>
            constants.RecuStage.data.map(stage => `${stage.text}-${year}`)
          )
        )
      }
    }
  }),
  watch: {
    "note.ID"(newValue) {
      this.findOne(newValue);
    }
  },
  methods: {
    async saveItem(edirableFromTableItem) {
      if (!this.note.Name) {
        return this.showError("هذا الفرد غير مسجل لدينا");
      }
      this.$set(this.createdObject, "loading", true);
      let saveItem;

      if (!this.note.isEdit)
        saveItem = await this.api(`global/create_one`, {
          table: "Notes",
          where: this.note
        });
      else
        saveItem = await this.api(`global/update_one`, {
          table: "Notes",
          update: this.note,
          where: {
            noteId: this.note.noteId
          }
        });

      if (saveItem && saveItem.data && saveItem.ok) {
        this.showSuccess("تم حفظ ");
        this.findItems();
        this.createdObject, "model", false;
      } else {
        this.showError("تعذر حفظ  في قاعدة البيانات");
      }
      this.$set(this.createdObject, "loading", false);
      this.$set(this.createdObject, "model", false);
    },
    findOne(ID) {
      this.api("global/get_one", {
        table: "Soldier",
        where: { ID }
      })
        .then(x => {
          this.$set(this.note, "Name", x.data.Name);
        })
        .catch(error => {})
        .finally(() => {});
    },
    findItems() {
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);
      let where = {
          ...this.search,
          RecuStage: null
        },
        likes = ["ID"],
        multi = [];

      this.api("global/get_all", {
        table: "Notes",
        include: [
          {
            model: "Soldier",
            where: this.cleanObject({
              RecuStage: this.search.RecuStage
            })
          }
        ],
        where: this.mapToQuery(where, likes, multi)
      })
        .then(x => {
          let data = x.data,
            printer = {
              data: [...data],
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
