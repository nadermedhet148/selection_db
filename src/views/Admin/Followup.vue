<template>
  <div>
    <v-card :loading="searchLoading" :disabled="searchLoading">
      <v-card-title>
        المتابعات
        <v-spacer></v-spacer>
        <v-spacer></v-spacer>
        <printer-menu
          :disabled="displayedItems.length == 0"
          :data="printer"
          :fab="false"
        ></printer-menu>
      </v-card-title>
    </v-card>

    <v-card class="mt-8">
      <v-tabs height="60">
        <template v-for="branch in branchs">
          <v-tab
            class="ls-0 text-body-1 grey--text"
            :class="currentTab == branch.text ? 'primary--text' : ''"
            @click="
              itemsFilter(branch.text);
              currentBranch = branch.text;
            "
            :key="branch"
          >
            {{ branch.text }}
            <v-chip
              class="ms-3"
              :color="currentTab == branch.text ? 'primary' : ''"
            >
              {{ itemNumber[branch.id] }}
            </v-chip>
          </v-tab>
        </template>
        <v-spacer></v-spacer>
        <v-chip
          class="ms-3"
          :color="primary"
          large
          link
          @click="lateDialog = true"
        >
          {{
            lateDays == 0 ? " عرض المأخرات" : lateDays + " ايام متاخرات"
          }}</v-chip
        >
        <v-checkbox
          v-model="isDone"
          label="تم المراجعه"
          color="green"
          @click="hotRefresh()"
        >
        </v-checkbox>
      </v-tabs>

      <v-data-table
        :headers="headers"
        :items="displayedItems"
        hide-default-header
        fixed-header
        multi-sort
      >
        <template v-slot:header="table">
          <table-header-filters
            :items="displayedItems"
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
                @click="openTextDialog(item, 'الموضوع')"
                icon
                small
                depressed
              >
                <v-icon> mdi-window-open </v-icon>
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
                @click="openTextDialog(item, 'الإجرائات المتخذة')"
                icon
                small
                depressed
              >
                <v-icon> mdi-window-open </v-icon>
              </v-btn>
            </v-chip>
          </div>
        </template>
        <template v-slot:item.isApproved="{ item }">
          <v-chip
            :color="item.isApproved == true ? 'success' : 'error'"
            @click="isAdmin() ? saveItem(item, 'موافقه رائيس الفرع') : null"
          >
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
            @click="
              item.isApproved ? null : (notApprovedReasonDialog = true);
              currentItem = item;
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
    <v-dialog scrollable max-width="500" v-model="lateDialog">
      <v-card>
        <v-card-title class="white--text primary">
          ادخل عدد الايام المتاخرات
          <v-spacer></v-spacer>
          <v-btn icon @click="lateDialog = false" class="white--text">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pt-4">
          <v-text-field
            label="عدد الايام"
            type="number"
            min="0"
            v-model="lateDays"
          >
          </v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="white--text"
            class="white--text primary"
            outlined
            @click="
              hotRefresh();
              lateDialog = false;
            "
            v-text="'عرض'"
            large
          ></v-btn>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            outlined
            @click="lateDialog = false"
            v-text="'عودة'"
            large
            class="px-6"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog max-width="500" v-model="notApprovedReasonDialog">
      <v-card>
        <v-card-title class="white--text primary">
          اضافه ملاحظه علي المتابعه
          <v-spacer></v-spacer>
          <v-btn
            icon
            @click="notApprovedReasonDialog = false"
            class="white--text"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pt-4">
          <v-text-field label="الملاحظه" type="text" v-model="reasonText">
          </v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="white--text"
            class="white--text primary"
            outlined
            @click="
              isAdmin() ? saveItem(currentItem, 'ملاحظات رائيس الفرع') : null;
              notApprovedReasonDialog = false;
            "
            v-text="'اضافه'"
            large
          ></v-btn>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            outlined
            @click="lateDialog = false"
            v-text="'عودة'"
            large
            class="px-6"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "followup",
  mounted() {
    // this.initDates();
    //this.init();
    this.findItems().then(() => {
      this.$set(
        this.itemNumber,
        "enha2",
        this.itemsFilter("إنهاء الخدمة").length
      );
      this.$set(this.itemNumber, "horob", this.itemsFilter("الهروب").length);
      this.$set(this.itemNumber, "e7tiat", this.itemsFilter("الاحتياط").length);
      this.$set(
        this.itemNumber,
        "secretary",
        this.itemsFilter("السيكرتارية").length
      );
      this.$set(this.itemNumber, "nozom", this.itemsFilter("النظم").length);
      this.$set(
        this.itemNumber,
        "services",
        this.itemsFilter("خدمة المواطنين").length
      );
      this.$set(this.itemNumber, "tasgeel", this.itemsFilter("التسجيل").length);
    });
  },
  filters: {
    filterStrLimit(str, limit) {
      return `${str.length <= limit ? str : str.substr(0, limit) + ".."}`;
    }
  },
  data: () => ({
    lateDialog: false,
    notApprovedReasonDialog: false,
    currentItem: null,
    reasonText: null,
    currentBranch: "التسجيل",
    lateDays: 0,
    isDone: true,
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
      // {
      //   text: "",
      //   value: "actionsStart",
      //   searchValue: "actionsStart",
      //   sortable: false,
      //   inTable: true,
      //   sort: 0
      // },

      {
        text: "التاريخ",
        value: "date",
        sortable: true
      },
      // 20s, قرار السببية - 21s - 170س - شهادة الوفاة - تسليم الموقف المالي تأمين ومعاشات -
      // الوفاة
      {
        text: "رقم المكاتبة",
        value: "corresNumber",
        searchValue: "corresNumber",
        sortable: false,
        type: "text",
        inSearch: true,
        inTable: true,
        sort: 1
      },
      {
        text: "جهة الوارد",
        value: "direction",
        searchValue: "direction",
        sortable: false,
        type: "text",
        inSearch: true,
        inTable: true,
        sort: 3
      },
      {
        text: "الوحدة المنوطة",
        value: "unit.unitText",
        searchValue: "unitId",
        sortable: false,
        type: "select",
        inSearch: true,
        inTable: true,
        sort: 5
      },
      {
        text: "الموضوع",
        value: "subject",
        searchValue: "subject",
        sortable: false,
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
        sortable: false,
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
        sortable: false,
        type: "textarea",
        inSearch: true,
        inTable: true,
        cols: "12",
        sort: 9
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
        inSearch: true,
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
        inSearch: true,
        inTable: true,
        cols: "12",
        sort: 12
      }
    ],
    items: [],
    displayedItems: [],
    itemNumber: {
      tasgeel: 0,
      enha2: 0,
      horob: 0,
      e7tiat: 0,
      nozom: 0,
      secretary: 0,
      services: 0
    },
    branchs: [
      { text: "التسجيل", id: "tasgeel" },
      { text: "إنهاء الخدمة", id: "enha2" },
      { text: "الهروب", id: "horob" },
      { text: "الاحتياط", id: "e7tiat" },
      { text: "السيكرتارية", id: "secretary" },
      { text: "النظم", id: "nozom" },
      { text: "خدمة المواطنين", id: "services" }
    ],

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
    openTextDialog(item, title) {
      switch (title) {
        case "الإجرائات المتخذة":
          this.$set(
            this.textDialog,
            "title",
            `${title} - متابعة بتاريخ ${item.date}`
          );
          this.$set(
            this.textDialog,
            "text",
            "الاجراء اتخز بواسطه :" +
              item.modifiedBy +
              "\n----------:- " +
              item.procedure
          );
          break;
        case "الموضوع":
          this.$set(
            this.textDialog,
            "title",
            `${title} - متابعة بتاريخ ${item.date}`
          );
          this.$set(this.textDialog, "text", item.subject);
          break;
      }

      this.$set(this.textDialog, "model", true);
    },
    async saveItem(edirableFromTableItem, filter) {
      switch (filter) {
        case "موافقه رائيس الفرع":
          edirableFromTableItem.isApproved = !edirableFromTableItem.isApproved;
          break;
        case "ملاحظات رائيس الفرع":
          edirableFromTableItem.notApprovedReason = this.reasonText;
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
            this.refresh();
          }
          this.$set(this.followup, "model", false);
        } else {
          this.showError("تعذر حفظ المتابعة في قاعدة البيانات");
        }
        this.$set(this.followup, "loading", false);
        this.reasonText = null;
      });
    },
    async findItems() {
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
      await this.api("global/get_all", {
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
    initDates() {
      let dates = this.headers
        .filter(h => h.type == "date")
        .map(h => h.searchValue);
      dates.forEach(d => {
        this.$set(this.search, d, []);
      });
    },

    itemsFilter(branch) {
      this.displayedItems = this.items.filter(
        item =>
          item.branch.indexOf(branch) > -1 &&
          (this.isDone
            ? item.procedure != null && item.procedure != ""
            : true) &&
          Math.round(
            Math.abs(Date.now() - Date.parse(item.date)) / (1000 * 60 * 60 * 24)
          ) +
            1 >
            this.lateDays
      );

      console.log(this.displayedItems);
      console.log(this.isDone);
      this.currentTab = branch;
      return this.displayedItems;
    },
    getEnglishName(branch) {
      switch (branch) {
        case "التسجيل":
          return "tasgeel";
        case "إنهاء الخدمة":
          return "enha2";
        case "الهروب":
          return "horob";
        case "الاحتياط":
          return "e7tiat";
        case "السيكرتارية":
          return "secretary";
        case "النظم":
          return "nozom";
        case "خدمة المواطنين":
          return "services";
      }
    },
    async refresh() {
      this.findItems().then(() => {
        switch (this.currentBranch) {
          case "التسجيل":
            this.$set(
              this.itemNumber,
              "tasgeel",
              this.itemsFilter("التسجيل").length
            );
            break;
          case "خدمة المواطنين":
            this.$set(
              this.itemNumber,
              "services",
              this.itemsFilter("خدمة المواطنين").length
            );
            break;
          case "إنهاء الخدمة":
            this.$set(
              this.itemNumber,
              "enha2",
              this.itemsFilter("إنهاء الخدمة").length
            );
            break;
          case "الهروب":
            this.$set(
              this.itemNumber,
              "horob",
              this.itemsFilter("الهروب").length
            );
            break;
          case "الاحتياط":
            this.$set(
              this.itemNumber,
              "e7tiat",
              this.itemsFilter("الاحتياط").length
            );
            break;
          case "السيكرتارية":
            this.$set(
              this.itemNumber,
              "secretary",
              this.itemsFilter("السيكرتارية").length
            );
            break;
          case "النظم":
            this.$set(
              this.itemNumber,
              "nozom",
              this.itemsFilter("النظم").length
            );
            break;
        }
      });
    },
    async hotRefresh() {
      this.findItems().then(() => {
        this.$set(
          this.itemNumber,
          "enha2",
          this.itemsFilter("إنهاء الخدمة").length
        );
        this.$set(this.itemNumber, "horob", this.itemsFilter("الهروب").length);
        this.$set(
          this.itemNumber,
          "e7tiat",
          this.itemsFilter("الاحتياط").length
        );
        this.$set(
          this.itemNumber,
          "secretary",
          this.itemsFilter("السيكرتارية").length
        );
        this.$set(this.itemNumber, "nozom", this.itemsFilter("النظم").length);
        this.$set(
          this.itemNumber,
          "services",
          this.itemsFilter("خدمة المواطنين").length
        );
        this.$set(
          this.itemNumber,
          "tasgeel",
          this.itemsFilter("التسجيل").length
        );
      });
    }
  }
};
</script>
