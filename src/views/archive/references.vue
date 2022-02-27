<template>
  <div>
    <v-btn @click="actionAdd()" large outlined color="primary">
      اضافة مرجع
    </v-btn>
    <table-bulider
      :headers="mainTable.headers"
      :items="mainTable.items"
      :title="'المراجع'"
    >
      <template v-slot:item.ID="{ item }">
        <v-chip color="transparent">
          {{ item.ID }}
        </v-chip>
      </template>
      <template v-slot:item.path="{ item }">
        <v-chip v-if="item.path" color="transparent">
          <v-btn icon @click="openFile(item.path)" color="primary">
            <v-icon>mdi-file</v-icon>
          </v-btn>
        </v-chip>
        <v-chip v-if="!item.path" path="yellow">
          ?
        </v-chip>
      </template>
      <template v-slot:item.edit="{ item }">
        <v-chip color="transparent" @click="deleteReference(item)">
          <v-icon color="error">mdi-delete</v-icon>
        </v-chip>
      </template>
    </table-bulider>

    <!-- popup to add a reference -->
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
                  v-model="ref[h.value]"
                  :hide-details="h.hint ? false : true"
                  :persistent-hint="h.hint ? true : false"
                  :readonly="h.readonly"
                ></v-text-field>
                <v-textarea
                  v-else-if="h.type == 'textarea'"
                  filled
                  :label="h.text"
                  v-model="ref[h.value]"
                  :hide-details="h.hint ? false : true"
                  :persistent-hint="h.hint ? true : false"
                  auto-grow
                  :readonly="h.readonly"
                  rows="1"
                ></v-textarea>
                <v-file-input
                  v-model="ref[h.value]"
                  v-else-if="h.type == 'file'"
                  :label="h.label"
                  prepend-icon="mdi-file"
                  show-size
                  truncate-length="14"
                ></v-file-input>
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
export default {
  name: "References",
  mounted() {
    this.findAllReferences();
  },
  data: () => ({
    ref: {},
    del: {
      loading: false,
      model: false,
      id: null,
      type: false
    },
    searchLoading: false,
    mainTable: {
      headers: [
        {
          text: "اسم المرجع",
          value: "title",
          type: "text",
          inTable: true,
          inModel: true
        },
        {
          text: "وصف الرجع",
          value: "description",
          type: "textarea",
          inTable: true,
          inModel: true
        },
        {
          text: "مسار المرجع",
          value: "path",
          type: "file",
          inTable: true,
          inModel: true
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
      items: []
    },

    createdObject: {
      model: false,
      fullscreen: false,
      loading: false,
      deleteModel: false,
      viewModel: false,
      item: {}
    }
  }),
  methods: {
    async findAllReferences() {
      this.$set(this, "searchLoading", true);
      this.$set(this.mainTable, "items", []);

      try {
        const result = await this.api("global/get_all", {
          table: "References"
        });
        this.$set(this.mainTable, "items", result.data);
      } catch (e) {
        this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
      }
      this.$set(this, "this.searchLoading", false);
    },

    async saveItem(edirableFromTableItem) {
      this.$set(this.createdObject, "loading", true);
      let saveItem;

      if (!this.ref.isEdit)
        saveItem = await this.api(`global/create_one`, {
          table: "References",
          where: {
            ...this.ref,
            path: this.ref.path?.path
          }
        });

      if (saveItem && saveItem.data && saveItem.ok) {
        this.showSuccess("تم حفظ ");
        this.findAllReferences();
        this.createdObject, "model", false;
      } else {
        this.showError("تعذر حفظ  في قاعدة البيانات");
      }
      this.$set(this.createdObject, "loading", false);
      this.$set(this.createdObject, "model", false);
    },

    actionAdd() {
      this.$set(this.createdObject, "item", {});
      this.$set(this.createdObject, "model", true);
    },
    async openFile(path) {
      await this.api("server/open-item", {
        path
      });
    },
    async deleteReference(item) {
      this.$set(this.del, "loading", true);
      let { id, type } = this.del,
        delItem = await this.api("global/delete_all", {
          table: "References",
          where: {
            referenceID: item.referenceID
          }
        });
      if (delItem && delItem.ok && delItem.data) {
        this.showSuccess(`تم ${type ? "استعادة" : "حذف"} المطلوب`);
        this.$set(this.del, "model", false);
        this.$set(this.del, "id", "");
        this.$set(this.del, "type", false);
        this.findAllReferences();
      } else {
        this.showError(`تعذر ${isVisible ? "استعادة" : "حذف"} المطلوب.`);
      }
      this.$set(this.del, "loading", false);
    }
  }
};
</script>
