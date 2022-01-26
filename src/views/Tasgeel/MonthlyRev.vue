<template>
  <div>
    <v-dialog
      v-model="units_model"
      :persistent="!units_model_reselect"
      width="450"
      scrollable
      v-if="isCurrentRoute(componentName)"
    >
      <v-card :loading="loading" :disabled="loading">
        <v-card-title>اختر الوحدة</v-card-title>
        <v-card-text>
          <v-autocomplete
            :items="units"
            item-text="unitText"
            item-value="unitId"
            v-model="selected_unit"
            label="الوحدة"
            filled
            hint="اختر الوحدة لعرض المراجعة الشهرية لها"
            persistent-hint
          ></v-autocomplete>
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
            @click="units_model_reselect ? (units_model = false) : goBack()"
            class="px-6 text-capitalize"
            color="primary"
            outlined
            large
          >
            رجوع
          </v-btn>
          <v-btn
            @click="getRev"
            class="px-6 text-capitalize"
            color="primary"
            large
            :disabled="!selected_unit && selected_unit !== 0"
          >
            عرض
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title>
            الوحدة الحالية:
            {{
              units.find(u => u.unitId == selected_unit) &&
              units.find(u => u.unitId == selected_unit).unitText
                ? units.find(u => u.unitId == selected_unit).unitText
                : ""
            }}
            <v-btn color="primary" icon @click="reSelectUnit()">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <template v-if="show_type == 'basic'">
        <template v-for="n in 2">
          <v-col cols="12" :key="n">
            <template
              v-for="(val, i) in Object.values(rev).filter(
                f => f.sections.includes(current_section) && f.model
              )"
            >
              <v-card
                class="mb-6"
                v-if="val.model && i + 1 == n + Math.floor(i / 2) * 2"
                :key="i"
              >
                <v-card-title>
                  {{ val.title }}
                  <v-chip class="ms-4">
                    {{ val.records.length }}
                  </v-chip>
                </v-card-title>
                <div>
                  <!-- <v-text-field
                    prepend-inner-icon="mdi-magnify"
                    dense
                    v-model="val.search"
                    filled
                  ></v-text-field> -->
                </div>
                <v-data-table
                  loading-text="جارِ تحميل البيانات"
                  multi-sort
                  :loading="val.loading"
                  :items="val.records"
                  :headers="val.headers"
                  :search.sync="val.search"
                  fixed-header
                  hide-default-header
                >
                  <template v-slot:header="table">
                    <table-header-filters
                      :items="val.records"
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
                  <template v-slot:item.conscripte.militaryId="{ item }">
                    <v-chip
                      color="transparent"
                      :to="`/soldiers_plus/${item.conscripte.militaryId}`"
                      @click.right="copyText(item.conscripte.militaryId)"
                    >
                      {{ item.conscripte.militaryId }}
                    </v-chip>
                  </template>
                  <template v-slot:item.conscripte.fullName="{ item }">
                    <v-chip
                      color="transparent"
                      :to="`/soldiers_plus/${item.conscripte.militaryId}`"
                      @click.right="copyText(item.conscripte.fullName)"
                    >
                      {{ item.conscripte.fullName }}
                    </v-chip>
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
                  <template v-slot:item.age="{ item }">
                    {{ item.birthDate | moment("from", "now") | removeMonzo }}
                  </template>
                  <template v-slot:item.dateRequired="{ item }">
                    {{
                      item.birthDate | calcDateRequired(item.degreeId, fixDate)
                    }}
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
                </v-data-table>
              </v-card>
            </template>
          </v-col>
        </template>
      </template>
      <template v-else>
        <!-- Complex View -->
        <v-col cols="12">
          <v-card>
            <v-tabs
              show-arrows
              v-model="selected_complex_table_i"
              height="60"
              slider-size="3"
            >
              <template
                v-for="(val, i) in Object.values(rev).filter(f =>
                  f.sections.includes(current_section)
                )"
              >
                <v-tab
                  class=" ls-0 text-body-1 grey--text"
                  active-class="primary--text"
                  :key="i + '_' + val.id"
                >
                  {{ val.title }}
                  <v-chip
                    class="ms-3"
                    :color="selected_complex_table_i == i ? 'primary' : ''"
                  >
                    {{ val.records.length }}
                  </v-chip>
                </v-tab>
              </template>
            </v-tabs>
            <v-divider></v-divider>
            <div>
              <v-text-field
                prepend-inner-icon="mdi-magnify"
                dense
                v-model="
                  Object.values(rev).filter(f =>
                    f.sections.includes(current_section)
                  )[selected_complex_table_i].search
                "
                filled
              >
                <template v-slot:append-outer>
                  <!-- :query="
                      `tasgeel/monthly_rev/${
                        Object.values(rev).filter(f =>
                          f.sections.includes(current_section)
                        )[selected_complex_table_i].id
                      }`
                    " -->
                  <printer-menu
                    :disabled="
                      Object.values(rev).filter(f =>
                        f.sections.includes(current_section)
                      )[selected_complex_table_i].records.length == 0
                    "
                    :data="
                      Object.values(rev).filter(f =>
                        f.sections.includes(current_section)
                      )[selected_complex_table_i].printer
                    "
                    fab
                  ></printer-menu>
                </template>
              </v-text-field>
            </div>
            <!-- <div>
              {{ selected_unit }}
              :
              {{
                filteredItems[`${selected_complex_table_i}-${selected_unit}`]
                  ? "True"
                  : "False"
              }}
            </div> -->
            <v-data-table
              loading-text="جارِ تحميل البيانات"
              multi-sort
              :loading="
                Object.values(rev).filter(f =>
                  f.sections.includes(current_section)
                )[selected_complex_table_i].loading
              "
              :items="
                Object.values(rev).filter(f =>
                  f.sections.includes(current_section)
                )[selected_complex_table_i].records
              "
              :headers="[
                ...Object.values(rev).filter(f =>
                  f.sections.includes(current_section)
                )[selected_complex_table_i].headers
              ]"
              :search.sync="
                Object.values(rev).filter(f =>
                  f.sections.includes(current_section)
                )[selected_complex_table_i].search
              "
              fixed-header
              hide-default-header
            >
              <template v-slot:header="table">
                <table-header-filters
                  :items="
                    Object.values(rev).filter(f =>
                      f.sections.includes(current_section)
                    )[selected_complex_table_i].records
                  "
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
              <template v-slot:item.procedures="{ item }">
                <div
                  v-if="
                    Object.values(rev).filter(f =>
                      f.sections.includes(current_section)
                    )[selected_complex_table_i].id == 'ignorants'
                  "
                >
                  <v-chip outlined>
                    بيان محو أمية
                  </v-chip>
                </div>
                <div else>
                  <template v-for="(proc, i) in item.procedures">
                    <v-chip outlined :key="i">
                      {{ proc }}
                    </v-chip>
                  </template>
                </div>
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
              <template v-slot:item.conscripte.militaryId="{ item }">
                <v-chip
                  color="transparent"
                  :to="`/soldiers_plus/${item.conscripte.militaryId}`"
                  @click.right="copyText(item.conscripte.militaryId)"
                >
                  {{ item.conscripte.militaryId }}
                </v-chip>
              </template>
              <template v-slot:item.conscripte.fullName="{ item }">
                <v-chip
                  color="transparent"
                  :to="`/soldiers_plus/${item.conscripte.militaryId}`"
                  @click.right="copyText(item.conscripte.fullName)"
                >
                  {{ item.conscripte.fullName }}
                </v-chip>
              </template>
              <template v-slot:item.age="{ item }">
                {{ item.birthDate | moment("from", "now") | removeMonzo }}
              </template>
              <template v-slot:item.dateRequired="{ item }">
                {{ item.birthDate | calcDateRequired(item.degreeId, fixDate) }}
              </template>
              <template v-slot:item.openRow="{ item }">
                <div>
                  <v-btn
                    @click="
                      goThere(
                        Object.values(rev).filter(f =>
                          f.sections.includes(current_section)
                        )[selected_complex_table_i].id == `late_demob`
                          ? `/ended_duty_main_data/${item.militaryId}`
                          : `/soldiers_plus/${item.militaryId}`
                      )
                    "
                    color="primary"
                    icon
                  >
                    <v-icon>mdi-link mdi-rotate-135</v-icon>
                  </v-btn>
                </div>
              </template>
            </v-data-table>
          </v-card>
        </v-col>
      </template>
    </v-row>
    <app-fab
      color="primary"
      @reSelectUnit="reSelectUnit"
      @getRev="getRev"
      @select_shown_tables="shown_tables_model = true"
      :items="fab_items"
    ></app-fab>
    <v-dialog
      scrollable
      v-model="shown_tables_model"
      max-width="900"
      v-if="isCurrentRoute(componentName)"
    >
      <v-card>
        <v-card-title>
          <v-row>
            <v-col class="py-0">
              الإعدادات
            </v-col>
            <v-col cols="auto" class="py-0">
              <v-btn @click="shown_tables_model = false" icon>
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-row>
            <v-col cols="6">
              <v-card tile flat class="pa-0 ma-0">
                <div class="text-body-1  pt-4 pb-1">
                  طريقة العرض
                </div>
                <v-divider></v-divider>
                <v-list three-line rounded class="px-0">
                  <v-list-item-group
                    color="primary"
                    v-model="show_type"
                    mandatory
                  >
                    <template v-for="(type, i) in show_types">
                      <v-list-item :key="i" :value="type.value">
                        <v-list-item-avatar>
                          <v-icon v-text="type.icon"></v-icon>
                        </v-list-item-avatar>
                        <v-list-item-content>
                          <v-list-item-title
                            v-text="type.text"
                          ></v-list-item-title>
                          <v-list-item-subtitle
                            v-text="type.desc"
                          ></v-list-item-subtitle>
                        </v-list-item-content>
                        <v-list-item-action>
                          <v-btn
                            icon
                            :color="type.value == show_type ? 'primary' : ''"
                          >
                            <v-icon
                              v-text="
                                type.value == show_type
                                  ? 'mdi-checkbox-marked-outline'
                                  : 'mdi-checkbox-blank-outline'
                              "
                            ></v-icon>
                          </v-btn>
                        </v-list-item-action>
                      </v-list-item>
                    </template>
                  </v-list-item-group>
                </v-list>
              </v-card>
            </v-col>
            <v-divider vertical></v-divider>
            <v-col>
              <v-card
                :disabled="show_type != 'basic'"
                tile
                flat
                class="pa-0 ma-0"
              >
                <div class="text-body-1  pt-4 pb-1">
                  إظهار / اخفاء الجداول
                </div>
                <v-divider></v-divider>
                <v-list rounded class="px-0">
                  <template v-for="(val, key, i) in rev">
                    <v-list-item
                      class="wrap"
                      v-if="val.sections.includes(current_section)"
                      :key="i"
                      @click="val.model = !val.model"
                    >
                      <v-list-item-avatar>
                        <v-icon v-text="val.icon"></v-icon>
                      </v-list-item-avatar>
                      <v-list-item-content>
                        <v-list-item-title
                          v-text="val.title"
                        ></v-list-item-title>
                        <v-list-item-subtitle
                          v-text="val.desc"
                        ></v-list-item-subtitle>
                      </v-list-item-content>
                      <v-list-item-action>
                        <v-btn icon :color="val.model ? 'primary' : ''">
                          <v-icon
                            v-text="
                              val.model
                                ? 'mdi-checkbox-marked-outline'
                                : 'mdi-checkbox-blank-outline'
                            "
                          ></v-icon>
                        </v-btn>
                      </v-list-item-action>
                    </v-list-item>
                    <!-- <v-divider
                      v-if="Object.keys(rev).length > i + 1"
                      :key="i + 'd'"
                    ></v-divider> -->
                  </template>
                </v-list>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
        <!-- <v-divider></v-divider>
        <v-card-actions class="px-4">
          <v-spacer></v-spacer>
          <v-btn
            large
            class="px-6"
            color="primary"
            outlined
            v-text="'رجوع'"
            @click="shown_tables_model = false"
          ></v-btn>
        </v-card-actions> -->
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "monthly_rev",
  mounted() {
    this.getUnits();
    if (!this.current_section) {
      this.$set(this, "current_section", this.params.section);
      console.log(this.params.section);
    }
    // if (this.params.unit) {
    //   this.$set(this, "units_model", false);
    //   this.$set(this, "selected_unit", Number(this.params.unit));
    //   this.getSoldiers();
    // }
  },
  filters: {
    removeMonzo(v) {
      return v.replace("منذ ", "").replace(" سنة", "");
    },
    calcDateRequired(birthdate, degreeId, fixDate) {
      let years = {
        15: 52,
        16: 52,
        17: 54,
        18: 56,
        19: 56
      };
      return degreeId && years[degreeId]
        ? fixDate(
            new Date(birthdate).setFullYear(
              new Date(birthdate).getFullYear() + years[degreeId]
            )
          )
        : "ليس له درجة";
    }
  },
  watch: {
    // "params.unit"(v) {
    //   if (v) {
    //     this.$set(this, "units_model", false);
    //     this.$set(this, "selected_unit", Number(v));
    //     this.getSoldiers();
    //   }
    // },
    selected_complex_table_i(v) {
      let key = Object.values(this.rev).filter(f =>
        f.sections.includes(this.current_section)
      )[v].id;
      this.$set(this, "selected_complex_table", key);
    },
    "params.section"(v) {
      if (v) {
        console.log("Changed");
        console.log(v);
        this.$set(this, "units_model", true);
        this.$set(this, "units_model_reselect", false);
        Object.keys(this.rev).forEach(key => {
          this.$set(this.rev[key], "records", []);
        });
        this.$set(this, "current_section", v);
      }
    }
    // params: {
    //   handler(v) {
    // if (a === b) {
    //     return;
    //   }
    //     this.$set(this, "units_model", true);
    //     this.units_model_reselect = false;
    //     Object.keys(this.rev).forEach(key => {
    //       this.$set(this.rev[key], "records", []);
    //     });
    //   },
    //   deep: true
    // }
  },
  computed: {
    params() {
      let index = this.$store.state.routes.findIndex(
          v => v.name == this.componentName
        ),
        params = {};
      if (index !== -1) {
        params = this.$store.state.routes[index].params;
      }
      return params;
    }
  },
  data: () => ({
    componentName: "monthly_rev",
    tableFilters: {},
    current_section: "1",
    show_type: "complex", // basic - complex
    selected_complex_table: "conscriptes",
    selected_complex_table_i: 0,
    show_types: [
      {
        text: "البدائية",
        desc:
          "عرض البيانات في جداول مختلفة, مما يجعل حجم الصفحة أكبر, ويضعف التركيز.",
        value: "basic",
        icon: ""
      },
      {
        text: "المتقدمة",
        desc:
          "عرض البيانات في جدول واحد, مما يزيد قوة التركيز, ويصغر حجم الصفحة.",
        value: "complex",
        icon: ""
      }
    ],
    fab_items: [
      {
        text: "الإعدادات",
        icon: "mdi-cog",
        color: "success",
        action: "select_shown_tables"
      },
      // {
      //   text: "إعادة تحميل الجداول",
      //   icon: "mdi-reload",
      //   color: "orange",
      //   action: "getRev"
      // },
      {
        text: "اختيار وحدة أخرى",
        icon: "mdi-cursor-default-click",
        color: "error",
        action: "reSelectUnit"
      }
    ],
    shown_tables_model: false,
    units_model: true,
    units_model_reselect: false,
    loading: false,
    units: [],
    selected_unit: "",
    // openRowHeader: {
    //   text: "",
    //   sortable: false,
    //   value: "openRow"
    // },
    rev: {
      non_commession: {
        date_keys: ["conscriptionDate"],
        id: "non_commession",
        sections: ["1"],
        title: " ",
        desc: "عرض ضباط الصف فقط داخل الوحدة",
        icon: "mdi-account-star-outline",
        model: true,
        loading: false,
        search: "",
        records: [],
        headers: [
          {
            text: "الرقم العسكري",
            sortable: true,
            value: "militaryId"
          },
          {
            text: "الدرجة",
            sortable: true,
            value: "degree.degreeType"
          },
          {
            text: "الإسم",
            sortable: true,
            value: "fullName"
          },

          {
            text: "تاريخ التطوع",
            sortable: true,
            value: "conscriptionDate"
          }
        ]
      },
      conscriptes: {
        date_keys: ["conscriptionDate", "demobilizationDate"],
        id: "conscriptes",
        sections: ["1"],
        title: "المجندين",
        desc: "عرض المجندين من قوة الوحدة",
        icon: "mdi-account-group-outline",
        model: true,
        loading: false,
        search: "",
        records: [],
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
            text: "الفئة",
            sortable: true,
            value: "group.groupName"
          },
          {
            text: "تاريخ التجنيد",
            sortable: true,
            value: "conscriptionDate"
          },
          {
            text: "تاريخ التسريح",
            sortable: true,
            value: "demobilizationDate"
          }
        ]
      },
      medicalCommittees: {
        date_keys: ["medicalCommittees.committeeDate"],
        id: "medicalCommittees",
        sections: ["1", "2", "3"],
        title: "اللجان الطبية",
        desc: "عرض كل من له لجنة طبية",
        model: true,
        loading: false,
        search: "",
        records: [],
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
            text: "رقم اللجنة",
            sortable: true,
            value: "medicalCommittees.committeeNumber"
          },
          {
            text: "تاريخ اللجنة",
            sortable: true,
            value: "medicalCommittees.committeeDate"
          },
          {
            text: "قرار اللجنة",
            sortable: true,
            value: "medicalCommittees.committee.displayedText"
          },
          {
            text: "نوع اللجنة",
            sortable: true,
            value: "medicalCommittees.medicalCommitteeType.displayedText"
          },
          {
            text: "الإجراءات",
            sortable: true,
            value: "procedures"
          }
        ]
      },
      injuries: {
        date_keys: ["injuries.injuryDate"],
        id: "injuries",
        sections: ["1", "2"],
        title: "الإصابات",
        desc: "عرض كل من به إصابة أو مرض",
        model: true,
        loading: false,
        search: "",
        records: [],
        headers: [
          {
            text: "الرقم العسكري",
            sortable: true,
            value: "militaryId"
          },
          {
            text: "الدرجة",
            sortable: true,
            value: "degree.degreeType"
          },
          {
            text: "الإسم",
            sortable: true,
            value: "fullName"
          },

          {
            text: "تاريخ الحالة",
            sortable: true,
            value: "injuries.injuryDate"
          },
          {
            text: "الإجراءات",
            sortable: true,
            value: "procedures"
          }
        ]
      },
      ignorants: {
        date_keys: ["conscriptionDate", "demobilizationDate"],
        id: "ignorants",
        sections: ["1", "2"],
        title: "الأميين",
        desc: "عرض الأميين فقط داخل الوحدة",
        model: true,
        loading: false,
        search: "",
        records: [],
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
            text: "الفئة",
            sortable: true,
            value: "group.groupName"
          },
          {
            text: "تاريخ التجنيد",
            sortable: true,
            value: "conscriptionDate"
          },
          {
            text: "تاريخ التسريح",
            sortable: true,
            value: "demobilizationDate"
          },
          {
            text: "الإجراءات",
            sortable: true,
            value: "procedures"
          }
        ]
      },
      courts: {
        date_keys: ["courts.courtDate"],
        id: "courts",
        sections: ["1", "2", "3"],
        title: "المحاكم",
        desc: "عرض كل من له محكمة",
        model: true,
        loading: false,
        search: "",
        records: [],
        headers: [
          {
            text: "الرقم العسكري",
            sortable: true,
            value: "militaryId"
          },
          {
            text: "الدرجة",
            sortable: true,
            value: "degree.degreeType"
          },
          {
            text: "الإسم",
            sortable: true,
            value: "fullName"
          },

          {
            text: "تاريخ المحكمة",
            sortable: true,
            value: "courts.courtDate"
          },
          {
            text: "الإجراءات",
            sortable: true,
            value: "procedures"
          }
        ]
      },
      // For Enhaa
      kashf40: {
        date_keys: [
          "birthDate",
          "conscriptionDate",
          "letterSendingDate40",
          "confirmationDate40",
          "reviewDate40"
        ],
        id: "kashf40",
        sections: ["3"],
        title: "كشف الأربعين",
        desc: "عرض كشف نسب العجز الذي يخضع له ضباط الصف عند عامهم الأربعين.",
        model: true,
        loading: false,
        search: "",
        records: [],
        headers: [
          {
            text: "الرقم العسكري",
            sortable: true,
            value: "militaryId"
          },
          {
            text: "الدرجة",
            sortable: true,
            value: "degree.degreeType"
          },
          {
            text: "الإسم",
            sortable: true,
            value: "fullName"
          },
          {
            text: "الفئة",
            sortable: true,
            value: "group.groupName"
          },
          {
            text: "تاريخ الميلاد",
            sortable: true,
            value: "birthDate"
          },
          {
            text: "تاريخ التطوع",
            sortable: true,
            value: "conscriptionDate"
          },
          {
            text: "السن",
            sortable: true,
            value: "age"
          },
          {
            text: "تاريخ مخاطبة الوحدة",
            sortable: true,
            value: "letterSendingDate40"
          },
          {
            text: "تاريخ التصديق",
            sortable: true,
            value: "confirmationDate40"
          },
          {
            text: "تاريخ العرض",
            sortable: true,
            value: "reviewDate40"
          },
          {
            text: "الإجراءات",
            sortable: true,
            value: "procedures"
          }
        ]
      },
      kashf_bologSen: {
        date_keys: [],
        id: "kashf_bologSen",
        sections: ["3"],
        title: "كشف بلوغ السن",
        desc:
          "عرض كشف بالضباط الشرفيين والضباط الصف الذين اقترب موعد إنهاء خدمتهم لبلوغ السن القانوني.",
        model: true,
        loading: false,
        search: "",
        records: [],
        headers: [
          {
            text: "الرقم العسكري",
            sortable: true,
            value: "militaryId"
          },
          {
            text: "الدرجة",
            sortable: true,
            value: "degree.degreeType"
          },
          {
            text: "الإسم",
            sortable: true,
            value: "fullName"
          },
          {
            text: "الفئة",
            sortable: true,
            value: "group.groupName"
          },

          {
            text: "تاريخ الميلاد",
            sortable: true,
            value: "birthDate"
          },
          {
            text: "تاريخ التطوع",
            sortable: true,
            value: "conscriptionDate"
          },
          {
            text: "السن",
            sortable: false,
            value: "age"
          },
          {
            text: "التاريخ المقرر لبلوغ السن",
            sortable: false,
            value: "dateRequired"
          },
          {
            text: "الإجراءات",
            sortable: true,
            value: "procedures"
          }
        ]
      },
      late_demob: {
        date_keys: [],
        id: "late_demob",
        sections: ["3"],
        title: "المتأخرات",
        desc: "عرض متأخرات قسم الإنهاء الخاصة بالوحدة المحددة.",
        model: true,
        loading: false,
        search: "",
        records: [],
        headers: [
          {
            text: "الرقم العسكري",
            sortable: true,
            value: "conscripte.militaryId"
          },
          {
            text: "الدرجة",
            sortable: true,
            value: "conscripte.degree.degreeType"
          },
          {
            text: "الإسم",
            sortable: true,
            value: "conscripte.fullName"
          }
        ]
      }
    }
  }),
  methods: {
    reSelectUnit() {
      this.units_model = true;
      this.units_model_reselect = true;
    },
    getUnits() {
      this.loading = true;
      this.api("tables/units/all_units")
        .then(records => {
          this.$set(this, "units", records.data);
        })
        .catch(error => {
          console.log(error);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getRev() {
      // Soldiers
      let unit = this.selected_unit;
      if (![null, undefined, ""].includes(unit)) {
        // this.goThere(`/monthly_rev/${this.current_section}/${unit}`);
        this.getSoldiers();
      } else {
        this.showError("من فضلك قم بتحديد الوحدة أولاً");
      }
    },
    getSoldiers() {
      let unit = this.selected_unit;
      this.$set(this, "units_model", false);
      Object.keys(this.rev).forEach(key => {
        this.$set(this.rev[key], "loading", true);
      });
      this.api("sections/tasgeel/monthly_rev/get_all", {
        unitId: unit,
        isEnhaa: this.current_section == "3"
      })
        .then(records => {
          let data = records.data;
          Object.keys(this.rev).forEach(key => {
            if (data[key]) {
              let fixedData = this.fixDates(
                  data[key],
                  this.rev[key].date_keys,
                  true
                ),
                printer = {
                  datas: fixedData,
                  unit: this.units.filter(u => u.unitId == unit)[0].unitText,
                  excelKey: "datas",
                  excelHeaders: this.rev[key].headers
                };
              this.$set(this.rev[key], "records", fixedData);
              this.$set(this.rev[key], "printer", printer);
            }
          });
        })
        .catch(error => {
          console.log(error);
        })
        .finally(() => {
          Object.keys(this.rev).forEach(key => {
            this.$set(this.rev[key], "loading", false);
          });
        });
    }
  }
};
</script>
