<template>
  <div>
    <v-dialog persistent max-width="400" scrollable v-model="model">
      <v-card>
        <v-card-title>
          حدد الخيارات التي تناسبك
          <v-spacer></v-spacer>
          <v-btn icon @click="model = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="px-0">
          <v-treeview
            hoverable
            multiple-active
            :items="fixed_data"
            return-object
            selectable
            transition
            selected-color="primary"
          ></v-treeview>
        </v-card-text>
        <v-card-text>
          <v-btn-toggle class="d-block" v-model="options.ext" mandatory>
            <v-btn width="50%" active-class="primary white--text" value="docx">
              <v-icon class="me-2" :color="options.ext == 'docx' ? 'white' : ''"
                >mdi-microsoft-word</v-icon
              >
              طباعة Word
            </v-btn>
            <v-btn width="50%" active-class="success white--text" value="xlsx">
              <v-icon class="me-2" :color="options.ext == 'xlsx' ? 'white' : ''"
                >mdi-microsoft-excel</v-icon
              >
              طباعة Excel
            </v-btn>
          </v-btn-toggle>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="px-4">
          <v-spacer></v-spacer>
          <v-btn
            @click="model = false"
            color="primary"
            v-text="'رجوع'"
            outlined
            large
          ></v-btn>
          <v-btn class="px-6" v-text="'طباعة'" large color="primary"></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "military_printer",
  props: {
    data: {
      type: [Object, Array],
      default: () => ({})
      /*
       * PLEASE NOTE:
       * -----------------------------------------
       * 1.
       *    If type is 'Object', it should not contain keys named ['headers', 'records'] in the top level properties.
       * -----------------------------------------
       * 2.
       *    If type is 'Object' and it contains ['headers', 'records'] keys in its top level properties,
       *    it will be treated as a single table.
       *    In that case, you should be printing one table.
       * -----------------------------------------
       * 3.
       *    The most used case in the Military Records project is case No. 2.
       */
    },
    search: {
      type: String,
      default: ""
    },
    filters: {
      type: Object,
      default: () => ({})
    },
    "output-filename": {
      type: String,
      default: `${new Date().toISOString().substr(0, 10)}_File`
    },
    "input-filepath-word": {
      type: String,
      default: ""
    }
  },
  data: () => ({
    model: false,
    options: {
      ext: "docx"
    }
  }),
  methods: {
    showDialog() {
      this.$set(this, "model", true);
    },
    hideDialog() {
      this.$set(this, "model", false);
    }
  },
  computed: {
    fixed_data() {
      let { data } = this,
        type = Array.isArray(data) ? "array" : typeof data,
        hasRecords =
          type == "object" && Array.isArray(data["records"]) ? true : false,
        hasHeaders =
          type == "object" && Array.isArray(data["headers"]) ? true : false,
        returner =
          type == "object" && hasRecords && hasHeaders ? "single" : "multiple",
        tree = [];
      if (type == "object" && returner == "single") {
        //
      } else if (type == "object" && returner == "multiple") {
        Object.keys(data).forEach((key, i) => {
          let val = data[key],
            children = val.headers;
          children.forEach((ch, ii) => {
            ch.id = `${key}_${i}_${ii}`;
            ch.name = ch.text;
          });
          tree[i] = {
            id: `${key}_${i}`,
            name: val.title,
            children: children
          };
        });
      } else {
        // type is array
      }
      return tree;
    }
  }
};
</script>
