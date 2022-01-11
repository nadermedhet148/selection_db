<template>
  <div>
    <template>
      <v-row>
        <v-col cols="12" md="4" lg="5">
          <template v-for="(card, i) in cards" class="pt-2">
            <v-card class="mt-5 pt-5" :key="i">
              <v-card-title v-text="card.title"></v-card-title>
              <v-card-subtitle
                class="color"
                v-text="card.desc"
              ></v-card-subtitle>
              <v-divider></v-divider>
              <v-card-text>
                <v-row>
                  <template v-for="(option, ii) in card.options">
                    <v-col cols="12" md="12" xl="12" :key="ii">
                      <v-autocomplete
                        v-if="!option.type || option.type == 'select'"
                        :persistent-hint="option.hint ? true : false"
                        :hide-details="option.hint ? false : true"
                        :hint="option.hint"
                        :items="selects"
                        filled
                        @keyup.enter="
                          option.model == 'periodText' ? getPeriods() : () => {}
                        "
                        v-model="periods.item[option.model]"
                        :label="option.label"
                      ></v-autocomplete>
                    </v-col>
                  </template>

                  <v-col cols="12" class="pr-0">
                    <v-divider></v-divider>
                    <v-card-actions class="px-4 py-4">
                      <v-btn
                        class="px-6 justify-center"
                        @click="addPeriods()"
                        large
                        outlined
                        color="primary"
                        v-text="'حفظ واضافه التعديلات'"
                      ></v-btn>
                    </v-card-actions>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </template>
        </v-col>
        <v-col cols="12" md="5" offset-md="2">
          <template>
            <v-card class="mt-5 pt-5">
              <v-card-title>المراحل التجنيدية السابقة</v-card-title>
              <v-divider></v-divider>
              <v-data-table
                class="text-center"
                :items="result.items"
                :headers="result.headers"
                fixed-header
                :search.sync="result.search"
                hide-default-header
                multi-sort
              >
                <template v-slot:header="table">
                  <table-header-filters
                    :items="result.items"
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
                  <v-btn
                    color="error"
                    icon
                    @click="
                      itemToDelete = item;
                      deleteItemModel = true;
                    "
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </template>
              </v-data-table>
              <v-dialog scrollable max-width="450" v-model="deleteItemModel">
                <v-card>
                  <v-card-title>حذف المعاملة التجنيدية</v-card-title>
                  <v-card-text>هل تريد حذف المعاملة التجنيدية</v-card-text>
                  <v-card-actions>
                    <v-btn class="px-6" color="error" @click="deleteItem()"
                      >حذف</v-btn
                    >
                    <v-btn
                      outlined
                      class="px-6 mx-6"
                      color="error"
                      @click="
                        deleteItemModel = false;
                        itemToDelete = {};
                      "
                      >رجوع</v-btn
                    >
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-card>
          </template>
        </v-col>
      </v-row>
    </template>
  </div>
</template>
<script>
export default {
  name: "add_periods",

  data: () => ({
    componentName: "add_periods",
    deleteItemModel: false,
    itemToDelete: {},
    items: {},
    tableFilters: {},
    periods: {
      model: false,
      fullscreen: false,
      loading: false,
      deleteModel: false,
      viewModel: false,
      item: {}
    },
    deletePeriods: {
      model: false,
      loading: false,
      item: {}
    },
    selects: [],
    cards: [
      {
        title: "عملية اضافة مرحلة تجنيدية جديدة",
        desc:
          " في هذه العملية سوف نضيف مرحلة تجنيدية للجنود. بمجرد انك تختار السنة فا سوف تضيف اربعة مراحل جديده    ",
        options: [
          {
            model: "periodText",
            label: "المرحلة التجنيدية",
            type: "select",
            hint: "yyyy/mm"
          }
        ]
      }
    ],

    result: {
      items: [],
      headers: [
        {
          text: "المرحلة التجنيدية",
          value: "periodText",
          sortable: true
        }
        // {
        //   text: " الحذف",
        //   value: "actions",
        //   sortable: false,
        //   noSearch: true
        // }
      ]
    }
  }),

  mounted() {
    this.getPeriods();

    let selects = [];
    for (var i = 2021; i <= 2070; i++) {
      selects.push(i);
    }
    this.$set(this, "selects", selects);
    // this.$set(this, "selects", selects[i]);
  },
  methods: {
    async getPeriods() {
      let items = await this.api("global/get_all", {
        table: "periods",
        attr: ["periodText"]
      }).then(x => {
        this.result.items = x.data;
      });
    },
    async addPeriods() {
      this.$set(this, "loading", true);

      let period = { ...this.periods.item };
      // let periodss = [periods.item + "/" + 1, periods.item + "/" + 2];
      console.log(period);
      if (!period.periodText) {
        this.showError("من فضلك قم بتسجيل المرحلة");
        return;
      }
      let periodsTexts = [
        period.periodText + "/1",
        period.periodText + "/2",
        period.periodText + "/3",
        period.periodText + "/4"
      ];

      periodsTexts.forEach(async periodText => {
        let isExists = false,
          exists = await this.api("global/get_one", {
            table: "periods",
            where: {
              periodText: periodText
            }
          });
        if (exists && exists.ok && exists.data && exists.data.periodText) {
          isExists = true;
          //  this.$set(this.cardsConscripte, "item", exists.data);
        }
        if (isExists) {
          if (addCon && addCon.ok) {
            this.showSuccess(" هذه المرحله موجوده بالفعل ");
          } else {
            this.showError("تعذر إضافة المرحلة في قاعدة البيانات");
          }
          this.$set(this, "loading", false);
          return;
        } else {
          let addCon = await this.api("global/create_one", {
            table: "periods",
            where: {
              periodText: periodText
            }
          });
          if (addCon && addCon.ok) {
            this.showSuccess("تم إضافة المرحلة بنجاح");
            // this.emptyFields();
            this.getPeriods();
          } else {
            this.showError("تعذر إضافة المرحلة في قاعدة البيانات");
          }
        }
      });
    }
    // deleteItem() {
    //   let item = this.itemToDelete;
    //   this.$set(this.deletePeriods, "loading", true);
    //   this.$set(this, "loading", true);
    //   this.api("global/delete_all", {
    //     table: "periods",
    //     where: {
    //       id: item.id
    //     }
    //   })
    //     .then(x => {
    //       this.showSuccess("تم حذف المرحلةالتجنيدية بنجاح");
    //       this.getPeriods();
    //       this.deleteItemModel = false;
    //     })
    //     .catch(error => {
    //       console.log(error);
    //     })
    //     .finally(() => {
    //       this.$set(this.deletePeriods, "loading", false);
    //       this.$set(this, "loading", false);
    //       this.$set(this.deletePeriods, "model", false);
    //     });
    // }
  }
};
</script>
