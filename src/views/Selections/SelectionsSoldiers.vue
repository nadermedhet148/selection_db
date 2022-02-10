<template>
  <div>
    <custom-search
      :fields="headers"
      :selects="selects"
      @on-search="data => handleSearch(data)"
      @on-add="actionAdd()"
      :loading="searchLoading"
      title="بحث متقدم في إنتقاءات الجنود"
      addBtnTitle="إضافة إنتقاء"
    />

    <custom-table
      title="إنتقاء الجنود"
      :headers="headers"
      :data="items"
      :loading="loading"
    />

    <custom-dialog
      title="إضافة إنتقاء"
      :open="showAddDialog"
      @on-close="showAddDialog = false"
      :loading="loading"
      :fields="headers"
    />
  </div>
</template>

<script>
import CustomSearch from "./components/CustomSearch.vue";
import CustomTable from "./components/CustomTable.vue";
import CustomDialog from "./components/CustomDialog.vue";
import SelectionsSoldiersHeaders from "./SelectionsSoldiersHeaders.js";
import SelectionsSoldiersSelects from "./SelectionsSoldiersSelects.js";

export default {
  components: { CustomSearch, CustomTable, CustomDialog },

  name: "Soldiers",

  mounted() {
    this.fetchSelects();
    this.fetchData();
  },

  data: () => ({
    loading: false,
    searchLoading: false,
    showAddDialog: false,
    items: [],
    headers: SelectionsSoldiersHeaders,
    selects: SelectionsSoldiersSelects
  }),

  methods: {
    fetchSelects() {
      Object.keys(this.selects).forEach(key => {
        let { table, localTable, attrs } = this.selects[key];

        this.$set(this.selects[key], "loading", true);

        if (table) {
          let obj = {
            table
          };
          if (attrs && attrs.length > 0) {
            obj.attrs = attrs;
          }

          this.api("global/get_all", obj)
            .then(x => {
              this.$set(
                this.selects[key],
                "data",
                x.data.sort(
                  (a, b) =>
                    a[this.selects[key].value] - b[this.selects[key].value]
                )
              );
            })
            .catch(error => {
              console.log(error);
              this.$set(
                this.selects[key],
                "error",
                "حدث خطأ أثناء استدعاء البيانات من قاعدة البيانات"
              );
            })
            .finally(() => {
              this.$set(this.selects[key], "loading", false);
            });
        } else if (localTable) {
          let data = this.localTable(localTable);
          this.$set(
            this.selects[key],
            "data",
            data.sort(
              (a, b) => a[this.selects[key].value] - b[this.selects[key].value]
            )
          );
          this.$set(this.selects[key], "loading", false);
        }
      });
    },

    fetchData() {
      this.$set(this, "loading", true);
      this.api("global/get_all", {
        table: "Selections",
        include: [
          {
            model: "City"
          }
        ]
      })
        .then(x => {
          console.log(x.data);
          this.$set(this, "items", x.data);
        })
        .catch(error => {
          console.error(error);
          this.$set(
            this,
            "error",
            "حدث خطأ أثناء استدعاء البيانات من قاعدة البيانات"
          );
        })
        .finally(() => {
          this.$set(this, "loading", false);
        });
    },

    handleSearch(data) {
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);
      let where = { ...data },
        likes = ["ID"],
        multi = [];
      Object.keys(where).forEach(key => {
        let val = where[key];
        if (!val && val !== false && val !== 0) {
          delete where[key];
          return;
        }
        if (likes.includes(key)) {
          where[key] = {
            $like: `%${val}%`
          };
        } else if (multi.includes(key)) {
          where[key] = {
            $in: val
          };
        }
      });

      this.api("global/get_all", {
        table: "Selections",
        where
      })
        .then(x => {
          let data = x.data,
            printer = {
              cons: [...data],
              excelKey: "cons",
              excelHeaders: this.headers.filter(f => f.inSearch)
            };

          this.$set(this, "items", data);
          this.$set(this, "printer", printer);
        })
        .catch(error => {
          this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
          console.log(error);
        })
        .finally(() => {
          this.$set(this, "searchLoading", false);
        });
    },

    async actionAdd() {
      this.$set(this, "item", {});
      this.$set(this, "showAddDialog", true);
    },

    async actionEdit(item) {
      this.$set(this, "showAddDialog", true);
      this.$set(this, "Effect", { ...item, isEdit: true });
    },

    actionCertificatie(item) {
      this.$confirm(`هل انت متاكد من تغير الحالة`, {
        title: ``
      }).then(async res => {
        if (res) {
          await this.api(`global/update_one`, {
            table: "Situations",
            where: {
              ID: item.ID,
              SituationID: item.SituationID
            },
            update: {
              Contnuity: item.Contnuity == "متابع" ? "غير متابع" : "متابع"
            }
          });
          this.handleSearch();
        }
      });
    },

    async saveItem() {
      this.$set(this, "loading", true);
      let saveItem;

      saveItem = await this.api(`global/create_one`, {
        table: "Soldier",
        where: this.Effect
      });

      if (saveItem && saveItem.data && saveItem.ok) {
        this.showSuccess("تم حفظ ");
        this.handleSearch();
        this, "showAddDialog", false;
      } else {
        this.showError("تعذر حفظ  في قاعدة البيانات");
      }
      this.$set(this, "loading", false);
      this.$set(this, "showAddDialog", false);
    }
  }
};
</script>
