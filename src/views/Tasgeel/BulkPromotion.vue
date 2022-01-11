<template>
  <div>
    <v-dialog
      v-if="isCurrentRoute(componentName)"
      v-model="search.model"
      :persistent="!search.model_reselect"
      width="450"
      scrollable
    >
      <v-card :loading="search.loading" :disabled="search.loading">
        <v-card-title>اختر تاريخ الإستحقاق</v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pt-4">
          <v-text-field
            v-model="search.deserve_date"
            label="تاريخ الإستحقاق"
            hint="قم بتحديد تاريخ استحقاق الدرجة المراد الترقية لها"
            persistent-hint
            filled
            type="date"
            class="mb-4 dialog-text-field"
            v-if="!$store.state.appInfo.dateDialog"
          >
          </v-text-field>
          <v-dialog
            v-else
            ref="deserve_date_dialog"
            v-model="search_deserve_date_model"
            :return-value.sync="search.deserve_date"
            width="290px"
            persistent
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="search.deserve_date"
                prepend-inner-icon="mdi-calendar"
                label="تاريخ الإستحقاق"
                hint="قم بتحديد تاريخ استحقاق الدرجة المراد الترقية لها"
                persistent-hint
                readonly
                filled
                v-on="on"
                class="mb-4 dialog-text-field"
              >
              </v-text-field>
            </template>
            <v-date-picker
              ref="date_from_picker"
              v-model="search.deserve_date"
              scrollable
              color="primary"
            >
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                outlined
                class="px-6 text-capitalize"
                @click="search_deserve_date_model = false"
                >إلغاء</v-btn
              >
              <v-btn
                color="primary"
                class="px-6 text-capitalize"
                @click="$refs.deserve_date_dialog.save(search.deserve_date)"
                >حفظ</v-btn
              >
            </v-date-picker>
          </v-dialog>
        </v-card-text>
        <v-card-actions class="px-4">
          <v-btn
            @click="goThere('/'), deleteRouteByName(componentName)"
            color="primary"
            text
            large
          >
            إغلاق للرئيسية
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            @click="search.model_reselect ? (search.model = false) : goBack()"
            class="px-6 text-capitalize"
            color="primary"
            outlined
            large
          >
            رجوع
          </v-btn>
          <v-btn
            @click="getResults"
            class="px-6 text-capitalize"
            color="primary"
            large
            :disabled="!search.deserve_date"
          >
            عرض
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-card class="mb-6">
      <v-card-title>
        تاريخ الإستحقاق الحالي:
        {{ search.deserve_date }}
        <v-btn color="primary" icon @click="reSelectDate()">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          large
          class="px-6"
          color="primary"
          @click="
            selected_deservers.length == 0
              ? showError('من فضلك قم بتحديد على الأقل ضابط صف واحد لترقيته.')
              : (promote_all_model = true)
          "
        >
          <v-icon>mdi-rocket-launch-outline</v-icon>
          <span class="mx-2"></span>
          ترقية المحدد
        </v-btn>
      </v-card-title>
    </v-card>
    <v-card>
      <!-- <v-card-title>
        تقرير المتاح لهم الترقية
        <v-spacer></v-spacer>
      </v-card-title> -->
      <v-tabs
        show-arrows
        v-model="selected_complex_degree_i"
        height="60"
        slider-size="3"
        center-active
      >
        <template v-for="(val, key, i) in result.results">
          <v-tab
            v-if="key !== '19'"
            class=" ls-0 text-body-1 grey--text"
            active-class="primary--text"
            :key="i + '_' + key"
          >
            {{ val.title }}
            <v-chip
              class="ms-3"
              :color="selected_complex_degree_i == i ? 'primary' : ''"
            >
              {{ val.records.length }}
            </v-chip>
          </v-tab>
        </template>
      </v-tabs>
      <div>
        <!-- <v-text-field
          v-model="result.search"
          filled
          prepend-inner-icon="mdi-magnify"
          dense
        ></v-text-field> -->
      </div>
      <v-data-table
        loading-text="جارِ تحميل البيانات"
        multi-sort
        :loading="result.loading"
        :items="result.results[selected_complex_degree].records"
        :headers="result.headers"
        :search.sync="result.search"
        fixed-header
        item-key="militaryId"
        v-model="selected_deservers"
        show-select
        :footer-props="footer_props"
        hide-default-header
      >
        <template v-slot:header="table">
          <table-header-filters
            :items="result.results[selected_complex_degree].records"
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
        <template v-slot:item.fullName="{ item }">
          <v-chip
            color="transparent"
            :to="`/soldiers_plus/${item.militaryId}`"
            @click.right="copyText(item.fullName)"
          >
            {{ item.fullName }}
          </v-chip>
        </template>
        <template v-slot:item.deserved_degree="{ item }">
          <span>
            {{ result.results[item.degreeId + 1].title }}
          </span>
        </template>
      </v-data-table>
    </v-card>
    <!-- <app-fab
      color="primary"
      @reSelectDate="reSelectDate"
      @promoteAll="
        selected_deservers.length == 0
          ? showError('من فضلك قم بتحديد على الأقل ضابط صف واحد لترقيته.')
          : (promote_all_model = true)
      "
      :items="fab_items"
    ></app-fab> -->
    <v-dialog
      v-if="isCurrentRoute(componentName)"
      scrollable
      :persistent="promote_all_loading"
      v-model="promote_all_model"
      max-width="600"
    >
      <v-card :loading="promote_all_loading" :disabled="promote_all_loading">
        <v-card-title>
          <v-row>
            <v-col class="py-0">
              تطبيق الترقية على {{ selected_deservers.length }} ضابط صف
            </v-col>
            <v-col cols="auto" class="py-0">
              <v-btn @click="promote_all_model = false" icon>
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pt-6 text--primary">
          <div>
            هل أنت متأكد من تطبيق الترقية على الآتي :
          </div>
          <template v-for="(val, key, i) in result.results">
            <div
              :class="
                selected_deservers.filter(s => s.degreeId == key).length == 0
                  ? 'text-decoration-line-through'
                  : ''
              "
              :key="key + '_' + i"
              v-if="key !== '19'"
            >
              {{ selected_deservers.filter(s => s.degreeId == key).length }}
              {{ val.title }}
              الى
              {{ result.results[Number(key) + 1].title }}
            </div>
          </template>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="px-4">
          <v-spacer></v-spacer>
          <v-btn
            large
            class="px-6"
            color="primary"
            v-text="'تطبيق الترقية'"
            @click="promoteAll"
            :disabled="selected_deservers.length == 0"
          ></v-btn>
          <v-btn
            large
            class="px-6"
            color="primary"
            outlined
            v-text="'رجوع'"
            @click="promote_all_model = false"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "bulk_promotion",
  mounted() {
    this.setDefaultDeserveDate();
  },
  watch: {
    selected_complex_degree_i(v) {
      let key = Object.keys(this.result.results)[v];
      this.$set(this, "selected_complex_degree", key);
    }
  },
  computed: {
    footer_props() {
      return {
        "items-per-page-options": [10, 20, 30, 40, 50, -1],
        "items-per-page-text": `المحدد : ${this.selected_deservers.length} . العناصر لكل صفحة :`
      };
    }
  },
  data: () => ({
    componentName: "bulk_promotion",
    tableFilters: {},
    selected_deservers: [],
    promote_all_model: false,
    promote_all_loading: false,
    search: {
      deserve_date: null,
      model: true,
      model_reselect: false,
      loading: false
    },
    search_deserve_date_model: false,
    selected_complex_degree: "14",
    selected_complex_degree_i: 0,
    result: {
      search: "",
      loading: false,
      results: {
        "14": {
          title: "طالب",
          records: []
        },
        "15": {
          title: "عريف",
          records: []
        },
        "16": {
          title: "رقيب",
          records: []
        },
        "17": {
          title: "رقيب أول",
          records: []
        },
        "18": {
          title: "مساعد",
          records: []
        },
        "19": {
          title: "مساعد أول",
          records: []
        }
      },
      headers: [
        {
          text: "الرقم العسكري",
          sortable: true,
          value: "militaryId"
        },
        {
          text: "الإسم",
          sortable: true,
          value: "fullName"
        },
        {
          text: "الوحدة",
          sortable: true,
          value: "unit.unitText"
        },
        {
          text: "الدرجة الحالية",
          sortable: true,
          value: "degree.degreeType"
        },
        {
          text: "تاريخها",
          sortable: true,
          value: "currentPromotionDate"
        },
        {
          text: "الدرجة المتاحة",
          sortable: true,
          value: "deserved_degree"
        }
      ]
    },
    fab_items: [
      {
        text: "ترقية المحدد",
        icon: "mdi-rocket-launch-outline",
        color: "success",
        action: "promoteAll"
      },
      {
        text: "اختيار تاريخ آخر",
        icon: "mdi-cursor-default-click",
        color: "error",
        action: "reSelectDate"
      }
    ]
  }),
  methods: {
    promoteAll() {
      /*
        2017135200281
      */
      this.$set(this, "promote_all_loading", true);
      this.api("sections/tasgeel/bulk_promotion/promote_all", {
        selected_deservers: this.selected_deservers.map(s => s.militaryId)
      })
        .then(records => {
          console.log(records);
          this.selected_deservers
            .map(s => s.militaryId)
            .forEach(el => {
              this.addModification(el, 2, 9);
            });
          this.$set(this, "selected_deservers", []);
          this.$set(this, "promote_all_model", false);
          this.showSuccess(`تم ترقية ${records.data[0]} ضباط صف بنجاح.`);
          this.getResults();
        })
        .catch(error => {
          console.log(error);
        })
        .finally(() => {
          this.$set(this, "promote_all_loading", false);
        });
    },
    reSelectDate() {
      this.$set(this.search, "model", true);
      this.$set(this.search, "model_reselect", true);
    },
    getResults() {
      let { deserve_date } = this.search,
        _deserve_date = new Date(deserve_date).setDate(
          new Date(deserve_date).getDate() + 1
        ),
        date_14 = new Date(_deserve_date),
        date_15 = new Date(_deserve_date),
        date_18 = new Date(_deserve_date),
        date_19 = new Date(_deserve_date);
      date_14 = date_14.setFullYear(date_14.getFullYear() - 2);
      date_15 = date_15.setFullYear(date_15.getFullYear() - 5);
      date_18 = date_18.setFullYear(date_18.getFullYear() - 4);
      date_19 = date_19.setFullYear(date_19.getFullYear() - 4);
      date_19 = new Date(date_19);
      date_19 = date_19.setMonth(date_19.getMonth() - 6);
      this.$set(this.result, "loading", true);
      this.$set(this.search, "model", false);
      this.$set(this.result, "records", []);
      this.api("sections/tasgeel/bulk_promotion/get_search_results", {
        date_14,
        date_15,
        date_18,
        date_19
      })
        .then(records => {
          Object.keys(records.data).forEach(key => {
            this.$set(
              this.result.results[key],
              "records",
              this.fixDates(records.data[key], ["currentPromotionDate"])
            );
          });
        })
        .catch(error => {
          console.log(error);
        })
        .finally(() => {
          this.$set(this.result, "loading", false);
        });
    },
    setDefaultDeserveDate() {
      let today = new Date();
      today.setDate(1);
      today.setHours(-1);
      let year = today.getFullYear(),
        month =
          today.getMonth() + 1 > 9
            ? today.getMonth() + 1
            : "0" + (today.getMonth() + 1),
        day = today.getDate(),
        lastDayOfMonth = `${year}-${month}-${day}`;
      this.$set(this.search, "deserve_date", lastDayOfMonth);
    }
  }
};
</script>
