<template>
  <div>
    <v-card :loading="searchLoading" :disabled="searchLoading">
      <v-card-title>
        بحث متقدم في المتابعات
        <v-spacer></v-spacer>
        <v-btn
          v-if="canAddFollowup()"
          @click="actionAdd()"
          large
          outlined
          color="primary"
        >
          إضافة متابعة
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
              <v-btn-toggle
                v-else-if="h.type == 'checkbox'"
                v-model="search[h.searchValue]"
                class="d-block"
              >
                <v-btn
                  height="58"
                  width="50%"
                  :color="
                    search[h.searchValue] === true ? 'error white--text' : ''
                  "
                  :value="true"
                  v-text="h.trueValue"
                ></v-btn>
                <v-btn
                  height="58"
                  width="50%"
                  :color="
                    search[h.searchValue] === false ? 'success white--text' : ''
                  "
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
          v-text="'بحث في المتابعات'"
        ></v-btn>
      </v-card-actions>
    </v-card>
    <v-card class="mt-8">
      <v-card-title>
        المتابعات
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
        <template v-slot:item.subject="{ item }">
          <div v-if="item.subject">
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
          </div>
        </template>
        <template v-slot:item.procedure="{ item }">
          <div v-if="item.procedure">
            <div
              v-if="
                item.procedure.length <= subjectLimit || item.procedureShown
              "
            >
              <dynamic-link
                :prefix="['@', '#']"
                :text="item.procedure.replace(/(?:\r\n|\r|\n)/g, '<br />')"
              ></dynamic-link>
            </div>
            <div v-else>
              {{ item.procedure | filterStrLimit(subjectLimit) }}
            </div>
            <v-chip
              v-if="item.procedure.length > subjectLimit"
              color="transparent"
            >
              <v-btn
                @click="item.procedureShown = !item.procedureShown"
                icon
                small
                depressed
              >
                <v-icon>
                  mdi-window-{{ item.procedureShown ? "restore" : "maximize" }}
                </v-icon>
              </v-btn>
              <v-btn
                @click="openTextDialog(item, 'procedure', 'الإجرائات المتخذة')"
                icon
                small
                depressed
              >
                <v-icon>
                  mdi-window-open
                </v-icon>
              </v-btn>
            </v-chip>
          </div>
        </template>
        <template v-slot:item.followupAmana="{ item }">
          <div v-if="item.followupAmana">
            <div
              v-if="
                item.followupAmana.length <= subjectLimit || item.subjectShown
              "
            >
              <dynamic-link
                :prefix="['@', '#']"
                :text="item.followupAmana.replace(/(?:\r\n|\r|\n)/g, '<br />')"
              ></dynamic-link>
            </div>
            <div v-else>
              {{ item.followupAmana | filterStrLimit(subjectLimit) }}
            </div>
            <v-chip
              v-if="item.followupAmana.length > subjectLimit"
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
                @click="
                  openTextDialog(item, 'followupAmana', 'الإجراءات المتخذة')
                "
                icon
                small
                depressed
              >
                <v-icon>
                  mdi-window-open
                </v-icon>
              </v-btn>
            </v-chip>
          </div>
        </template>
        <template v-slot:item.isFollowed="{ item }">
          <v-chip
            :color="item.isFollowed == true ? 'error' : 'success'"
            @click="isAdmin() ? saveItem(item) : null"
          >
            {{ item.isFollowed == true ? "نعم" : "لا" }}
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
        <template v-slot:item.isApproved="{ item }">
          <v-chip :color="item.isApproved == true ? 'success' : 'error'">
            {{ item.isApproved == true ? " موافق" : "غير موافق" }}
          </v-chip>
        </template>
        <template v-slot:item.notApprovedReason="{ item }">
          <v-chip
            :color="
              item.isApproved == true
                ? 'success'
                : item.notApprovedReason == null
                ? 'gray'
                : 'error'
            "
          >
            {{
              item.isApproved == true
                ? "تم"
                : item.notApprovedReason == null
                ? "مطلوب ملاحظه"
                : item.notApprovedReason
            }}
          </v-chip>
        </template>
      </v-data-table>
    </v-card>
    <v-dialog
      v-if="isCurrentRoute(componentName)"
      scrollable
      :fullscreen="textDialog.fullscreen"
      v-model="textDialog.model"
      max-width="650"
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
    <v-dialog persistent v-model="followup.model" scrollable max-width="750">
      <v-card :loading="followup.loading" :disabled="followup.loading">
        <v-card-title>
          متابعة
          <v-spacer></v-spacer>
          <v-btn @click="followup.model = false" icon>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-row>
            <template
              v-for="(h, i) in headers
                .filter(h => h.inSearch)
                .sort((a, b) => a.sort - b.sort)"
            >
              <v-col :cols="h.cols ? h.cols : '6'" :key="i">
                <v-text-field
                  v-if="!h.type || ['text', 'date'].includes(h.type)"
                  filled
                  :type="h.type == 'date' ? 'date' : 'text'"
                  :label="h.text"
                  v-model="followup.item[h.searchValue]"
                  :hide-details="h.hint ? false : true"
                  :persistent-hint="h.hint ? true : false"
                  :readonly="
                    h.readonly ||
                      canEditMe(h.searchValue) == false ||
                      (h.allowFunction && runFun(h.allowFunction) == false)
                  "
                ></v-text-field>
                <v-autocomplete
                  v-else-if="h.type == 'select'"
                  filled
                  :label="h.text"
                  :multiple="h.multiple"
                  :readonly="
                    h.readonly ||
                      canEditMe(h.searchValue) == false ||
                      (h.allowFunction && runFun(h.allowFunction) == false)
                  "
                  v-model="followup.item[h.searchValue]"
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
                  v-model="followup.item[h.searchValue]"
                  :hide-details="h.hint ? false : true"
                  :persistent-hint="h.hint ? true : false"
                  auto-grow
                  :readonly="
                    h.readonly ||
                      canEditMe(h.searchValue) == false ||
                      (h.allowFunction && runFun(h.allowFunction) == false)
                  "
                  rows="1"
                ></v-textarea>
                <v-card
                  v-else-if="h.type == 'checkbox'"
                  flat
                  tile
                  color="transparent"
                  class="pa-0 ma-0"
                  :disabled="
                    h.readonly ||
                      canEditMe(h.searchValue) == false ||
                      (h.allowFunction && runFun(h.allowFunction) == false)
                  "
                >
                  <v-btn-toggle
                    v-model="followup.item[h.searchValue]"
                    class="d-block"
                    mandatory
                  >
                    <v-btn
                      height="58"
                      width="50%"
                      :color="
                        followup.item[h.searchValue] === true
                          ? 'error white--text'
                          : ''
                      "
                      :value="true"
                      v-text="h.trueValue"
                    ></v-btn>
                    <v-btn
                      height="58"
                      width="50%"
                      :color="
                        followup.item[h.searchValue] === false
                          ? 'success white--text'
                          : ''
                      "
                      :value="false"
                      v-text="h.falseValue"
                    ></v-btn>
                  </v-btn-toggle>
                </v-card>
              </v-col>
            </template>
          </v-row>
        </v-card-text>
        <v-card-actions class="px-4">
          <v-btn
            color="error"
            text
            large
            class="px-6"
            @click="actionDelete(followup.item)"
            v-text="'حذف المتابعة'"
            v-if="isAdmin()"
          ></v-btn>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            outlined
            large
            class="px-6"
            @click="followup.model = false"
            v-text="'رجوع'"
          ></v-btn>
          <v-btn
            color="primary"
            large
            class="px-6"
            @click="saveItem()"
            v-text="'حفظ المتابعة'"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog scrollable max-width="450" v-model="followup.deleteModel">
      <v-card :loading="followup.loading" :disabled="followup.loading">
        <v-card-title class="error white--text">
          حذف متابعة
          <v-spacer></v-spacer>
          <v-btn dark @click="followup.deleteModel = false" icon>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="pt-4">
          هل أنت متأكد من حذف المتابعة رقم {{ followup.item.corresNumber }}؟
        </v-card-text>
        <v-card-actions class="px-4">
          <v-spacer></v-spacer>
          <v-btn
            color="error"
            outlined
            class="px-6"
            large
            v-text="'رجوع'"
            @click="followup.deleteModel = false"
          ></v-btn>
          <v-btn
            color="error"
            class="px-6"
            large
            v-text="'حذف المتابعة'"
            @click="deleteItem()"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- <v-dialog scrollable max-width="700" v-model="followup.viewModel">
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
  name: "followup",
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
    followup: {
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
        searchValue: "actionsStart",
        sortable: false,
        inTable: true,
        sort: 0
      },
      {
        text: "التاريخ",
        value: "date",
        searchValue: "date",
        sortable: true,
        type: "date",
        inSearch: true,
        inTable: true,
        sort: 2
      },
      // 20s, قرار السببية - 21s - 170س - شهادة الوفاة - تسليم الموقف المالي تأمين ومعاشات -
      // الوفاة
      {
        text: "رقم المكاتبة",
        value: "corresNumber",
        searchValue: "corresNumber",
        sortable: true,
        type: "text",
        inSearch: true,
        inTable: true,
        sort: 1
      },
      {
        text: "القسم المختص",
        value: "branch",
        searchValue: "branch",
        multiple: true,
        sortable: true,
        type: "select",
        inSearch: true,
        inTable: true,
        sort: 4
      },
      {
        text: "جهة الوارد",
        value: "direction",
        searchValue: "direction",
        sortable: true,
        type: "text",
        inSearch: true,
        inTable: true,
        sort: 3
      },
      {
        text: "الوحدة المنوطة",
        value: "unit.unitText",
        searchValue: "unitId",
        sortable: true,
        type: "select",
        inSearch: true,
        inTable: true,
        sort: 5
      },
      {
        text: "الموضوع",
        value: "subject",
        searchValue: "subject",
        sortable: true,
        type: "textarea",
        inSearch: true,
        inTable: true,
        cols: "12",
        sort: 7
      },
      {
        text: "قرار رئيس الفرع",
        value: "branchSuperiorDecision",
        searchValue: "branchSuperiorDecision",
        sortable: true,
        type: "textarea",
        inSearch: true,
        inTable: true,
        cols: "12",
        sort: 8
      },
      {
        text: "الإجراء المتخذ",
        value: "procedure",
        searchValue: "procedure",
        sortable: true,
        type: "textarea",
        inSearch: true,
        inTable: true,
        cols: "12",
        sort: 9
      },
      {
        text: "متابع",
        trueValue: "متابع",
        falseValue: "غير متابع",
        value: "isFollowed",
        searchValue: "isFollowed",
        sortable: true,
        type: "checkbox",
        inSearch: true,
        inTable: true,
        sort: 6,
        allowFunction: "canUnfollow"
      },
      {
        text: "",
        value: "actions",
        searchValue: "actions",
        sortable: false,
        sort: 10
      },
      {
        text: "موافقه رائيس الفرع",
        value: "isApproved",
        searchValue: "isApproved",
        sortable: false,
        type: "checkbox",
        inSearch: false,
        inTable: true,
        cols: "12",
        sort: 11
      },

      {
        text: "ملاحظات رائيس الفرع",
        value: "notApprovedReason",
        searchValue: "notApprovedReason",
        sortable: false,
        type: "textarea",
        inSearch: false,
        inTable: true,
        cols: "12",
        sort: 12
      }
    ],
    items: [],
    tableFilters: {},
    componentName: "followup",
    selects: {
      branch: {
        text: "x",
        value: "x",
        data: [
          {
            x: "التسجيل"
          },
          {
            x: "الاحتياط"
          },
          {
            x: "الهروب"
          },
          {
            x: "إنهاء الخدمة"
          },
          {
            x: "السيكرتارية"
          },
          {
            x: "النظم"
          },
          {
            x: "خدمة المواطنين"
          }
        ]
      },
      unitId: {
        table: "units",
        text: "unitText",
        value: "unitId",
        data: []
      }
    },
    printer: {}
  }),
  methods: {
    log(item) {
      console.log("====================================");
      console.log("item", item);
      console.log("====================================");
    },
    canUnfollow() {
      let { section, canUnfollow } = this.$store.state.currentUser;
      return section == 0 || canUnfollow == true;
    },
    canAddFollowup() {
      let { section, canAddFollowup } = this.$store.state.currentUser;
      return section == 0 || canAddFollowup == true;
    },
    runFun(f) {
      return this[f]();
    },
    canEditMe(v) {
      let {
        section,
        canAddFollowup,
        canUnfollow
      } = this.$store.state.currentUser;
      return (
        v == "procedure" ||
        section == 0 ||
        canAddFollowup == true ||
        (canUnfollow && v == "isFollowed")
      );
    },
    async deleteItem() {
      let { corresId } = this.followup.item;
      this.$set(this.followup, "loading", true);
      let deleteItem = await this.api(`global/delete_all`, {
        table: "correspondences",
        where: {
          corresId
        }
      });
      if (deleteItem && deleteItem.data && deleteItem.ok) {
        this.showSuccess("تم حذف المتابعة");
        this.findItems();
        this.$set(this.followup, "deleteModel", false);
        this.$set(this.followup, "model", false);
      } else {
        this.showError("تعذر حذف المتابعة من قاعدة البيانات");
      }
      this.$set(this.followup, "loading", false);
    },
    actionEdit(item) {
      console.log(item);
      this.$set(this.followup, "item", { ...item });
      this.$set(this.followup, "model", true);
    },
    actionDelete(item) {
      this.$set(this.followup, "item", { ...item });
      this.$set(this.followup, "deleteModel", true);
    },
    async saveItem(edirableFromTableItem) {
      if (edirableFromTableItem) {
        edirableFromTableItem.isFollowed = edirableFromTableItem.isFollowed
          ? false
          : true;
      }
      this.$set(this.followup, "loading", true);
      let item = edirableFromTableItem
          ? edirableFromTableItem
          : { ...this.followup.item },
        parts = this.selects.branch.data.map(b => b.x),
        itemsToAdd = [];
      item.branch.forEach(b => {
        let newItem = { ...item };
        newItem.branch = b;
        newItem.partId = parts.indexOf(b) + 1;
        itemsToAdd.push(newItem);
      });
      let corresId = item.corresId,
        isCreate = !corresId ? true : false;
      itemsToAdd.forEach(async itemToAdd => {
        let where = { ...itemToAdd };
        delete where.corresId;
        if (isCreate) {
          where.createdBy = this.$store.state.currentUser.realName;
        } else {
          where.modifiedBy = this.$store.state.currentUser.realName;
        }
        let saveItem = await this.api(
          `global/${isCreate ? "create" : "update"}_one`,
          {
            table: "correspondences",
            where: isCreate
              ? where
              : {
                  corresId
                },
            update: where,
            returner: "corresId"
          }
        );
        if (saveItem && saveItem.data && saveItem.ok) {
          edirableFromTableItem ? null : this.showSuccess("تم حفظ المتابعة");
          if (!isCreate) {
            this.findItems();
          }
          this.$set(this.followup, "model", false);
        } else {
          this.showError("تعذر حفظ المتابعة في قاعدة البيانات");
        }
        this.$set(this.followup, "loading", false);
      });
    },
    openTextDialog(item, modelToOpen, title) {
      this.$set(
        this.textDialog,
        "title",
        title ? `${title} - متابعة بتاريخ ${item.date}` : "عرض نص"
      );
      this.$set(this.textDialog, "text", item[modelToOpen]);
      this.$set(this.textDialog, "model", true);
    },
    findItems() {
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);
      let {
          section,
          canUnfollow,
          canAddFollowup
        } = this.$store.state.currentUser,
        where = { ...this.search },
        likes = ["direction", "subject", "branchSuperiorDecision", "procedure"],
        dates = ["date"],
        multi = ["branch"];
      Object.keys(where).forEach(key => {
        let val = where[key];
        if (!val && val !== false && val !== 0) {
          delete where[key];
          return;
        }
        if (dates.includes(key)) {
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
        } else if (likes.includes(key)) {
          where[key] = {
            $like: `%${val}%`
          };
        } else if (multi.includes(key)) {
          where[key] = {
            $in: val
          };
        }
      });
      if (section !== 0 && !canUnfollow && !canAddFollowup) {
        let partSection = {
          0: {
            $in: [5, 6]
          },
          1: 1,
          2: 2,
          3: 4,
          4: {
            $in: [3, 7]
          }
        };
        where.partId = partSection[section];
      }
      console.log(where);
      this.api("global/get_all", {
        table: "correspondences",
        where,
        include: [
          {
            model: "units",
            required: false
          }
        ],
        order: [["corresId", "desc"]]
      })
        .then(x => {
          let data = this.fixDates(x.data, ["date"]),
            printer = {
              cons: [...data],
              excelKey: "cons",
              excelHeaders: this.headers.filter(f => f.inSearch)
            };
          data.forEach(el => {
            // if (this.isAdmin()) {
            //   el.subjectShown = true;
            //   el.procedureShown = true;
            // } else {
            el.subjectShown = false;
            el.procedureShown = false;
            // }

            el.branch = el.branch ? [...el.branch.split(",")] : [];
          });
          console.log(data);
          this.$set(this, "items", data);
          this.$set(this, "printer", printer);
        })
        .catch(error => {
          this.showError("حدث خطأ أثناء احضار المتابعات من قاعدة البيانات");
          console.log(error);
        })
        .finally(() => {
          this.$set(this, "searchLoading", false);
        });
    },
    init(specificTable = "") {
      // Get selects
      Object.keys(this.selects).forEach(key => {
        let { table, localTable, text, value } = this.selects[key];
        if (table) {
          let obj = {
            table
          };
          obj.attrs = [text, value];
          this.$set(this.selects[key], "loading", true);
          this.api("global/get_all", obj)
            .then(x => {
              this.$set(this.selects[key], "data", x.data);
            })
            .catch(error => {
              console.log(error);
              this.$set(
                this.selects[key],
                "error",
                "حدث خطأ أثناء استدعاء الداتا من قاعدة البيانات"
              );
            })
            .finally(() => {
              this.$set(this.selects[key], "loading", false);
            });
        } else if (localTable) {
          this.$set(this.selects[key], "loading", true);
          let data = this.localTable(localTable);
          this.$set(this.selects[key], "data", data);
          this.$set(this.selects[key], "loading", false);
        }
      });
    },
    actionAdd() {
      this.$set(this.followup, "item", {});
      this.$set(this.followup, "model", true);
    }
  }
};
</script>
