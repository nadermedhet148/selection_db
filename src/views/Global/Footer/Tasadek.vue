<template>
  <div>
    <v-card :loading="searchLoading" :disabled="searchLoading">
      <v-card-title>
        بحث متقدم في المتابعات
        <v-spacer></v-spacer>
        <v-btn @click="actionAdd()" large outlined color="primary">
          إضافة إلتماس
        </v-btn>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-row>
          <template v-for="(h, i) in headers.filter(h => h.inSearch)">
            <v-col v-if="h.type !== 'date'" :key="i" cols="6" lg="4">
              <v-text-field
                v-if="!h.type || h.type == 'text'"
                filled
                :label="h.text"
                v-model="search[h.value]"
                :hide-details="h.hint ? false : true"
                :persistent-hint="h.hint ? true : false"
              ></v-text-field>
              <v-combobox
                v-else-if="h.type == 'select'"
                filled
                :label="h.text"
                v-model="search[h.value]"
                :hide-details="h.hint ? false : true"
                :persistent-hint="h.hint ? true : false"
                :items="selects && selects[h.value] ? selects[h.value] : []"
              ></v-combobox>
              <v-textarea
                v-else-if="h.type == 'textarea'"
                filled
                :label="h.text"
                v-model="search[h.value]"
                :hide-details="h.hint ? false : true"
                :persistent-hint="h.hint ? true : false"
                auto-grow
                rows="1"
              ></v-textarea>
              <v-btn-toggle
                v-else-if="h.type == 'checkbox'"
                v-model="search[h.value]"
                class="d-block"
              >
                <v-btn
                  height="58"
                  width="50%"
                  :color="search[h.value] === true ? 'primary white--text' : ''"
                  :value="true"
                  v-text="h.trueValue"
                ></v-btn>
                <v-btn
                  height="58"
                  width="50%"
                  :color="search[h.value] === false ? 'error white--text' : ''"
                  :value="false"
                  v-text="h.falseValue"
                ></v-btn>
              </v-btn-toggle>
            </v-col>
            <v-col
              class="py-0"
              cols="8"
              :key="i + '_date'"
              v-else-if="h.type == 'date'"
            >
              <v-row v-if="search[h.value]">
                <v-col cols="6">
                  <v-text-field
                    filled
                    type="date"
                    :label="h.text + ' (من)'"
                    v-model="search[h.value][0]"
                    :hide-details="h.hint ? false : true"
                    :persistent-hint="h.hint ? true : false"
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    filled
                    :label="h.text + ' (الى)'"
                    type="date"
                    v-model="search[h.value][1]"
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
          v-text="'بحث في الإلتماسات'"
        ></v-btn>
      </v-card-actions>
    </v-card>
    <v-card class="mt-8">
      <v-card-title>
        الإلتماسات
        <v-spacer></v-spacer>
        <printer-menu
          :disabled="items.length == 0"
          :data="printer"
          :fab="false"
        ></printer-menu>
      </v-card-title>
      <v-divider></v-divider>
      <v-data-table
        :headers="headers.filter(h => h.inTable)"
        :items="items"
        hide-default-header
        fixed-header
        multi-sort
        @current-items="tableUpdated"
        ref="mainTable"
      >
        <template v-slot:header="table">
          <table-header-filters
            :items="items"
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
        <template v-slot:item.name="{ item }">
          <v-chip
            color="transparent"
            :to="`/soldiers_plus/${item.militaryId}`"
            @click.right="copyText(item.name)"
          >
            {{ item.name }}
          </v-chip>
        </template>
        <template v-slot:item.nateget3Ard="{ item }">
          <div
            v-if="item.nateget3Ard.length <= subjectLimit || item.subjectShown"
          >
            <dynamic-link
              :prefix="['@', '#']"
              :text="item.nateget3Ard.replace(/(?:\r\n|\r|\n)/g, '<br />')"
            ></dynamic-link>
          </div>
          <div v-else>
            {{ item.nateget3Ard | filterStrLimit(subjectLimit) }}
          </div>
          <v-chip
            v-if="item.nateget3Ard.length > subjectLimit"
            color="transparent"
          >
            <v-btn
              @click="item.subjectShown = !item.subjectShown"
              icon
              small
              depressed
            >
              <v-icon>
                mdi-window-{{ item.subjectShown ? "restore" : "maximize" }}
              </v-icon>
            </v-btn>
            <v-btn
              @click="openTextDialog(item, 'nateget3Ard', 'المطلوب')"
              icon
              small
              depressed
            >
              <v-icon>
                mdi-window-open
              </v-icon>
            </v-btn>
          </v-chip>
        </template>
        <template v-slot:item.address="{ item }">
          <div v-if="item.address.length <= subjectLimit || item.subjectShown">
            <dynamic-link
              :prefix="['@', '#']"
              :text="item.address.replace(/(?:\r\n|\r|\n)/g, '<br />')"
            ></dynamic-link>
          </div>
          <div v-else>
            {{ item.address | filterStrLimit(subjectLimit) }}
          </div>
          <v-chip v-if="item.address.length > subjectLimit" color="transparent">
            <v-btn
              @click="item.subjectShown = !item.subjectShown"
              icon
              small
              depressed
            >
              <v-icon>
                mdi-window-{{ item.subjectShown ? "restore" : "maximize" }}
              </v-icon>
            </v-btn>
            <v-btn
              @click="openTextDialog(item, 'address', 'العنوان')"
              icon
              small
              depressed
            >
              <v-icon>
                mdi-window-open
              </v-icon>
            </v-btn>
          </v-chip>
        </template>
        <template v-slot:item.tasdekAmana="{ item }">
          <div
            v-if="item.tasdekAmana.length <= subjectLimit || item.subjectShown"
          >
            <dynamic-link
              :prefix="['@', '#']"
              :text="item.tasdekAmana.replace(/(?:\r\n|\r|\n)/g, '<br />')"
            ></dynamic-link>
          </div>
          <div v-else>
            {{ item.tasdekAmana | filterStrLimit(subjectLimit) }}
          </div>
          <v-chip
            v-if="item.tasdekAmana.length > subjectLimit"
            color="transparent"
          >
            <v-btn
              @click="item.subjectShown = !item.subjectShown"
              icon
              small
              depressed
            >
              <v-icon>
                mdi-window-{{ item.subjectShown ? "restore" : "maximize" }}
              </v-icon>
            </v-btn>
            <v-btn
              @click="openTextDialog(item, 'tasdekAmana', 'الإجراءات المتخذة')"
              icon
              small
              depressed
            >
              <v-icon>
                mdi-window-open
              </v-icon>
            </v-btn>
          </v-chip>
        </template>
        <template v-slot:item.tamTasdek="{ item }">
          <v-chip :color="item.tamTasdek == true ? 'success' : 'error'">
            {{ item.tamTasdek == true ? "تم" : "لم يتم" }}
          </v-chip>
        </template>
        <template v-slot:item.tamBatt="{ item }">
          <v-chip :color="item.tamBatt == true ? 'success' : 'error'">
            {{ item.tamBatt == true ? "تم" : "لم يتم" }}
          </v-chip>
        </template>
        <template v-slot:item.actionsStart="{ item }">
          <v-chip class="transparent">
            <v-btn icon @click="actionEdit(item)" color="primary">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <!-- <v-btn icon @click="actionDelete(item)" color="error">
              <v-icon>mdi-trash-can</v-icon>
            </v-btn> -->
          </v-chip>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-chip class="transparent">
            <v-btn icon @click="actionEdit(item)" color="primary">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn
              v-if="isAdmin()"
              icon
              @click="actionDelete(item)"
              color="error"
            >
              <v-icon>mdi-trash-can</v-icon>
            </v-btn>
          </v-chip>
        </template>
      </v-data-table>
    </v-card>
    <v-dialog
      v-if="isCurrentRoute(componentName)"
      scrollable
      :fullscreen="textDialog.fullscreen"
      v-model="textDialog.model"
      max-width="550"
    >
      <v-card>
        <v-card-title>
          {{ textDialog.title }}
          <v-spacer></v-spacer>
          <v-btn icon @click="textDialog.fullscreen = !textDialog.fullscreen">
            <v-icon
              >mdi-window-{{
                textDialog.fullscreen ? "restore" : "maximize"
              }}</v-icon
            >
          </v-btn>
          <v-btn icon @click="textDialog.model = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pt-4">
          <dynamic-link
            :prefix="['@', '#']"
            :text="textDialog.text.replace(/(?:\r\n|\r|\n)/g, '<br />')"
          ></dynamic-link>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog persistent v-model="tasdek.model" scrollable max-width="750">
      <v-card :loading="tasdek.loading" :disabled="tasdek.loading">
        <v-card-title>
          إلتماس
          <v-spacer></v-spacer>
          <v-btn @click="tasdek.model = false" icon>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-row>
            <template v-for="(h, i) in headers.filter(h => h.inSearch)">
              <v-col :cols="h.cols ? h.cols : '6'" :key="i">
                <v-text-field
                  v-if="!h.type || ['text', 'date'].includes(h.type)"
                  filled
                  :type="h.type == 'date' ? 'date' : 'text'"
                  :label="h.text"
                  v-model="tasdek.item[h.value]"
                  :hide-details="h.hint ? false : true"
                  :persistent-hint="h.hint ? true : false"
                ></v-text-field>
                <v-combobox
                  v-else-if="h.type == 'select'"
                  filled
                  :label="h.text"
                  v-model="tasdek.item[h.value]"
                  :hide-details="h.hint ? false : true"
                  :persistent-hint="h.hint ? true : false"
                  :items="selects && selects[h.value] ? selects[h.value] : []"
                ></v-combobox>
                <v-textarea
                  v-else-if="h.type == 'textarea'"
                  filled
                  :label="h.text"
                  v-model="tasdek.item[h.value]"
                  :hide-details="h.hint ? false : true"
                  :persistent-hint="h.hint ? true : false"
                  auto-grow
                  rows="1"
                ></v-textarea>
                <v-btn-toggle
                  v-else-if="h.type == 'checkbox'"
                  v-model="tasdek.item[h.value]"
                  class="d-block"
                >
                  <v-btn
                    height="58"
                    width="50%"
                    :color="
                      tasdek.item[h.value] === true ? 'primary white--text' : ''
                    "
                    :value="true"
                    v-text="h.trueValue"
                  ></v-btn>
                  <v-btn
                    height="58"
                    width="50%"
                    :color="
                      tasdek.item[h.value] === false ? 'error white--text' : ''
                    "
                    :value="false"
                    v-text="h.falseValue"
                  ></v-btn>
                </v-btn-toggle>
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
            @click="tasdek.model = false"
            v-text="'رجوع'"
          ></v-btn>
          <v-btn
            color="primary"
            large
            class="px-6"
            @click="saveItem()"
            v-text="'حفظ الإلتماس'"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog scrollable max-width="450" v-model="tasdek.deleteModel">
      <v-card :loading="tasdek.loading" :disabled="tasdek.loading">
        <v-card-title class="error white--text">
          حذف إلتماس
          <v-spacer></v-spacer>
          <v-btn dark @click="tasdek.deleteModel = false" icon>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="pt-4">
          هل أنت متأكد من حذف الإلتماس الخاص بـ {{ tasdek.item.name }}
        </v-card-text>
        <v-card-actions class="px-4">
          <v-spacer></v-spacer>
          <v-btn
            color="error"
            outlined
            class="px-6"
            large
            v-text="'رجوع'"
            @click="tasdek.deleteModel = false"
          ></v-btn>
          <v-btn
            color="error"
            class="px-6"
            large
            v-text="'حذف الإلتماس'"
            @click="deleteItem()"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- <v-dialog scrollable max-width="700" v-model="tasdek.viewModel">
      <v-card>
        <v-card-title></v-card-title>
        <v-divider></v-divider>
        <v-card-text></v-card-text>
      </v-card>
    </v-dialog> -->
  </div>
