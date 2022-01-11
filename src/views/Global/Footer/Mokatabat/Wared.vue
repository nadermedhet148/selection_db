<template>
  <div>
    <v-card>
      <v-card-title>
        وارد المكاتبات
        <v-spacer></v-spacer>
        <printer-menu
          :disabled="searched.items.length == 0"
          :data="searched.printer"
          :fab="false"
        ></printer-menu>
        <v-btn icon class="ms-2" @click="actionNew()">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-card-title>
      <v-divider></v-divider>
      <v-data-table
        fixed-header
        :headers="
          searched.headers.filter(
            f => (f.adminOnly && isAdmin()) || !f.adminOnly
          )
        "
        :items="searched.items"
        :search="searched.search"
        v-model="searched.selected"
        hide-default-header
        @current-items="tableUpdated"
        ref="mainTable"
      >
        <template v-slot:header="table">
          <table-header-filters
            :items="searched.items"
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
          <v-chip color="transparent">
            <v-btn icon @click="actionEdit(item)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon v-if="isAdmin()" @click="actionDelete(item)">
              <v-icon>mdi-trash-can</v-icon>
            </v-btn>
          </v-chip>
        </template>
        <template v-slot:item.gotFeedback="{ item }">
          <v-chip :color="item.gotFeedback ? 'success' : 'error'" small>
            {{ item.gotFeedback ? "تم" : "لم يتم" }}
          </v-chip>
        </template>
        <template v-slot:item.subject="{ item }">
          <div v-if="item.subject.length <= subjectLimit || item.subjectShown">
            <dynamic-link
              :prefix="['@', '#']"
              :text="item.subject.replace(/(?:\r\n|\r|\n)/g, '<br />')"
            ></dynamic-link>
          </div>
          <div v-else>
            {{ item.subject | filterStrLimit(subjectLimit) }}
          </div>
          <v-chip v-if="item.subject.length > subjectLimit" color="transparent">
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
              @click="openTextDialog(item, 'subject', 'الموضوع')"
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
        <template v-slot:item.connectedMokatabas="{ item }">
          <div
            v-if="item.connectedMokatabas && item.connectedMokatabas.length > 0"
          >
            <template v-for="(chip, i) in item.connectedMokatabas.split(',')">
              <v-chip :key="i" @click="openSingleView(chip)">
                {{ chip }}
              </v-chip>
            </template>
          </div>
        </template>
        <template v-slot:item.procedures="{ item }">
          <div
            v-if="
              item.procedures.length <= subjectLimit || item.proceduresShown
            "
          >
            <dynamic-link
              :prefix="['@', '#']"
              :text="item.procedures.replace(/(?:\r\n|\r|\n)/g, '<br />')"
            ></dynamic-link>
          </div>
          <div v-else>
            {{ item.procedures | filterStrLimit(subjectLimit) }}
          </div>
          <v-chip
            v-if="item.procedures.length > subjectLimit"
            color="transparent"
          >
            <v-btn
              @click="item.proceduresShown = !item.proceduresShown"
              icon
              small
              depressed
            >
              <v-icon>
                mdi-window-{{ item.proceduresShown ? "restore" : "maximize" }}
              </v-icon>
            </v-btn>
            <v-btn
              @click="openTextDialog(item, 'procedures', 'الإجراء المتخذ')"
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
      </v-data-table>
    </v-card>
    <v-dialog
      v-if="isCurrentRoute(componentName)"
      scrollable
      v-model="mokataba.model"
      max-width="800"
      :fullscreen="mokataba.fullscreen"
    >
      <v-card :loading="mokataba.loading" :disabled="mokataba.loading">
        <v-card-title>
          مكاتبة
          <v-spacer></v-spacer>
          <v-btn icon @click="mokataba.fullscreen = !mokataba.fullscreen">
            <v-icon
              >mdi-window-{{
                mokataba.fullscreen ? "restore" : "maximize"
              }}</v-icon
            >
          </v-btn>
          <v-btn icon @click="mokataba.model = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pt-4">
          <v-row>
            <template
              v-for="(col, i) in searched.headers
                .filter(f => !f.readonly)
                .sort((a, b) => a.order - b.order)"
            >
              <v-col
                :key="i"
                cols="12"
                :md="
                  col.fullwidth
                    ? mokataba.fullscreen
                      ? '6'
                      : '12'
                    : mokataba.fullscreen
                    ? '3'
                    : '6'
                "
              >
                <v-text-field
                  v-if="!col.type || col.type == 'text' || col.type == 'date'"
                  v-model="mokataba.item[col.value]"
                  :label="col.text"
                  :type="col.type == 'date' ? 'date' : 'text'"
                  :hint="col.hint"
                  persistent-hint
                  filled
                  :error-messages="errors[col.value]"
                ></v-text-field>
                <v-combobox
                  v-else-if="col.type == 'select'"
                  v-model="mokataba.item[col.value]"
                  :label="col.text"
                  :hint="col.hint"
                  persistent-hint
                  filled
                  :items="selects[col.value]"
                  :error-messages="errors[col.value]"
                ></v-combobox>
                <v-textarea
                  v-else-if="col.type == 'textarea'"
                  v-model="mokataba.item[col.value]"
                  :label="col.text"
                  :hint="col.hint"
                  persistent-hint
                  auto-grow
                  filled
                  :error-messages="errors[col.value]"
                ></v-textarea>
                <div v-else-if="col.type == 'bool'">
                  <v-btn-toggle
                    class="d-block"
                    v-model="mokataba.item[col.value]"
                    mandatory
                  >
                    <v-btn
                      height="58"
                      width="50%"
                      active-class="primary white--text"
                      :value="true"
                      v-text="'تم الإرسال / الورود'"
                    ></v-btn>
                    <v-btn
                      height="58"
                      width="50%"
                      active-class="error white--text"
                      :value="false"
                      v-text="'لم يتم بعد'"
                    ></v-btn>
                  </v-btn-toggle>
                </div>
              </v-col>
            </template>
            <v-col cols="12" class="mt-0 pt-0">
              <div
                v-if="
                  mokataba.item &&
                    Object.keys(mokataba.item).includes('connectedMokatabas') &&
                    mokataba.item.connectedMokatabas.length > 0
                "
                style="display: inline-block"
              >
                <template
                  v-for="(sader, wi) in mokataba.item.connectedMokatabas.split(
                    ','
                  )"
                >
                  <v-chip @click="openSingleView(sader)" :key="wi">
                    {{ sader }}
                  </v-chip>
                </template>
              </div>
              <v-chip @click="sader.model = true" outlined color="primary">
                إضافة صادر
              </v-chip>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="px-4">
          <v-spacer></v-spacer>
          <v-btn
            outlined
            large
            class="px-6"
            color="primary"
            @click="mokataba.model = false"
            v-text="'رجوع'"
          ></v-btn>
          <v-btn
            large
            class="px-6"
            color="primary"
            @click="addOrUpdate()"
            v-text="'حفظ المكاتبة'"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      max-width="450"
      v-if="isCurrentRoute(componentName)"
      scrollable
      v-model="deleteMokataba.model"
    >
      <v-card
        :loading="deleteMokataba.loading"
        :disabled="deleteMokataba.loading"
      >
        <v-card-title class="error white--text">
          حذف مكاتبة
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pt-6">
          هل تريد بالتأكيد حذف المكاتبة رقم
          <span v-if="deleteMokataba.item">
            {{ deleteMokataba.item.number }}
          </span>
          <v-chip v-else small>
            ليس لها رقم
          </v-chip>
        </v-card-text>
        <v-card-actions class="px-4">
          <v-spacer></v-spacer>
          <v-btn
            class="px-6"
            large
            color="error"
            outlined
            @click="deleteMokataba.model = false"
            v-text="'رجوع'"
          ></v-btn>
          <v-btn
            class="px-6"
            large
            color="error"
            @click="runActionDelete()"
            v-text="'حذف المكاتبة'"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-if="isCurrentRoute(componentName)"
      scrollable
      v-model="sader.model"
      max-width="1100"
      :fullscreen="sader.fullscreen"
    >
      <v-card>
        <v-card-title>
          اختر مكاتبة من الصادر
          <v-spacer></v-spacer>
          <v-btn icon @click="sader.fullscreen = !sader.fullscreen">
            <v-icon
              >mdi-window-{{
                sader.fullscreen ? "restore" : "maximize"
              }}</v-icon
            >
          </v-btn>
          <v-btn icon @click="sader.model = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-data-table
          fixed-header
          :headers="
            sader.headers.filter(
              f => (f.adminOnly && isAdmin()) || !f.adminOnly
            )
          "
          :items="sader.items"
          :search="sader.search"
          v-model="sader.selected"
          hide-default-header
        >
          <template v-slot:header="table">
            <table-header-filters
              :items="sader.items"
              :table="table"
              :filters.sync="sader.tableFilters"
            ></table-header-filters>
          </template>
          <template v-slot:footer="table">
            <table-footer-filters
              :filters.sync="sader.tableFilters"
              :table="table"
            ></table-footer-filters>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-btn
              icon
              @click="deselectSader(item.number)"
              v-if="
                mokataba &&
                  mokataba.item &&
                  mokataba.item.connectedMokatabas &&
                  mokataba.item.connectedMokatabas
                    .split(',')
                    .includes(item.number)
              "
            >
              <v-icon color="primary">mdi-checkbox-marked</v-icon>
            </v-btn>
            <v-btn v-else icon @click="selectSader(item.number)">
              <v-icon>mdi-checkbox-blank-outline</v-icon>
            </v-btn>
          </template>
          <template v-slot:item.gotFeedback="{ item }">
            <v-chip :color="item.gotFeedback ? 'success' : 'error'" small>
              {{ item.gotFeedback ? "تم" : "لم يتم" }}
            </v-chip>
          </template>
          <template v-slot:item.subject="{ item }">
            <div
              v-if="item.subject.length <= subjectLimit || item.subjectShown"
            >
              <dynamic-link
                :prefix="['@', '#']"
                :text="item.subject.replace(/(?:\r\n|\r|\n)/g, '<br />')"
              ></dynamic-link>
            </div>
            <div v-else>
              {{ item.subject | filterStrLimit(subjectLimit) }}
            </div>
            <v-chip
              v-if="item.subject.length > subjectLimit"
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
                @click="openTextDialog(item, 'subject', 'الموضوع')"
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
        </v-data-table>
      </v-card>
    </v-dialog>
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
    <v-dialog
      v-if="isCurrentRoute(componentName)"
      scrollable
      v-model="singleView.model"
      max-width="700"
      :fullscreen="singleView.fullscreen"
    >
      <v-card :loading="singleView.loading">
        <v-card-title>
          مكاتبة رقم {{ singleView.item.number }}
          <v-spacer></v-spacer>
          <v-btn icon @click="singleView.fullscreen = !singleView.fullscreen">
            <v-icon
              >mdi-window-{{
                singleView.fullscreen ? "restore" : "maximize"
              }}</v-icon
            >
          </v-btn>
          <v-btn icon @click="singleView.model = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-row>
            <v-col
              cols="12"
              :md="singleView.fullscreen ? '12' : '6'"
              :class="singleView.fullscreen ? '' : 'text-center'"
            >
              <v-subheader
                class="primary--text"
                :style="
                  singleView.fullscreen ? '' : 'flex-direction: column-reverse;'
                "
              >
                -- الجهة المرسل إليها --
              </v-subheader>
              <div>
                {{ singleView.item.sendTo }}
              </div>
            </v-col>
            <v-col
              cols="12"
              :md="singleView.fullscreen ? '12' : '6'"
              :class="singleView.fullscreen ? '' : 'text-center'"
            >
              <v-subheader
                class="primary--text"
                :style="
                  singleView.fullscreen ? '' : 'flex-direction: column-reverse;'
                "
              >
                -- تاريخ المكاتبة --
              </v-subheader>
              <div>
                {{ singleView.item.mokatabaDate }}
              </div>
            </v-col>
          </v-row>
          <v-subheader class="primary--text">
            -- الموضوع --
          </v-subheader>
          <div v-if="singleView.item && singleView.item.subject">
            <dynamic-link
              :prefix="['@', '#']"
              :text="
                singleView.item.subject.replace(/(?:\r\n|\r|\n)/g, '<br />')
              "
            ></dynamic-link>
          </div>
          <div
            v-if="
              singleView.item &&
                singleView.item.type &&
                singleView.item.type == 'wared'
            "
          >
            <v-subheader class="primary--text">
              -- الإجراء المتخذ --
            </v-subheader>
            <div v-if="singleView.item && singleView.item.procedures">
              <dynamic-link
                :prefix="['@', '#']"
                :text="
                  singleView.item.procedures.replace(
                    /(?:\r\n|\r|\n)/g,
                    '<br />'
                  )
                "
              ></dynamic-link>
            </div>
          </div>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-text v-if="isAdmin()">
          <v-row>
            <v-col
              cols="12"
              :md="singleView.fullscreen ? '12' : '6'"
              :class="singleView.fullscreen ? '' : 'text-center'"
            >
              <v-subheader
                class="primary--text"
                :style="
                  singleView.fullscreen ? '' : 'flex-direction: column-reverse;'
                "
              >
                -- وقت إنشائها --
              </v-subheader>
              <div>
                {{ singleView.item.createDate }}
              </div>
            </v-col>
            <v-col
              cols="12"
              :md="singleView.fullscreen ? '12' : '6'"
              :class="singleView.fullscreen ? '' : 'text-center'"
            >
              <v-subheader
                class="primary--text"
                :style="
                  singleView.fullscreen ? '' : 'flex-direction: column-reverse;'
                "
              >
                -- آخر تعديل --
              </v-subheader>
              <div>
                {{ singleView.item.editDate }}
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "mokatabat-wared",
  mounted() {
    this.getOldRecievedFrom();
    this.getMokatabas();
  },
  filters: {
    filterStrLimit(str, limit) {
      return `${str.length <= limit ? str : str.substr(0, limit) + "..."}`;
    }
  },
  data: () => ({
    componentName: "mokatabat_wared",
    subjectLimit: 30,
    mokataba: {
      model: false,
      loading: false,
      type: "create", // create - update
      item: {},
      fullscreen: false
    },
    singleView: {
      loading: false,
      fullscreen: false,
      item: {}
    },
    selects: {
      recievedFrom: []
    },
    tableFilters: {},
    sader: {
      tableFilters: {},
      fullscreen: false,
      model: false,
      items: [],
      headers: [
        {
          text: "رقم المكاتبة",
          value: "number",
          sortable: true
        },
        {
          text: "تاريخ المكاتبة",
          value: "mokatabaDate",
          sortable: true
        },
        {
          text: "جهة المكاتبة",
          value: "recievedFrom"
        },
        {
          text: "الموضوع",
          value: "subject",
          sortable: true,
          order: 5,
          fullwidth: true,
          type: "textarea"
        },
        {
          text: "الإجراء المتخذ",
          value: "procedures"
        },
        {
          text: "تمام الرد",
          value: "connectedMokatabas"
        },
        {
          text: "",
          sortable: false,
          value: "actions"
        }
      ],
      search: "",
      selected: []
    },
    searched: {
      printer: {},
      search: "",
      headers: [
        {
          text: "رقم المكاتبة",
          value: "number",
          sortable: true,
          order: 1,
          hint: "في حال عدم وجود رقم للمكاتبة, اكتب بدون"
        },
        {
          text: "تاريخ المكاتبة",
          value: "mokatabaDate",
          sortable: true,
          order: 2,
          type: "date",
          hint:
            "التاريخ المدون في ورقة المكاتبة, وليس تاريخ تسجيل المكاتبة على المنظومة"
        },
        {
          text: "جهة المكاتبة",
          value: "recievedFrom",
          type: "select",
          sortable: true,
          order: 3
        },
        {
          text: "الموضوع",
          value: "subject",
          sortable: true,
          order: 5,
          fullwidth: true,
          type: "textarea"
        },
        {
          text: "الإجراء المتخذ",
          value: "procedures",
          sortable: true,
          order: 6,
          fullwidth: true,
          type: "textarea"
        },
        {
          text: "رقم الصادر",
          value: "connectedMokatabas",
          sortable: true,
          readonly: true,
          rejectReadonly: true,
          unrequired: true
        },
        {
          text: "وقت إنشائها",
          value: "createDate",
          sortable: true,
          adminOnly: true,
          readonly: true
        },
        {
          text: "آخر تعديل",
          value: "editDate",
          sortable: true,
          adminOnly: true,
          readonly: true
        },
        {
          text: "",
          value: "actions",
          sortable: false,
          readonly: true
        }
      ],
      items: [],
      selected: []
    },
    deleteMokataba: {
      item: {},
      loading: false,
      model: false
    },
    errors: {},
    textDialog: {
      model: false,
      fullscreen: false,
      title: "",
      text: ""
    }
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
            this.searched.printer.cons = sorted;
          }
        }
      }
    },
    async openSingleView(number) {
      this.$set(this.singleView, "item", {});
      this.$set(this.singleView, "model", true);
      this.$set(this.singleView, "loading", true);
      let mokataba = await this.api("global/get_one", {
        table: "mokatabas",
        where: {
          number: number,
          type: "sader"
        }
      });
      if (mokataba && mokataba.ok && mokataba.data) {
        let data = this.fixDates(
          [mokataba.data],
          ["mokatabaDate", "createDate", "editDate"]
        )[0];
        this.$set(this.singleView, "item", data);
      } else {
        this.$set(this.singleView, "model", false);
        this.showError("هذه المكاتبة محذوفة.");
      }
      this.$set(this.singleView, "loading", false);
    },
    openTextDialog(item, modelToOpen, title) {
      this.$set(
        this.textDialog,
        "title",
        title ? `${title} - مكاتبة رقم ${item.number}` : "عرض نص"
      );
      this.$set(this.textDialog, "text", item[modelToOpen]);
      this.$set(this.textDialog, "model", true);
    },
    selectSader(number) {
      let { connectedMokatabas } = this.mokataba.item,
        splitted =
          connectedMokatabas && connectedMokatabas.length > 0
            ? connectedMokatabas.split(",")
            : [];
      if (!splitted.includes(number)) {
        splitted.push(number);
      }
      let joined = splitted.join(",");
      this.$set(this.mokataba.item, "connectedMokatabas", joined);
    },
    deselectSader(number) {
      let { connectedMokatabas } = this.mokataba.item,
        splitted =
          connectedMokatabas && connectedMokatabas.length > 0
            ? connectedMokatabas.split(",")
            : [];
      if (splitted.includes(number)) {
        let index = splitted.indexOf(number);
        splitted.splice(index, 1);
      }
      let joined = splitted.join(",");
      this.$set(this.mokataba.item, "connectedMokatabas", joined);
    },
    async getOldRecievedFrom() {
      let items = await this.api("global/get_all", {
        table: "mokatabas",
        attrs: ["recievedFrom", "sendTo"]
      });
      if (items.ok && items.data) {
        let mapped = [];
        mapped = [
          ...items.data
            .filter(f => f.recievedFrom && f.recievedFrom.length > 0)
            .map(f => f.recievedFrom),
          ...items.data
            .filter(f => f.sendTo && f.sendTo.length > 0)
            .map(f => f.sendTo)
        ];
        this.$set(this.selects, "recievedFrom", [...new Set(mapped)]);
      }
    },
    async addOrUpdate() {
      this.$set(this.mokataba, "loading", true);
      let cols = this.searched.headers
        .filter(
          f => !f.readonly || (f.readonly && f.rejectReadonly && !f.unrequired)
        )
        .map(f => f.value);
      this.$set(this, "errors", {});
      let { type, item } = this.mokataba,
        id = item.id,
        errors = {};
      cols.forEach((col, i) => {
        if (!item[col] && item[col] !== false) {
          errors[col] = "لا يمكن ترك هذا الحقل فارغ";
        }
      });
      console.log(errors);
      if (Object.keys(errors).length > 0) {
        this.$set(this, "errors", { ...errors });
        this.$set(this.mokataba, "loading", false);
        return;
      }
      let fixedItem = {
        number: item.number,
        mokatabaDate: this.fixDate(item.mokatabaDate),
        recievedFrom: item.recievedFrom,
        subject: item.subject,
        procedures: item.procedures,
        connectedMokatabas: item.connectedMokatabas
      };
      if (type == "create") {
        fixedItem.createDate = new Date();
      } else {
        fixedItem.editDate = new Date();
      }
      delete fixedItem.id;
      let addOrUpdate = await this.api(`global/${type}_one`, {
        table: "mokatabas",
        where:
          type == "update"
            ? {
                id: id
              }
            : { ...fixedItem, type: "wared" },
        update: fixedItem
      });
      this.getMokatabas();
      this.$set(this.mokataba, "loading", false);
      this.$set(this.mokataba, "model", false);
    },
    actionNew() {
      this.$set(this.mokataba, "item", {});
      this.$set(this.mokataba, "type", "create");
      this.$set(this.mokataba, "model", true);
    },
    actionEdit(item) {
      let cols = this.searched.headers
        .filter(f => !f.readonly || (f.readonly && f.rejectReadonly))
        .map(f => f.value);
      cols.forEach((col, i) => {
        this.$set(this.mokataba.item, col, item[col]);
      });
      this.$set(this.mokataba.item, "id", item.id);
      this.$set(this.mokataba, "type", "update");
      this.$set(this.mokataba, "model", true);
    },
    runActionDelete() {
      this.$set(this.deleteMokataba, "loading", true);
      let { id } = this.deleteMokataba.item;
      this.api("global/delete_all", {
        table: "mokatabas",
        where: {
          id,
          type: "wared"
        }
      })
        .then(x => {
          this.$set(this.deleteMokataba, "model", false);
          this.showSuccess("تم حذف المكاتبة");
          this.getMokatabas();
        })
        .catch(error => {
          this.showError("تعذر حذف المكاتبة من قاعدة البيانات.");
        })
        .finally(() => {
          this.$set(this.deleteMokataba, "loading", false);
        });
    },
    actionDelete(item) {
      this.$set(this.deleteMokataba, "item", { ...item });
      this.$set(this.deleteMokataba, "model", true);
    },
    async getMokatabas() {
      let mokatabas = await this.api("global/get_all", {
        table: "mokatabas"
      });
      let items = this.fixDates(mokatabas.data, [
        "mokatabaDate",
        "createDate",
        "editDate"
      ]);
      items.forEach(item => {
        item.subjectShown = false;
        item.proceduresShown = false;
        item.connectedMokatabas = item.connectedMokatabas
          ? item.connectedMokatabas
          : "";
      });
      let sader = items.filter(f => f.type == "sader"),
        wared = items.filter(f => f.type == "wared");
      let printer = {
        cons: [...wared],
        excelKey: "cons",
        excelHeaders: this.searched.headers
      };
      this.$set(this.searched, "items", wared);
      this.$set(this.searched, "printer", printer);
      this.$set(this.sader, "items", sader);
    }
  }
};
</script>
