<template>
  <div>
    <v-card class="mb-6">
      <v-card-title>
        البحث المتقدم للبطاقات العلاجية
      </v-card-title>
      <v-card-text>
        من فضلك قم بتحديد الخيارات التي تريدها من الأسفل, ثم اضغط على زر البحث
        الأزرق الموجود في أعلى يسار الصفحة. وستظهر لك النتائج في نهاية الصفحة
      </v-card-text>
    </v-card>
    <template v-for="(card, ii) in cards">
      <v-card
        :key="ii"
        class="mb-6"
        :loading="result.loading"
        :disabled="result.loading"
      >
        <v-card-title class="sidenav white--text">
          {{ card.title }}
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-row>
            <template v-for="(option, i) in card.options">
              <v-col cols="6" :lg="option.type == 'date' ? '6' : '3'" :key="i">
                <v-text-field
                  v-if="!option.type || option.type == 'text'"
                  :persistent-hint="option.hint ? true : false"
                  :hide-details="option.hint ? false : true"
                  :hint="option.hint"
                  filled
                  v-model="search[option.model]"
                  :label="option.label"
                  @keypress.enter="searchConscriptes"
                ></v-text-field>
                <v-text-field
                  v-else-if="option.type == 'number'"
                  :persistent-hint="option.hint ? true : false"
                  :hide-details="option.hint ? false : true"
                  :hint="option.hint"
                  filled
                  v-mask="'##########'"
                  v-model.number="search[option.model]"
                  :label="option.label"
                  @keypress.enter="searchConscriptes"
                ></v-text-field>
                <v-autocomplete
                  v-if="option.type == 'select'"
                  :label="option.label"
                  :hint="option.hint"
                  v-model="search[option.model]"
                  :items="selects[option.model].data"
                  :item-value="selects[option.model].value"
                  :item-text="selects[option.model].text"
                  filled
                  :error-messages="selects[option.model].error"
                  :append-icon="
                    selects[option.model].error
                      ? 'mdi-refresh'
                      : 'mdi-chevron-down'
                  "
                  @click:append="
                    selects[option.model].error ? init(option.model) : () => {}
                  "
                  :hide-details="option.hint ? false : true"
                  :persistent-hint="option.hint ? true : false"
                  :loading="selects[option.model].loading || option.loading"
                  clearable
                ></v-autocomplete>
                <v-row class="py-0 my-0" v-else-if="option.type == 'date'">
                  <template v-for="x in ['from', 'to']">
                    <v-col
                      v-if="search[option.model]"
                      cols="6"
                      class="py-0 my-0"
                      :key="x"
                    >
                      <v-text-field
                        v-model="search[option.model][x]"
                        :prepend-inner-icon="option.icon"
                        :hint="option.hint"
                        :persistent-hint="option.hint ? true : false"
                        :hide-details="option.hint ? false : true"
                        :label="
                          `${option.label} ( ${x == 'from' ? 'من' : 'الى'} )`
                        "
                        :error-messages="option.error"
                        filled
                        clearable
                        type="date"
                      >
                      </v-text-field>
                    </v-col>
                  </template>
                </v-row>
              </v-col>
            </template>
          </v-row>
        </v-card-text>
      </v-card>
    </template>
    <!-- <v-card class="mb-6">
      <v-card-actions class="px-4"> -->
    <v-btn
      style="position: fixed; top: 10px; left: 400px; z-index: 999"
      class="px-4"
      large
      color="primary"
      @click="searchConscriptes"
    >
      <v-icon class="me-3">mdi-magnify</v-icon>
      بحث
    </v-btn>

    <v-btn-toggle class="pb-4" v-model="toggle">
      <v-btn>
        المجندين
      </v-btn>

      <v-btn>
        افراد العائلة
      </v-btn>

      <v-btn>
        البطاقات العلاجية
      </v-btn>
    </v-btn-toggle>
    <!-- </v-card-actions>
    </v-card> -->
    <v-card class="mb-6">
      <v-card-title class="sidenav white--text">
        النتائج
        <v-spacer></v-spacer>
        <printer-menu
          :disabled="false"
          :data="result.printer"
          :fab="false"
          dark
        ></printer-menu>
      </v-card-title>
      <v-divider></v-divider>

      <v-data-table
        v-if="toggle == 0"
        :items="result.items.conscriptes"
        :headers="result.headersConscriptes"
        fixed-header
        :search.sync="result.search"
        v-model="result.selected"
        multi-sort
        hide-default-header
        @current-items="tableUpdated"
        ref="mainTable"
      >
        <template v-slot:header="table">
          <table-header-filters
            :items="result.items.conscriptes"
            :table="table"
            :filters.sync="tableFilters.conscriptes"
          ></table-header-filters>
        </template>
        <template v-slot:footer="table">
          <table-footer-filters
            :filters.sync="tableFilters.conscriptes"
            :table="table"
          ></table-footer-filters>
        </template>
        <template v-slot:item.militaryId="{ item }">
          <v-chip
            color="transparent"
            :to="`/cards/profile/${item.militaryId}`"
            @click.right="copyText(item.militaryId)"
          >
            {{ item.militaryId }}
          </v-chip>
        </template>
        <template v-slot:item.fullName="{ item }">
          <v-chip
            color="transparent"
            :to="`/cards/profile/${item.militaryId}`"
            @click.right="copyText(item.fullName)"
          >
            {{ item.fullName }}
          </v-chip>
        </template>
        <template v-slot:item.dutyCurrentState="{ item }">
          <v-chip
            v-if="item.dutyCurrentState && item.dutyCurrentState.text"
            small
            :color="
              item.dutyCurrentState.text == 'بالخدمة' ? 'success' : 'error'
            "
          >
            {{ item.dutyCurrentState.text }}
          </v-chip>
        </template>
      </v-data-table>

      <v-data-table
        v-if="toggle == 1"
        :items="result.items.cardsFamilyMembers"
        :headers="result.headersFamilyMembers"
        fixed-header
        :search.sync="result.search"
        v-model="result.selected"
        multi-sort
        hide-default-header
        @current-items="tableUpdated"
        ref="mainTable"
      >
        <template v-slot:header="table">
          <table-header-filters
            :items="result.items.cardsFamilyMembers"
            :table="table"
            :filters.sync="tableFilters.cardsFamilyMembers"
          ></table-header-filters>
        </template>
        <template v-slot:footer="table">
          <table-footer-filters
            :filters.sync="tableFilters.cardsFamilyMembers"
            :table="table"
          ></table-footer-filters>
        </template>
        <template v-slot:item.consMilitaryId="{ item }">
          <v-chip
            color="transparent"
            :to="`/cards/profile/${item.consMilitaryId}`"
            @click.right="copyText(item.consMilitaryId)"
          >
            {{ item.consMilitaryId }}
          </v-chip>
        </template>
        <template v-slot:item.name="{ item }">
          <v-chip
            color="transparent"
            :to="`/cards/profile/${item.consMilitaryId}`"
            @click.right="copyText(item.name)"
          >
            {{ item.name }}
          </v-chip>
        </template>
      </v-data-table>

      <v-data-table
        v-if="toggle == 2"
        :items="result.items.cards"
        :headers="result.headersCards"
        fixed-header
        :search.sync="result.search"
        v-model="result.selected"
        multi-sort
        hide-default-header
        @current-items="tableUpdated"
        ref="mainTable"
      >
        <template v-slot:header="table">
          <table-header-filters
            :items="result.items.cards"
            :table="table"
            :filters.sync="tableFilters.cards"
          ></table-header-filters>
        </template>
        <template v-slot:footer="table">
          <table-footer-filters
            :filters.sync="tableFilters.cards"
            :table="table"
          ></table-footer-filters>
        </template>
        <template v-slot:item.cardNumber="{ item }">
          <v-chip
            color="transparent"
            :to="`/cards/profile/${item.consMilitaryId}`"
            @click.right="copyText(item.consMilitaryId)"
          >
            {{ item.cardNumber }}
          </v-chip>
        </template>
        <template v-slot:item.consMilitaryId="{ item }">
          <v-chip
            color="transparent"
            :to="`/cards/profile/${item.consMilitaryId}`"
            @click.right="copyText(item.consMilitaryId)"
          >
            {{ item.consMilitaryId }}
          </v-chip>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "conscriptes",
  mounted() {
    this.fillKeys();
    this.init();
  },
  watch: {
    "search.stateIdCurrent"(v) {
      if (v) {
        if (!this.fullDatas.stateId) {
          this.$set(this.fullDatas, "stateId", this.selects.stateId.data);
        }
        if (v == 1) {
          this.$set(
            this.selects.stateId,
            "data",
            this.fullDatas.stateId.filter(w => w.stateId == 101)
          );
          if (this.search.stateId !== 101) {
            this.$set(this.search, "stateId", null);
          }
        } else {
          this.$set(
            this.selects.stateId,
            "data",
            this.fullDatas.stateId.filter(w => w.stateId !== 101)
          );
          if (this.search.stateId == 101) {
            this.$set(this.search, "stateId", null);
          }
        }
      } else {
        this.$set(this.selects.stateId, "data", this.fullDatas.stateId);
      }
    }
  },
  data: () => ({
    componentName: "soldiers_plus",
    tableFilters: {
      conscriptes: {},
      cards: {},
      cardsFamilyMembers: {}
    },
    fullDatas: {},
    toggle: 0,
    result: {
      printer: {},
      selected: [],
      search: "",
      items: {
        conscriptes: [],
        cards: [],
        cardsFamilyMembers: []
      },
      headersConscriptes: [
        {
          value: "militaryId",
          text: "الرقم العسكري",
          sortable: true
        },
        {
          value: "fullName",
          text: "الإسم",
          sortable: true
        },
        {
          text: "الرقم القومي",
          value: "nationalId",
          sortable: true
        },
        {
          value: "degree.degreeType",
          dbvalue: "degreeId",
          text: "الدرجة",
          sortable: true
        },
        {
          value: "unit.unitText",
          dbvalue: "unitId",
          text: "الوحدة",
          sortable: true
        },
        {
          value: "dutyCurrentState",
          dbvalue: "stateIdCurrent",
          text: "حالة الفرد",
          sortable: true
        }
      ],
      headersFamilyMembers: [
        {
          text: "الرقم القومي",
          value: "nationalId",
          sortable: true
        },
        {
          value: "name",
          text: "الإسم",
          sortable: true
        },
        {
          value: "cardsFamilyTypeRel.displayedText",
          text: "صلة القرابة",
          sortable: true
        },
        {
          value: "nationality.displayedText",
          text: "الجنسية",
          sortable: true
        },
        {
          value: "consMilitaryId",
          text: "رقم عسكري للمجند",
          sortable: true
        }
      ],
      headersCards: [
        {
          value: "cardNumber",
          text: "رقم البطاقة",
          sortable: true
        },
        {
          value: "fileNumber",
          text: "رقم الفايل",
          sortable: true
        },
        {
          value: "cardType.typeName",
          text: "نوع البطاقة",
          sortable: true
        },
        {
          value: "consMilitaryId",
          text: "رقم العسكري",
          sortable: true
        }
      ]
    },
    printers: [
      {
        title: "طباعة النتائج Word",
        desc: "",
        action: "printerWord"
      },
      {
        title: "طباعة النتائج Excel",
        desc: "",
        action: "printerExcel"
      }
    ],
    search: {},
    dialogs: {},
    cards: [
      {
        title: "بيانات الفرد",
        options: [
          {
            label: "الرقم العسكري",
            model: "conscriptes.militaryId",
            type: "text",
            hint: ""
          },
          {
            label: "الإسم",
            model: "conscriptes.fullName",
            type: "text",
            hint: ""
          },
          {
            label: "الرقم القومي",
            model: "conscriptes.nationalId",
            type: "text",
            hint: ""
          },
          {
            label: "الدرجة",
            model: "conscriptes.degreeId",
            type: "select",
            hint: ""
          },
          {
            label: "الوحدة",
            model: "conscriptes.unitId",
            type: "select",
            hint: ""
          },
          {
            label: "حالة الفرد",
            model: "conscriptes.stateIdCurrent",
            type: "select",
            hint: ""
          },
          {
            label: "المحافطة",
            model: "conscriptes.governorateId",
            type: "select",
            hint: ""
          },
          {
            label: "رقم التليفون",
            model: "conscriptes.phone",
            type: "text",
            hint: ""
          },
          {
            label: "تاريخ الميلاد",
            model: "conscriptes.birthDate",
            type: "date",
            range: true,
            hint: ""
          }
        ]
      },
      {
        title: "بيانات فرد عائلة",
        options: [
          {
            label: "الإسم",
            model: "cardsFamilyMembers.name",
            type: "text",
            hint: ""
          },
          {
            label: "الرقم القومي",
            model: "cardsFamilyMembers.nationalId",
            type: "text",
            hint: ""
          },
          {
            label: "صلة القرابة",
            model: "cardsFamilyMembers.familyTypeRelId",
            type: "select",
            hint: ""
          },
          {
            label: "هل يستحق",
            model: "cardsFamilyMembers.isDeserve",
            type: "select",
            hint: ""
          },
          {
            label: "المحافطة",
            model: "cardsFamilyMembers.governorateId",
            type: "select",
            hint: ""
          },
          {
            label: "تاريخ الميلاد",
            model: "cardsFamilyMembers.birthDate",
            type: "date",
            range: true,
            hint: ""
          }
        ]
      },
      {
        title: "بيانات البطاقة العلاجية",
        options: [
          {
            label: "رقم البطاقة",
            model: "cards.cardNumber",
            type: "text",
            hint: ""
          },
          {
            label: "رقم الفايل",
            model: "cards.fileNumber",
            type: "text",
            hint: ""
          },
          {
            label: "تاريخ اصدار البطاقة",
            model: "cards.dateOfIssurance",
            type: "date",
            range: true,
            hint: ""
          },
          {
            label: "تاريخ بداية تجديد البطاقة",
            model: "cardsTracking.dateOfRenewal",
            type: "date",
            range: true,
            hint: ""
          },
          {
            label: "تاريخ نهاية تجديد البطاقة",
            model: "cardsTracking.dateOfExpiration",
            type: "date",
            range: true,
            hint: ""
          },
          {
            label: "نوع البطاقة",
            model: "cards.typeId",
            type: "select",
            hint: ""
          }
        ]
      }
    ],
    selects: {
      // Normal Selects
      "conscriptes.governorateId": {
        table: "governorates",
        value: "id",
        text: "displayedText"
      },
      "cardsFamilyMembers.governorateId": {
        table: "governorates",
        value: "id",
        text: "displayedText"
      },
      "conscriptes.unitId": {
        table: "units",
        value: "unitId",
        text: "unitText"
      },
      "conscriptes.degreeId": {
        table: "degrees",
        value: "degreeId",
        text: "degreeType"
      },
      "conscriptes.stateIdCurrent": {
        table: "dutyCurrentStates",
        text: "text",
        value: "stateId"
      },
      "conscriptes.stateId": {
        table: "dutyStates",
        text: "text",
        value: "stateId"
      },
      "conscriptes.typeId": {
        text: "dutyTypeText",
        value: "dutyTypeId",
        data: [
          {
            dutyTypeText: "جندي",
            dutyTypeId: "1"
          },
          {
            dutyTypeText: "راتب عالي",
            dutyTypeId: "2"
          }
        ]
      },
      "cardsFamilyMembers.isDeserve": {
        text: "isDeserveText",
        value: "isDeserveVal",
        data: [
          {
            isDeserveText: "نعم",
            isDeserveVal: true
          },
          {
            isDeserveText: "لا",
            isDeserveVal: false
          }
        ]
      },
      "cardsFamilyMembers.familyTypeRelId": {
        table: "cardsFamilyTypeRel",
        text: "displayedText",
        value: "id"
      },
      "cards.typeId": {
        table: "cardTypes",
        text: "typeName",
        value: "id"
      }
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
            this.result.printer.cons = sorted;
            this.result.printer.excelHeaders =
              this.toggle == 0
                ? this.result.headersConscriptes
                : this.toggle == 1
                ? this.result.headersFamilyMembers
                : this.result.headersCards;
            console.log(this.result.printer);
          }
        }
      }
    },
    searchConscriptes() {
      this.$set(this.result, "loading", true);
      let search = this.search;
      console.log(search);
      this.api("sections/cards/search/conscriptes", {
        search
      })
        .then(x => {
          console.log(x);
          let cons = x.data["conscriptes"],
            cards = x.data["cards"],
            cardsFamilyMembers = x.data["cardsFamilyMembers"],
            printer = {
              cons: [...cons],
              excelKey: "cons",
              excelHeaders: this.result.headersConscriptes
            };
          this.$set(this.result.items, "conscriptes", cons);
          this.$set(this.result.items, "cards", cards);
          this.$set(
            this.result.items,
            "cardsFamilyMembers",
            cardsFamilyMembers
          );
          this.$set(this.result, "printer", printer);
          // this.goSearch(where);
        })
        .catch(error => {
          console.log(error);
        })
        .finally(() => {
          this.$set(this.result, "loading", false);
        });
    },
    fillKeys() {
      let options_arr = this.cards.map(c => c.options),
        options = [];
      options_arr.forEach(arr => {
        options = [...options, ...arr];
      });
      options.forEach(option => {
        if (option.type == "date" || option.multiple) {
          this.$set(this.search, option.model, {});
        } else {
          this.$set(this.search, option.model, "");
        }
      });
    },
    init(specificTable = "") {
      // Get selects
      Object.keys(this.selects).forEach(key => {
        let { table, localTable, attrs } = this.selects[key];
        if (table) {
          let obj = {
            table
          };
          if (attrs && attrs.length > 0) {
            obj.attrs = attrs;
          }
          this.$set(this.selects[key], "loading", true);
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
                "حدث خطأ أثناء استدعاء الداتا من قاعدة البيانات"
              );
            })
            .finally(() => {
              this.$set(this.selects[key], "loading", false);
            });
        } else if (localTable) {
          this.$set(this.selects[key], "loading", true);
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
    }
  }
};
</script>
