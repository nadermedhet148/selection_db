<template>
  <div>
    <v-dialog
      persistent
      v-model="createdObject.model"
      scrollable
      max-width="800"
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

                <v-file-input
                  v-model="note[h.searchValue]"
                  v-else-if="h.type == 'file'"
                  :label="h.label"
                  prepend-icon="mdi-file"
                  show-size
                  truncate-length="14"
                ></v-file-input>
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
          <v-btn color="primary" large class="px-6" @click="saveItem()">
            {{ note.isEdit ? "حفظ الاجراء" : "اضافة اجراء جديد" }}
          </v-btn>
        </v-card-actions>
        <v-spacer></v-spacer>

        <table-bulider
          :headers="mainTable.headers"
          :printer="mainTable.printer"
          :items="mainTable.items"
          :title="'الاجراءات'"
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

          <template v-slot:item.isDone="{ item }">
            <v-chip :color="!item.isDone ? 'error' : 'success'">
              {{ item.isDone ? "نعم" : "لا" }}
            </v-chip>
          </template>
          <template v-slot:item.edit="{ item }">
            <v-chip color="transparent">
              <v-btn icon @click="actionEdit(item)" color="primary">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </v-chip>
          </template>
          <template v-slot:item.file="{ item }">
            <v-chip v-if="item.file" color="transparent">
              <v-btn icon @click="openFile(item.file)" color="primary">
                <v-icon>mdi-file</v-icon>
              </v-btn>
            </v-chip>
            <v-chip v-if="!item.file" color="yellow">
              ?
            </v-chip>
          </template>

          <template v-slot:item.result="{ item }">
            <td v-if="item.result" color="transparent">
              {{ item.result }}
            </td>
            <v-chip v-if="!item.result" color="yellow">
              ?
            </v-chip>
          </template>
        </table-bulider>
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
  name: "NotesAction",
  props: {
    noteData: {
      type: Object,
      default: () => {}
    }
  },
  mounted() {
    this.init();
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
      section: constants.sections[0]
    },
    searchLoading: false,
    mainTable: {
      headers: [
        {
          text: "الاجراء المتخذ",
          value: "takedAction",
          searchValue: "takedAction",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "النتيجة",
          value: "result",
          searchValue: "result",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "المؤيد",
          value: "file",
          searchValue: "file",
          sortable: true,
          type: "file",
          inSearch: false,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "وقت المتابعة التالية",
          value: "dueDate",
          searchValue: "dueDate",
          sortable: true,
          type: "date",
          inSearch: false,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "تم الانتهاء ؟",
          value: "isDone",
          searchValue: "isDone",
          sortable: true,
          type: "checkbox",
          inSearch: false,
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
      this.$set(this.createdObject, "loading", true);
      let saveItem;

      if (!this.note.isEdit) {
        saveItem = await this.api(`global/create_one`, {
          table: "Action",
          where: {
            ...this.note,
            noteId: this.noteData.noteId,
            createdTime: new Date(),
            file: this.note.file?.path
          }
        });
        this.mainTable.items.push({
          ...this.note,
          noteId: this.noteData.noteId,
          createdTime: new Date(),
          file: this.note.file?.path
        });
      } else
        saveItem = await this.api(`global/update_one`, {
          table: "Action",
          update: {
            ...this.note,
            file: this.note.file?.path ? this.note.file?.path : this.note.file,
            sc
          },
          where: {
            actionId: this.note.actionId
          }
        });

      if (saveItem && saveItem.data && saveItem.ok) {
        this.note = {};
        this.showSuccess("تم حفظ ");
      } else {
        this.showError("تعذر حفظ  في قاعدة البيانات");
      }
      this.$set(this.createdObject, "loading", false);
    },
    actionAdd() {
      this.$set(this.createdObject, "item", {});
      this.$set(this.createdObject, "model", true);
    },
    actionEdit(item) {
      this.$set(this, "note", {
        ...item,
        isEdit: true
      });
    },
    async openDialog(item) {
      this.createdObject.model = true;
      this.noteData = item;
      this.mainTable.items = item.Actions;
    },
    async openFile(path) {
      await this.api("server/open-item", {
        path
      });
    }
  }
};
</script>
