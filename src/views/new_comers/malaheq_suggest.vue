<template>
  <div>
    <v-card :loading="searchLoading" :disabled="searchLoading">
      <v-card-title>
        مقترح ملاحق المرحلة
        <v-spacer></v-spacer>
        <v-btn @click="actionAdd()" large outlined color="primary">
          إضافة التحاق
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
              <v-card
                  v-else-if="h.type == 'checkbox'"
                  flat
                  tile
                  color="transparent"
                  class="pa-0 ma-0"
                  :disabled="h.readonly"
                >
                 <v-checkbox
                  v-model="malaheq_suggest[h.searchValue]"
                  :label="h.text"
                 ></v-checkbox>

            
                </v-card>
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
          v-text="'بحث'"
        ></v-btn>
      </v-card-actions>
    </v-card>

    <v-card class="mt-8">
      <v-card-title>
        التوصيات
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
        <template v-slot:item.ID="{ item }">
          <v-chip
            color="transparent"
            :to="`/soldiers_plus/${item.ID}`"
            @click.right="copyText(item.ID)"
          >
            {{ item.ID }}
          </v-chip>
        </template>
      <template v-slot:item.ID="{ item }">
          <v-chip
            color="transparent"
            :to="`/soldiers_plus/${item.ID}`"
            @click.right="copyText(item.ID)"
          >
            {{ item.ID }}
          </v-chip>
        </template>

          <template v-slot:item.actions="{ item }">
          <v-chip class="transparent">
            <v-btn icon @click="actionEdit(item)" color="primary">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>

          </v-chip>
        </template>

   
 

 
        <template v-slot:item.CountRecommendations="{ item }">
          <v-chip
            :color="
              item.CountRecommendations == true
                ? 'success'
                : item.notApprovedReason == null
                ? 'gray'
                : 'error'
            "
          >
            {{
              item.CountRecommendations == true
                ? "تمت الموافقة"
                : item.notApprovedReason == null
                ? "في انتظار الموافقة"
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
              v-for="(h, i) in headers
                .filter(h => h.inModel)
                .sort((a, b) => a.sort - b.sort)"
            >
              <v-col :cols="h.cols ? h.cols : '6'" :key="i">
                <v-text-field
                  v-if="!h.type || ['text', 'date'].includes(h.type)"
                  filled
                  :type="h.type == 'date' ? 'date' : 'text'"
                  :label="h.text"
                  v-model="malaheq_suggest[h.searchValue]"
                  :hide-details="h.hint ? false : true"
                  :persistent-hint="h.hint ? true : false"
                  :readonly="h.readonly"
                   @keypress.enter="findSolider()"

                ></v-text-field>
                <v-autocomplete
                  v-else-if="h.type == 'select'"
                  filled
                  :label="h.text"
                  :multiple="h.multiple"
                  :readonly="h.readonly"
                  v-model="malaheq_suggest[h.searchValue]"
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
                  v-model="malaheq_suggest[h.searchValue]"
                  :hide-details="h.hint ? false : true"
                  :persistent-hint="h.hint ? true : false"
                  auto-grow
                  :readonly="h.readonly"
                  rows="1"
                ></v-textarea>
                <v-card
                  v-else-if="h.type == 'checkbox'"
                  flat
                  tile
                  color="transparent"
                  class="pa-0 ma-0"
                  :disabled="h.readonly"
                >
                 <v-checkbox
                  v-model="malaheq_suggest[h.searchValue]"
                  :label="h.text"
                 ></v-checkbox>

            
                </v-card>
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
const constants = require("../../Constant").default;
const lodash = require("lodash");

export default {
  name: "malaheq_suggest",
  mounted() {
    // this.initDates();
    this.init();
  },
  filters: {
    filterStrLimit(str, limit) {
      return `${str.length <= limit ? str : str.substr(0, limit) + ".."}`;
    }
  },
  data: () => ({
     malaheq_suggest:{

    },
    groupedValue: [],
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
    search: {},
    searchLoading: false,
    headers: [
       {
        text: "",
        value: "actions",
        searchValue: "actions",
        sortable: false,
        inSearch: false,
        inTable: true,
        inModel: true,
        sort: 0
      },
      {
        text: "الرقم العسكري",
        value: "ID",
        searchValue: "ID",
        sortable: true,
        type: "text",
        inSearch: true,
        inTable: true,
        inModel: true,
        sort: 1
      }, {
        text: "الاسم",
        value: "Soldier.Name",
        searchValue: "Soldier.Name",
        sortable: true,
        type: "text",
        inSearch: true,
        inTable: true,
        inModel: true,
        sort: 1
      },
      {
        text: "المستوى الثقافي",
        value: "Soldier.KnowledgeLevel",
        searchValue: "Soldier.KnowledgeLevel",
        sortable: true,
        type: "text",
        inSearch: false,
        inTable: true,
        inModel: true,
        sort: 2
      },
      {
        text: "الوحدة",
        value: "Soldier.Unit.Unit",
        searchValue: "UnitID",
        sortable: true,
        type: "select",
        inSearch: true,
        inTable: true,
        inModel: true,
        sort: 2
      },
      {
        text: "الإتجاه",
        value: "Soldier.Unit.Directionforunit",
        searchValue: "UnitID",
        sortable: true,
        type: "select",
        inSearch: false,
        inTable: true,
        inModel: false,
        sort: 2
      },
      {
        text: "الجهة لملحق ليها",
        value: "FollowingRigion.FollowRigionName",
        searchValue: "FollowRigionID",
        sortable: true,
        type: "select",
        inSearch: true,
        inTable: true,
        inModel: true,
        sort: 2
      },
      {
        text: "الموصي",
        value: "FollowingRecommender",
        searchValue: "FollowingRecommender",
        sortable: true,
        type: "select",
        inSearch: true,
        inTable: true,
        inModel: true,
        sort: 4
      },
      {
        text: "الأمر بالإلحاق",
        value: "FollowingOrder",
        searchValue: "FollowingOrder",
        sortable: true,
        type: "select",
        inSearch: true,
        inTable: true,
        inModel: true,
        sort: 3
      },
      {
        text: "المواققة",
        value: "Acceptance",
        searchValue: "Acceptance",
        sortable: true,
        type: "checkbox",
        inSearch: true,
        inTable: true,
        inModel: true,
        sort: 5
      },

    ],
    items: [],
    tableFilters: {},
   
    componentName: "createdObject",
    selects: {
      UnitID: {
        table: "Unit",
        value: "UnitID",
        text: "Unit"
      },
      FollowRigionID: {
        table: "FollowingRigion",
        value: "FollowRigionID",
        text: "FollowRigionName"
      },
      FollowingRecommender: {
        text: "text",
        value: "text",
        data: constants.FollowingRecommender.data
      },
      FollowingOrder: {
        text: "text",
        value: "text",
        data: constants.FollowingOrder.data
      }
      // RecuStage: {
      //   text: "text",
      //   value: "text",
      //   data: lodash.flattenDeep(
      //     constants.years.map(year =>
      //       constants.RecuStage.data.map(stage => `${stage.text}-${year}`)
      //     )
      //   )
      // }
    },
    printer: {}
  }),
   watch: {
    "malaheq_suggest.UnitID"(v) {
        this.$set(
          this.malaheq_suggest,
          "UnitDirection",
          this.selects.UnitID.data.find(ele => ele.UnitID == v).Directionforunit
        );
      

      },
     
    },
  methods: {
    log(item) {
      console.log("====================================");
      console.log("item", item);
      console.log("====================================");
    },
    runFun(f) {
      return this[f]();
    },

    async saveItem(edirableFromTableItem) {
      this.$set(this.createdObject, "loading", true);

      let saveItem = await this.api(`global/create_one`, {
        table: "Recommendations",
        where: this.malaheq_suggest,
        include:[
            {

            }
        ]
      });

      if (saveItem && saveItem.data && saveItem.ok) {
        this.showSuccess("تم حفظ ");
        this.findItems();
        this.createdObject, "model", false;
      } else {
        this.showError("تعذر حفظ  في قاعدة البيانات");
      }
      this.$set(this.createdObject, "loading", false);
      this.$set(this.createdObject, "model", false);
    },
    findItems() {
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);
      let where = { ...this.search },
        likes = ["ID", "Name"],
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
        table: "Followers",
        where,
        include:[
            {model : "FollowingRigion"},
            {model : "Soldier",
            include:[
            {model:'Unit'}

            ]
            },

        ]
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
    findSolider() {

      let search = this.search;
      this.api("global/get_one", {
        table:"Soldier",
        search: { ID: this.search.ID }
      })
        .then(x => {
          console.log("x", x);
          this.$set(this.malaheq_suggest,'Name' , x.data.Name)
          
          this.$set(this.malaheq_suggest,'soldierDirection' , x.data.Directionforunit)

        })
        .catch(error => {
          console.log(error);
        })
        .finally(() => {
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
          // obj.attrs = [text, value];
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
    actionAdd() {
      this.$set(this.createdObject, "item", {});
      this.$set(this.createdObject, "model", true);
    },
    actionEdit(item){
      this.$set(this.createdObject, "model", true);
      this.$set(this, "malaheq_suggest", item);
    }
    },

  
}
</script>