</template>

<script>
export default {
  name: "tasadek",
  mounted() {
    this.initDates();
    this.init();
  },
  filters: {
    filterStrLimit(str, limit) {
      return `${str.length <= limit ? str : str.substr(0, limit) + ".."}`;
    }
  },
  data: () => ({
    subjectLimit: 10,
    tasdek: {
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
    headers: [
      {
        text: "",
        value: "actionsStart",
        sortable: false,
        inTable: true
      },
      {
        text: "الرقم العسكري",
        value: "militaryId",
        sortable: true,
        type: "text",
        inSearch: true,
        inTable: true
      },
      {
        text: "الدرجة",
        value: "rotba",
        sortable: true,
        type: "select",
        inSearch: true,
        inTable: true
      },
      {
        text: "الإسم",
        value: "name",
        sortable: true,
        type: "text",
        inSearch: true,
        inTable: true
      },
      {
        text: "الوحدة",
        value: "wehda",
        sortable: true,
        type: "select",
        inSearch: true,
        inTable: true
      },
      {
        text: "حالة الخدمة",
        value: "haletKhedma",
        sortable: true,
        type: "select",
        inSearch: true,
        inTable: true
      },
      {
        text: "مقدم الإلتماس",
        value: "mostafeed",
        sortable: true,
        type: "text",
        inSearch: true
      },
      {
        text: "درجة القرابة",
        value: "relationship",
        sortable: true,
        type: "text",
        inSearch: true
      },
      {
        text: "رقم الهاتف",
        value: "phoneNum",
        sortable: true,
        type: "text",
        inSearch: true
      },
      {
        text: "العنوان",
        value: "address",
        sortable: true,
        type: "text",
        inSearch: true
      },
      {
        text: "تاريخ المكاتبة",
        value: "dateTasdek",
        sortable: true,
        type: "date",
        inSearch: true,
        inTable: true
      },
      {
        text: "رقم المكاتبة",
        value: "tasdekNum",
        sortable: true,
        type: "text",
        inSearch: true,
        inTable: true
      },
      {
        text: "تاريخ الإلتماس",
        value: "dateEltmas",
        sortable: true,
        type: "date",
        inSearch: true
      },
      {
        text: "جهة المكاتبة",
        value: "tash5Es",
        sortable: true,
        type: "text",
        inSearch: true
      },
      {
        text: "تاريخ البت",
        value: "dateBatt",
        sortable: true,
        type: "date",
        inSearch: true,
        inTable: true
      },
      {
        text: "القسم المختص",
        value: "mest",
        sortable: true,
        type: "select",
        inSearch: true,
        inTable: true
      },
      {
        text: "المطلوب",
        value: "nateget3Ard",
        sortable: true,
        type: "textarea",
        inSearch: true
      },
      // {
      //   text: "تم التصديق؟",
      //   trueValue: "تم التصديق",
      //   falseValue: "لم يتم",
      //   value: "tamTasdek",
      //   sortable: true,
      //   type: "checkbox",
      //   inSearch: true,
      //   inTable: true
      // },
      {
        text: "الإجراءات المتخذة",
        value: "tasdekAmana",
        sortable: true,
        type: "textarea",
        inSearch: true,
        cols: "12"
      },
      {
        text: "تم البت؟",
        trueValue: "تم البت",
        falseValue: "لم يتم",
        value: "tamBatt",
        sortable: true,
        type: "checkbox",
        inSearch: true,
        inTable: true
      },
      {
        text: "",
        value: "actions",
        sortable: false
      }
    ],
    items: [],
    tableFilters: {},
    componentName: "tasadek",
    selects: {
      rotba: [],
      wehda: [],
      haletKhedma: [],
      mest: []
    },
    printer: {}
  }),
  methods: {
    tableUpdated(v) {
      let tables = this.$refs.mainTable;
      if (tables) {
        tables = Array.isArray(tables) ? tables : [tables];
        for (let i = 0; i < tables.length; i++) {
          let table = tables[i],
            childTable = table?.$children[0].$children[0].$children[0]?.table,
            filteredItems,
            sorted;

          // when first table exists
          if ("filteredItems" in table?.$children[0]) {
            filteredItems = table.$children[0].filteredItems;
            sorted = filteredItems;
            // when the second table exists
            if (childTable) {
              let sortBy = childTable.props.options.sortBy, // -_-
                sortDesc = childTable.props.options.sortDesc; // -_-
              sorted = table.customSort(filteredItems, sortBy, sortDesc);
            }
            this.printer.cons = sorted;
          }
        }
      }
    },
    async deleteItem() {
      let { id } = this.tasdek.item;
      this.$set(this.tasdek, "loading", true);
      let deleteItem = await this.api(
        `global/delete_all`,
        {
          table: "tasadekSgsg",
          where: {
            id
          }
        },
        "ts"
      );
      if (deleteItem && deleteItem.data && deleteItem.ok) {
        this.showSuccess("تم حذف الإلتماس");
        this.findItems();
        this.$set(this.tasdek, "deleteModel", false);
      } else {
        this.showError("تعذر حذف الإلتماس من قاعدة البيانات");
      }
      this.$set(this.tasdek, "loading", false);
    },
    actionEdit(item) {
      this.$set(this.tasdek, "item", { ...item });
      this.$set(this.tasdek, "model", true);
    },
    actionDelete(item) {
      this.$set(this.tasdek, "item", { ...item });
      this.$set(this.tasdek, "deleteModel", true);
    },
    async saveItem() {
      this.$set(this.tasdek, "loading", true);
      let item = { ...this.tasdek.item },
        id = item.id,
        where = { ...item },
        isCreate = !id ? true : false;
      delete where.id;
      let saveItem = await this.api(
        `global/${isCreate ? "create" : "update"}_one`,
        {
          table: "tasadekSgsg",
          where: isCreate
            ? where
            : {
                id
              },
          update: where,
          returner: "id"
        },
        "ts"
      );
      if (saveItem && saveItem.data && saveItem.ok) {
        this.showSuccess("تم إضافة الإلتماس");
        this.findItems();
        this.$set(this.tasdek, "model", false);
      } else {
        this.showError("تعذر إضافة الإلتماس في قاعدة البيانات");
      }
      this.$set(this.tasdek, "loading", false);
    },
    openTextDialog(item, modelToOpen, title) {
      this.$set(
        this.textDialog,
        "title",
        title ? `${title} - إلتماس بتاريخ ${item.dateEltmas}` : "عرض نص"
      );
      this.$set(this.textDialog, "text", item[modelToOpen]);
      this.$set(this.textDialog, "model", true);
    },
    findItems() {
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);
      let where = { ...this.search },
        likes = [
          "name",
          "mostafeed",
          "relationship",
          "phoneNum",
          "address",
          "tash5Es",
          "nateget3Ard",
          "tasdekAmana"
        ];
      Object.keys(where).forEach(key => {
        let val = where[key];
        if (!val) {
          delete where[key];
          return;
        }
        if (typeof val == "object" && Array.isArray(val)) {
          let f1 = val[0],
            f2 = val[1];
          if (f1 || f2) {
            where[key] =
              f1 && f2
                ? {
                    $between: [new Date(f1), new Date(f2)]
                  }
                : f1 && !f2
                ? {
                    $gte: new Date(f1)
                  }
                : {
                    $lte: new Date(f2)
                  };
          } else {
            delete where[key];
          }
        } else {
          if (likes.includes(key)) {
            where[key] = {
              $like: `${val}%`
            };
          }
        }
      });
      console.log(where);
      this.api(
        "global/get_all",
        {
          table: "tasadekSgsg",
          where,
          order: [["id", "desc"]]
        },
        "ts"
      )
        .then(x => {
          let data = this.fixDates(x.data, [
              "dateEltmas",
              "dateTasdek",
              "dateBatt"
            ]),
            printer = {
              cons: [...data],
              excelKey: "cons",
              excelHeaders: this.headers.filter(f => f.inSearch)
            };
          data.forEach(el => {
            el.subjectShown = false;
          });
          this.$set(this, "items", data);
          this.$set(this, "printer", printer);
        })
        .catch(error => {
          this.showError("حدث خطأ أثناء احضار الإلتماسات من قاعدة البيانات");
          console.log(error);
        })
        .finally(() => {
          this.$set(this, "searchLoading", false);
        });
    },
    init() {
      this.$set(this, "searchLoading", true);
      this.api(
        "global/get_all",
        {
          table: "tasadekSgsg"
        },
        "ts"
      )
        .then(x => {
          let data = this.fixDates(x.data, [
            "dateEltmas",
            "dateTasdek",
            "dateBatt"
          ]);
          // data.forEach(el => {
          //   el.subjectShown = false;
          // });
          // Map selects
          let rotba = data.map(d => d.rotba).filter(d => d && d.length > 0),
            wehda = data.map(d => d.wehda).filter(d => d && d.length > 0),
            haletKhedma = data
              .map(d => d.haletKhedma)
              .filter(d => d && d.length > 0),
            mest = data.map(d => d.mest).filter(d => d && d.length > 0);
          this.$set(this.selects, "rotba", rotba);
          this.$set(this.selects, "wehda", wehda);
          this.$set(this.selects, "haletKhedma", haletKhedma);
          this.$set(this.selects, "mest", mest);
          // Add items
          // this.$set(this, "items", data);
        })
        .catch(error => {
          this.showError("حدث خطأ أثناء احضار الإلتماسات من قاعدة البيانات");
          console.log(error);
        })
        .finally(() => {
          this.$set(this, "searchLoading", false);
        });
    },
    initDates() {
      let dates = this.headers.filter(h => h.type == "date").map(h => h.value);
      dates.forEach(d => {
        this.$set(this.search, d, []);
      });
    },
    actionAdd() {
      this.$set(this.tasdek, "item", {});
      this.$set(this.tasdek, "model", true);
    }
  }
};
</script>
